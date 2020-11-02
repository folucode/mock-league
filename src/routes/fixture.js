const express = require("express");
const Fixture = require("../models/fixture");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { v4: uuid_v4 } = require("uuid");
const router = new express.Router();

const algoliaclient = require("../search/algolia");
const redisClient = require("../db/redis");
const checkCache = require("../middlewares/checkCache");

const fixtureIndex = algoliaclient.initIndex("fixtures");

router.post("/fixtures/new", auth, admin, async (req, res) => {
  const { team_a, team_b, date, status } = req.body;

  try {
    const team_a_formatted = Fixture.formatTeamName(team_a);
    const team_b_formatted = Fixture.formatTeamName(team_b);

    const fixture_id = uuid_v4();

    const objectID = uuid_v4();

    const link = `/fixtures/${team_a_formatted}-v-${team_b_formatted}/${fixture_id}`;

    const computedFixture = {
      team_a,
      team_b,
      date,
      status,
      link,
      fixture_id,
      objectID,
    };

    const fixture = new Fixture(computedFixture);

    await fixture.save();

    await fixtureIndex.saveObject(fixture);

    res.status(201).send({
      message: "Fixture successfully created",
      data: fixture,
      success: true,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

router.patch("/fixtures/:id/update", auth, admin, async (req, res) => {
  const { params, body } = req;

  const updates = Object.keys(body);
  const allowedUpdates = ["status", "team_a", "team_b"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const fixture = await Fixture.findById(params.id);

    if (!fixture) {
      res.status(404).send({ Error: "Fixture not found" });
    }

    updates.forEach((update) => (fixture[update] = body[update]));

    await fixture.save();

    await fixtureIndex.partialUpdateObject(fixture);

    let checkKey = await redisClient.getAsync(params.id);

    if (checkKey) {
      redisClient.setex(params.id, 3600, JSON.stringify(fixture));
    }

    res.send({
      message: "Fixture successfully updated",
      data: fixture,
      success: true,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

router.get("/fixtures/:id", auth, async (req, res) => {
  const { params } = req;

  checkCache(params.id);

  try {
    const fixture = await Fixture.where({ fixture_id: params.id }).findOne();

    if (!fixture) {
      return res.status(400).send({ message: "Fixture not found" });
    }

    redisClient.setex(params.id, 3600, JSON.stringify(fixture));

    res.send({
      message: "Fixture successfully retrieved",
      data: fixture,
      success: true,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

router.get("/fixtures/status/:status", auth, async (req, res) => {
  const { params } = req;

  checkCache(params.status);

  try {
    const fixtures = await Fixture.where({ status: params.status }).find();

    if (!fixtures) {
      return res.status(400).send({ message: `No ${params.status} Fixtures` });
    }

    redisClient.setex(params.status, 3600, JSON.stringify(fixtures));

    res.send({
      message: "Fixture successfully retrieved",
      data: fixtures,
      success: true,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

router.delete("/fixtures/:id/delete", auth, admin, async (req, res) => {
  const { params } = req;

  try {
    const fixture = await Fixture.findById(params.id);

    if (fixture) {
      await Fixture.findByIdAndDelete(params.id);

      await fixtureIndex.deleteObject(fixture.objectID);

      res.send({
        message: "Fixture successfully deleted",
        data: fixture,
        success: true,
      });

      return;
    }

    res.send({ message: "Fixture not found" });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

module.exports = router;
