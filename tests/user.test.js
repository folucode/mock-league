const { app } = require("../src/app");
const request = require("supertest");
const User = require("../src/models/user");
const { regularUser, id_one, setupData } = require("./fixtures/db");

beforeEach(setupData);

test("Should signup a new user", async () => {
  await request(app)
    .post("/users/signup")
    .send({
      name: "Tosin",
      email: "tosin@example.com",
      password: "MyPass777!",
    })
    .expect(201);
});

test("Should login existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: regularUser.email,
      password: regularUser.password,
    })
    .expect(200);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: regularUser.email,
      password: "thisisnotmypass",
    })
    .expect(400);
});

test("Should get user profile", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${regularUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get user profile", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should logout user", async () => {
  await request(app)
    .post("/users/logout")
    .set("Authorization", `Bearer ${regularUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not logout user", async () => {
  await request(app).post("/users/logout").send().expect(401);
});

test("Should update user profile", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${regularUser.tokens[0].token}`)
    .send({
      name: "Tester Name",
    })
    .expect(200);

  //Check database for correct name
  let user = await User.findById(id_one);

  expect(user.name).toBe("Tester Name");
});

test("Should not update user profile", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${regularUser.tokens[0].token}`)
    .send({
      role: "Admin",
    })
    .expect(400);
});
