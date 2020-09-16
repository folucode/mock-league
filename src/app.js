const express = require('express');
require('./db/mongoose');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());
app.use(userRoutes);

module.exports = app;
