const { app } = require("./app");
const { client } = require("./app");

const port = process.env.PORT;

client.on("connect", function () {
  console.log(`Redis Client running`);
});

app.listen(port, () => {
  console.log(`Server up on ${port}`);
});
