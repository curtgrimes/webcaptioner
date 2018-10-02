const {promisify} = require('util');
const redis = require('redis');
let sharedClient;

function getNewClient() {
    let client = redis.createClient(process.env.REDIS_URL);
    client.getAsync = promisify(client.get).bind(client);
    client.existsAsync = promisify(client.exists).bind(client);
    client.hgetAsync = promisify(client.hget).bind(client);
    client.delAsync = promisify(client.del).bind(client);

    client.on('error', function (err) {
        console.log('Redis: ' + err);
    });

    return client;
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