const { app } = require("../src/app");
const request = require("supertest");
const User = require("../src/models/user");
const {
  regularUser,
  id_one,
  setupData,
  adminUser,
  id_three,
  fixture_id,
  id_four,
} = require("./fixtures/db");
const Fixture = require("../src/models/fixture");
const Team = require("../src/models/team");

beforeEach(setupData);

test("Should create new team", async () => {
  await request(app)
    .post("/teams/add")
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .send({
      fullname: "Crimon FC",
      nickname: "Tigers",
      short_name: "CFC",
      founded: 1970,
    })
    .expect(201);
});

test("Should not create new team", async () => {
  await request(app)
    .post("/teams/add")
    .set("Authorization", `Bearer ${regularUser.tokens[0].token}`)
    .send({
      fullname: "Crimon FC",
      nickname: "Tigers",
      short_name: "CFC",
      founded: 1970,
    })
    .expect(404);
});

test("Should update team", async () => {
  await request(app)
    .patch(`/teams/${id_four}/update`)
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .send({
      fullname: "Crimoni FC",
      founded: 1971,
    })
    .expect(200);

  //check database for confirmation
  const team = await Team.findById(id_four);
  expect(team.fullname).toBe("Crimoni FC");
  expect(team.founded).toBe(1971);
});

test("Should not update team", async () => {
  await request(app)
    .patch(`/teams/${id_four}/update`)
    .set("Authorization", `Bearer ${regularUser.tokens[0].token}`)
    .send({
      fullname: "Crimoni FC",
      founded: 1971,
    })
    .expect(404);
});

test("Should get team", async () => {
  await request(app)
    .get(`/teams/${id_four}`)
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get team", async () => {
  await request(app)
    .get(`/teams/${id_four}`)
    .set("Authorization", `Bearer ${regularUser.tokens[0].token}`)
    .send()
    .expect(404);
});

test("Should get all teams", async () => {
  await request(app)
    .get(`/teams`)
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should delete team", async () => {
  await request(app)
    .delete(`/teams/${id_four}/delete`)
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not delete team", async () => {
  await request(app)
    .delete(`/teams/${id_four}/delete`)
    .set("Authorization", `Bearer ${regularUser.tokens[0].token}`)
    .send()
    .expect(404);
});
