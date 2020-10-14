const express = require("express");
require("./db/mongoose");
// const session = require("express-session");
// const redisStore = require("connect-redis")(session);
const userRoutes = require("./routes/user");
const teamRoutes = require("./routes/team");
const fixturesRoutes = require("./routes/fixture");
const userSeeding = require("./seeding/users.seed");
const teamSeeding = require("./seeding/teams.seed");
const fixtureSeeding = require("./seeding/fixtures.seed");
const rateLimit = require("express-rate-limit");

const { v4: uuid_v4 } = require("uuid");

const searchRoute = require("./routes/search");
const redisClient = require("./db/redis");

const app = express();

app.use(express.json());
 
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 100
});
 
// app.use(
//   session({
//     genid: (req) => {
//       return uuid_v4();
//     },
//     name: "_redis",
//     secret: "Yx52RKRB!",
//     store: new redisStore({
//       client: redisClient,
//       ttl: 260,
//     }),
//     cookie: { httpOnly: true, secure: true, sameSite: true, maxAge: 600000 },
//     saveUninitialized: true,
//     resave: false,
//   })
// );
app.use(limiter);

app.use(userRoutes);
app.use(teamRoutes);
app.use(fixturesRoutes);
app.use(searchRoute);

app.use(userSeeding);
app.use(teamSeeding);
app.use(fixtureSeeding);

module.exports = {
  app,
  redisClient,
};
