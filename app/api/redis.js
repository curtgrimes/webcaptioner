const {promisify} = require('util');
const redis = require('redis');
let sharedClient;

function getNewClient() {
    let client = redis.createClient(process.env.REDIS_URL, {
        retry_strategy: function (options) {
            if (options.error && options.error.code === 'ECONNREFUSED') {
                // End reconnecting on a specific error and flush all commands with
                // a individual error
                return new Error('The server refused the connection');
            }
            if (options.total_retry_time > 1000 * 60 * 60) {
                // End reconnecting after a specific timeout and flush all commands
                // with a individual error
                return new Error('Retry time exhausted');
            }
            if (options.attempt > 10) {
                // End reconnecting with built in error
                return undefined;
            }
            // reconnect after
            return Math.min(options.attempt * 100, 3000);
        }
    });
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