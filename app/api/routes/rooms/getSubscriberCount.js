const redis = require('../../redis');

module.exports = async function(roomKey) {
    const redisSharedClient = redis.getSharedClient();
    return await new Promise((resolve, reject) => {
        setTimeout(async () => {
            let stealthSubscribers = await redisSharedClient.hgetAsync(roomKey, 'stealthSubscribers');
            let subscriberCountResult = await redisSharedClient.pubsubAsync('NUMSUB', roomKey);

            // First element in array is channel name; second is count
            let subscribers = subscriberCountResult && subscriberCountResult.length > 1 ? subscriberCountResult[1] : 0;
            
            subscribers = subscribers - stealthSubscribers;

            resolve(subscribers < 0 ? 0 : subscribers);
        }, 500); // wait for socket to close on some events
    });
}