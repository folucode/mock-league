const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const { v4: uuid_v4 } = require("uuid");
const Fixture = require("../../src/models/fixture");
const Team = require("../../src/models/team");

const id_one = new mongoose.Types.ObjectId();
const regularUser = {
  _id: id_one,
  name: "Tosin Moro",
  email: "tosin.moro@example.com",
  password: "Yx52RKRB!",
  objectID: uuid_v4(),
  tokens: [
    {
      token: jwt.sign({ _id: id_one }, process.env.JWT_SECRET),
    },
  ],
};

const id_two = new mongoose.Types.ObjectId();
const adminUser = {
  _id: id_two,
  name: "Jane Marie",
  email: "jane.marie@test.net",
  role: "admin",
  objectID: uuid_v4(),
  password: "Yx52RKRB!",
  tokens: [
    {
      token: jwt.sign({ _id: id_two }, process.env.JWT_SECRET),
    },
  ],
};

const fixture_id = uuid_v4();
const id_three = new mongoose.Types.ObjectId();
const fixture = {
  _id: id_three,
  team_a: "Congo United",
  team_b: "Atlas FC",
  status: "suspended",
  objectID: uuid_v4(),
  fixture_id,
  link: `/fixtures/Congo-United-v-Atlas-FC/${fixture_id}`,
};

const id_four = new mongoose.Types.ObjectId();
const team = {
  _id: id_four,
  fullname: "Crimon FC",
  nickname: "Tigers",
  short_name: "CFC",
  objectID: uuid_v4(),
  founded: 1970,
};

const setupData = async () => {
  await User.deleteMany();
  await Fixture.deleteMany();
  await Team.deleteMany();
  await new User(regularUser).save();
  await new User(adminUser).save();
  await new Fixture(fixture).save();
  await new Team(team).save();
};

module.exports = {
  regularUser,
  adminUser,
  id_one,
  id_two,
  setupData,
  fixture,
  id_three,
  id_four,
  fixture_id,
};
