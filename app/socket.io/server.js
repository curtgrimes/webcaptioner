const WebSocket = require('ws');
const redis = require('./../api/redis');
const getSubscriberCount = require('../api/routes/rooms/getSubscriberCount');

module.exports = {
    createSocket(server) {
      const redisSharedClient = redis.getSharedClient();

      const wss = new WebSocket.Server({
        server,
        maxPayload: 1024 * 100, // bytes
      });
      wss.on('connection', (socket) => {
        let redisStandaloneClient;
        socket._wc = {};

        socket.on('message', async (message) => {
          if (!redisSharedClient || !redisSharedClient.connected) {
            console.log('Redis shared client not connected.');
            return;
          }

          let json;
          try {
            json = JSON.parse(message);
          }
          catch(e) {
            // Could not parse JSON
            return;
          }
          
          if (json.action === 'authenticateRoomOwner') {
            const roomKey = 'rooms:' + json.roomId;
            const ownerKeyForRoom = await redisSharedClient.hgetAsync(roomKey, 'ownerKey');
        
            if (!ownerKeyForRoom) {
                // That room ID doesn't exist (or for some reason it doesn't have an owner key)
            }
            else if (ownerKeyForRoom === json.ownerKey) {
                // Successfully authenticated
                socket._wc.room = {
                  ownerRoomKey: roomKey,
                }
                redisStandaloneClient = redis.getNewClient();
                redisStandaloneClient.subscribe(roomKey + ':owner');

                socket.send(JSON.stringify({
                  mutation: 'SET_SHARE_SUBSCRIBER_COUNT',
                  subscriberCount: await getSubscriberCount(roomKey),
                }));

                redisStandaloneClient.on("message", async (channel, message) => {
                  if (message === 'updateSubscribers') {
                    socket.send(JSON.stringify({
                      mutation: 'SET_SHARE_SUBSCRIBER_COUNT',
                      subscriberCount: await getSubscriberCount(roomKey),
                    }));
                  }
                });
            }
            else {
                // Room exists, but correct ownerKey wasn't given
            }
          }
          else if (json.action === 'mutation') {
            // If a roomKey is set, they've authenticated successfully before
            if (socket._wc.room && socket._wc.room.ownerRoomKey) {
              redisSharedClient.publish(socket._wc.room.ownerRoomKey, JSON.stringify({
                mutation: json.mutation,
                payload: json.payload,
              }));
            }
            else {
              // Haven't authenticated successfully
              socket.send(JSON.stringify({
                mutation: 'share/SET_EXPIRED',
                expired: true,
              }));
            }
          }
          else if (json.action == 'subscribeToRoom') {
            // TODO handle multiple subscriptions from same client??
            if (json.roomId) {
              redisStandaloneClient = redis.getNewClient();
              const roomKey = 'rooms:' + json.roomId;
              const stealth = json.s;

              // Save reference that we will use when closing this socket to notify
              // owner that subscriptions have changed
              socket._wc.room = {
                subscriberRoomKey: roomKey,
                stealth,
              }

              if (stealth) {
                redisSharedClient.hincrby(socket._wc.room.subscriberRoomKey, 'stealthSubscribers', 1);
              }

              redisStandaloneClient.subscribe(roomKey);
              redisSharedClient.publish(roomKey + ':owner', 'updateSubscribers');
              redisStandaloneClient.on("message", (channel, message) => {
                if (message !== 'updateSubscribers') {
                  try {
                    let {mutation, payload} = JSON.parse(message);
                    if (socket.readyState === socket.OPEN) {
                      socket.send(JSON.stringify({
                        mutation,
                        ...payload,
                      }));
                    }
                    else {
                      // TODO unsubscribe
                    }
                  }
                  catch (e) {
                    // Unable to parse message
                  }
                }
              });
            }
          }
        });

        socket.on('close', function () {
          if (socket._wc.room && socket._wc.room.subscriberRoomKey) {
            redisSharedClient.publish(socket._wc.room.subscriberRoomKey + ':owner', 'updateSubscribers');


            if (socket._wc.room.stealth) {
              redisSharedClient.hincrby(socket._wc.room.subscriberRoomKey, 'stealthSubscribers', -1);
            }
          }
          
          if (redisStandaloneClient && redisStandaloneClient.connected) {
            redisStandaloneClient.quit();
          }
        });        
      });
    },
};