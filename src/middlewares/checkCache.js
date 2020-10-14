const redisClient = require("../db/redis");

function checkCache(param) {
  return (req, res, next) => {
    redisClient.get(param, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }

      if (data !== null) {
        res.send(JSON.parse(data));
      } else {
        next();
      }
    });
  };
}

module.exports = checkCache;
