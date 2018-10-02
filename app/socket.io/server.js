const WebSocket = require('ws');
const redis = require('./../api/redis');

module.exports = {
    createSocket(server) {
      const redisSharedClient = redis.getSharedClient();
      const wss = new WebSocket.Server({server});
      wss.on('connection', (socket) => {
        let redisStandaloneClient;
        socket._wc = {};

        socket.on('message', async (message) => {
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
                  roomKey,
                }
                redisStandaloneClient = redis.getNewClient();
            }
            else {
                // Room exists, but correct ownerKey wasn't given
            }
          }
          else if (json.action === 'mutation') {
            // If a roomKey is set, they've authenticated successfully before
            if (socket._wc.room && socket._wc.room.roomKey) {
              redisStandaloneClient.publish(socket._wc.room.roomKey, JSON.stringify({
                mutation: json.mutation,
                payload: json.payload,
              }));
            }
            else {
              // Haven't authenticated successfully
              socket.send(JSON.stringify({error: {notAuthenticated:true}}));
            }
          }
          else if (json.action == 'subscribeToRoom') {
            // TODO handle multiple subscriptions from same client??
            if (json.roomId) {
              redisStandaloneClient = redis.getNewClient();
              redisStandaloneClient.subscribe('rooms:' + json.roomId);
              redisStandaloneClient.on("message", (channel, message) => {
                // TODO Add try/catch for json parse
                // AND use ws max payload option
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
              });
            }
          }
        });
      });
        // let io = socketio().attach(server);
        // io
        //   .on('connection', function (socket) {
        //   console.log('connection');
        //   socket.emit('news', { hello: 'world' });
        //   socket.on('my other event', function (data) {
        //     console.log(data);
        //   });

        //   socket.on('error', (error) => {
        //     console.log('socket error');
        //     console.log(error);
        //   });
        // });
    },
};