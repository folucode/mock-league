const Bluebird = require("bluebird");
const redis = require("redis");

Bluebird.promisifyAll(redis);

const redisClient = redis.createClient(6379, "localhost");

module.exports = redisClient;
