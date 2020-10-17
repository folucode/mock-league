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
} = require("./fixtures/db");
const Fixture = require("../src/models/fixture");

beforeEach(setupData);

test("Should create new fixture", async () => {
  await request(app)
    .post("/fixtures/new")
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .send({
      team_a: "Congo United",
      team_b: "Atlas FC",
      status: "suspended",
    })
    .expect(201);
});

test("Should not create new fixture", async () => {
  await request(app)
    .post("/fixtures/new")
    .set("Authorization", `Bearer ${regularUser.tokens[0].token}`)
    .send({
      team_a: "Congo United",
      team_b: "Atlas FC",
      status: "suspended",
    })
    .expect(404);
});

test("Should update fixture", async () => {
  await request(app)
    .patch(`/fixtures/${id_three}/update`)
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .send({
      team_a: "Adorns FC",
    })
    .expect(200);

  //check the database to confirm change
  fixture = await Fixture.findById(id_three);

  expect(fixture.team_a).toBe("Adorns FC");
});

test("Should not update fixture", async () => {
  await request(app)
    .patch(`/fixtures/${id_three}/update`)
    .set("Authorization", `Bearer ${regularUser.tokens[0].token}`)
    .send({
      team_a: "Adorns FC",
    })
    .expect(404);
});

test("Should get fixture", async () => {
  await request(app)
    .get(`/fixtures/fixture/${fixture_id}`)
    .set("Authorization", `Bearer ${regularUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should delete fixture", async () => {
  await request(app)
    .delete(`/fixtures/${id_three}/delete`)
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not delete fixture", async () => {
    await request(app)
      .delete(`/fixtures/${id_three}/delete`)
      .set("Authorization", `Bearer ${regularUser.tokens[0].token}`)
      .send()
      .expect(404);
  });