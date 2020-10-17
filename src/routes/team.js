const express = require("express");
const Team = require("../models/team");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const router = new express.Router();
const checkCache = require("../middlewares/checkCache");
const redisClient = require("../db/redis");

const { v4: uuid_v4 } = require("uuid");
const algoliaclient = require("../search/algolia");

const teamIndex = algoliaclient.initIndex("teams");

router.post("/teams/add", auth, admin, async (req, res) => {
  const team = new Team(req.body);

  try {
    const objectID = uuid_v4();

    Object.assign(team, { objectID });

    await team.save();

    await teamIndex.saveObject(team);

    res.status(201).send(team);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.patch("/teams/:id/update", auth, admin, async (req, res) => {
  const { params, body } = req;

  const updates = Object.keys(body);

  try {
    const team = await Team.findById(params.id);

    if (!team) {
      return res.status(404).send();
    }

    updates.forEach((update) => (team[update] = body[update]));

    await team.save();

    await teamIndex.partialUpdateObject(team);

    let checkKey = await redisClient.getAsync(params.id);

    if (checkKey) {
      redisClient.setex(params.id, 3600, JSON.stringify(team));
    }

    res.send(team);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/teams/:id", auth, admin, async (req, res) => {
  const { params } = req;

  checkCache(params.id);

  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      res.status(404).send({ Error: "Team not found" });
    }

    redisClient.setex(params.id.toString(), 3600, JSON.stringify(team));

    res.send(team);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/teams", auth, admin, async (req, res) => {
  checkCache("all_teams");

  try {
    const teams = await Team.find({});

    redisClient.setex("all_teams", 3600, JSON.stringify(teams));

    res.send(teams);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/teams/:id/delete", auth, admin, async (req, res) => {
  const { params } = req;

  try {
    const team = await Team.findById(params.id);

    if (team) {
      await Team.findByIdAndDelete(params.id);

      await teamIndex.deleteObject(team.objectID);

      res.send({ message: "team successfully deleted", team });

      return;
    }

    res.send({ Error: "Team not found" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
