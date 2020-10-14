const { app } = require("./app");
const { redisClient } = require("./app");

const port = process.env.PORT;

redisClient.on("connect", function () {
  console.log(`Redis Client running`);
});

app.listen(port, () => {
  console.log(`Server up on ${port}`);
});
