const express = require("express");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const router = new express.Router();
const algoliaclient = require("../search/algolia");
const { v4: uuid_v4 } = require("uuid");
const redisClient = require("../db/redis");
const checkCache = require("../middlewares/checkCache");

const userIndex = algoliaclient.initIndex("users");

router.post("/users/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    const objectID = uuid_v4();

    Object.assign(user, { objectID });

    await user.save();
    await userIndex.saveObject(user, {
      autoGenerateObjectIDIfNotExist: true,
    });

    const token = await user.generateAuthToken();

    res.status(201).send({
      message: "Account succesfully created",
      data: { user, token },
      success: true,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    req.session.key = user;

    res.send({
      message: "Account succesfully logged in",
      data: { user, token },
      success: true,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send({ data: req.user, success: true });
});

router.patch("/users/me", auth, async (req, res) => {
  const { user, body } = req;

  const params = ({ name, email, password } = body);

  const updates = Object.keys(params);

  try {
    if (!user) {
      return res.status(401).send();
    }
    updates.forEach((update) => (user[update] = body[update]));

    await user.save();

    await userIndex.partialUpdateObject(user);

    res.send({
      message: "Profile successfully updated",
      data: req.user,
      success: true,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  const { tokens } = req.user;

  try {
    req.user.tokens = tokens.filter((token) => {
      return token.token !== req.token;
    });

    if (req.session.id) {
      redisClient.del(`sess:${req.session.id}`);
      req.session.destroy();
    }

    await req.user.save();

    res.send({ message: "succesfully logged out", success: true });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send({ message: "succesfully logged out", success: true });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
});

// Admin only routes
router.get("/users/all", auth, admin, async (req, res) => {
  checkCache("all_users");

  try {
    const users = await User.find({});

    redisClient.setex("all_users", 3600, JSON.stringify(users));
    res.send({
      message: "fetched all users successfully",
      data: users,
      success: true,
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
});

module.exports = router;
