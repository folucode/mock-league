const express = require('express');
require('./db/mongoose');
const userRoutes = require('./routes/user');
const teamRoutes = require('./routes/team');
const fixturesRoutes = require('./routes/fixture');
const userSeeding = require('./seeding/users.seed');
const teamSeeding = require('./seeding/teams.seed');

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(teamRoutes);
app.use(fixturesRoutes);

app.use(userSeeding);
app.use(teamSeeding);

module.exports = app;
