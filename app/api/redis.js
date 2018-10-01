const {promisify} = require('util');
let sharedClient;

function getNewClient() {
    let redisClient = require('redis').createClient(process.env.REDIS_URL);
    redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
    redisClient.existsAsync = promisify(redisClient.exists).bind(redisClient);
    redisClient.hgetAsync = promisify(redisClient.hget).bind(redisClient);
    redisClient.delAsync = promisify(redisClient.del).bind(redisClient);
    return redisClient;
}

function getSharedClient() {
    if (!sharedClient) {
        sharedClient = getNewClient();
    }
    return sharedClient;
}

module.exports = {
    getNewClient,
    getSharedClient,
}