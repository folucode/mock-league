const Bluebird = require("bluebird");
const redis = require("redis");

Bluebird.promisifyAll(redis);

const redisClient = redis.createClient(process.env.REDIS_URL);

module.exports = redisClient;
