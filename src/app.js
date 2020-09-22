const express = require('express');
require('./db/mongoose');
const userRoutes = require('./routes/user');
const teamRoutes = require('./routes/team');
const userSeeding = require('./seeding/users.seed');

const app = express();

app.use(express.json());
app.use(userRoutes);

app.use(teamRoutes);

app.use(userSeeding);

module.exports = app;
