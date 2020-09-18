const express = require('express');
require('./db/mongoose');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin/user');
const userSeeding = require('./seeding/users.seed');

const app = express();

app.use(express.json());
app.use(userRoutes);

app.use(adminRoutes);

app.use(userSeeding);

module.exports = app;
