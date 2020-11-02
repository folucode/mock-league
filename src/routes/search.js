const express = require("express");
const redisClient = require("../db/redis");
const checkCache = require("../middlewares/checkCache");
const router = new express.Router();
const algoliaclient = require("../search/algolia");

router.get("/search/:query", async (req, res) => {
  const { query } = req.params;

  checkCache(query);

  try {
    const queries = [
      {
        indexName: "teams",
        query,
      },
      {
        indexName: "fixtures",
        query,
      },
    ];

    const results = await algoliaclient.multipleQueries(queries);

    redisClient.setex(query, 3600, JSON.stringify(results));

    res.send({
      message: "Fetched search results",
      results,
      success: true,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

module.exports = router;
