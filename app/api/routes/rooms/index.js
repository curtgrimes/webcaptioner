const rooms = require('express').Router();
const redis = require('./../../redis');
const nanoid = require('nanoid');

const expireHours = 6;

rooms.post('/', async (req, res, next) => {
    let redisClient = redis.getSharedClient();
    if (!redisClient || !redisClient.connected) {
        res.sendStatus(500);
        return;
    }

    let roomKey, roomId, roomKeyAlreadyExists;
    do {
        roomId = nanoid(8);
        roomKey = 'rooms:' + roomId;
        roomKeyAlreadyExists = await redisClient.existsAsync(roomKey) === 1;
    }
    while (roomKeyAlreadyExists); // repeat roomkey generation on collision

    const ownerKey = nanoid(50);

    redisClient.hmset(roomKey, 'ownerKey', ownerKey);
    redisClient.expire(roomKey, 60 * 60 * expireHours);

    res.send(JSON.stringify(
        {
            roomId, 
            ownerKey,
            url: process.env.HOSTNAME + '/s/' + roomId,
            expireDate: new Date((new Date()).getTime() + (1000 * 60 * 60 * expireHours)),
        }
    ));
    return;
});

rooms.delete('/:roomId', async (req, res) => {
    let redisClient = redis.getSharedClient();
    if (!redisClient || !redisClient.connected) {
        res.sendStatus(500);
        return;
    }

    const {roomId} = req.params;
    const {ownerKey} = req.query;

    if (!roomId || !ownerKey) {
        res.sendStatus(403);
        return;
    }
    const roomKey = 'rooms:' + roomId;
    const ownerKeyForRoom = await redisClient.hgetAsync(roomKey, 'ownerKey');

    if (!ownerKeyForRoom) {
        // That room ID doesn't exist (or for some reason it doesn't have an owner key)
        res.sendStatus(404);
    }
    else if (ownerKeyForRoom === ownerKey) {
        // Delete this room
        await redisClient.delAsync(roomKey);
        res.sendStatus(200);
    }
    else {
        // Room exists, but correct ownerKey wasn't given
        res.sendStatus(403);
    }
});

module.exports = rooms;