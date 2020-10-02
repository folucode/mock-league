const express = require("express");
require("./db/mongoose");
const redis = require("redis");
const userRoutes = require("./routes/user");
const teamRoutes = require("./routes/team");
const fixturesRoutes = require("./routes/fixture");
const userSeeding = require("./seeding/users.seed");
const teamSeeding = require("./seeding/teams.seed");
const fixtureSeeding = require("./seeding/fixtures.seed");

const searchRoute = require("./routes/search");

const app = express();
const client = redis.createClient(6379, "localhost");

app.use(express.json());
app.use(userRoutes);
app.use(teamRoutes);
app.use(fixturesRoutes);
app.use(searchRoute);

app.use(userSeeding);
app.use(teamSeeding);
app.use(fixtureSeeding);

module.exports = {
  app,
  client
};
