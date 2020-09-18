const express = require('express');
require('./db/mongoose');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin/user');

const app = express();

app.use(express.json());
app.use(userRoutes);

app.use(adminRoutes);

module.exports = app;
