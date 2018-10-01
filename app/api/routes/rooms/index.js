const rooms = require('express').Router();
const redis = require('./../../redis').getSharedClient();
const nanoid = require('nanoid');

const expireHours = 6;

rooms.post('/', async (req, res, next) => {
    let roomKey, roomId, roomKeyAlreadyExists;
    do {
        roomId = nanoid(8);
        roomKey = 'rooms:' + roomId;
        roomKeyAlreadyExists = await redis.existsAsync(roomKey) === 1;
    }
    while (roomKeyAlreadyExists); // repeat roomkey generation on collision

    const ownerKey = nanoid(50);

    redis.hmset(roomKey, 'ownerKey', ownerKey);
    redis.expire(roomKey, 60 * 60 * expireHours);

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
    const {roomId} = req.params;
    const {ownerKey} = req.query;

    if (!roomId || !ownerKey) {
        res.sendStatus(403);
        return;
    }
    const roomKey = 'rooms:' + roomId;
    const ownerKeyForRoom = await redis.hgetAsync(roomKey, 'ownerKey');

    if (!ownerKeyForRoom) {
        // That room ID doesn't exist (or for some reason it doesn't have an owner key)
        res.sendStatus(404);
    }
    else if (ownerKeyForRoom === ownerKey) {
        // Delete this room
        await redis.delAsync(roomKey);
        res.sendStatus(200);
    }
    else {
        // Room exists, but correct ownerKey wasn't given
        res.sendStatus(403);
    }
});

module.exports = rooms;