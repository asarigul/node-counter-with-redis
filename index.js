const express = require('express');
const redis = require("redis");
const process = require("process");

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

console.log("REDIS_HOST:", process.env.REDIS_HOST);
console.log("REDIS_PORT:", process.env.REDIS_PORT);

const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");

    // Initialize visits to 0
    const initialVisits = await client.get("visits");
    if (initialVisits === null) {
      await client.set("visits", 0);
    }
  } catch (err) {
    console.error("Error during Redis connection or initialization:", err);
  }
})();

app.get("/", async (req, res) => {
  try {
    const visits = await client.get("visits");
    const visitCount = parseInt(visits) + 1;
    await client.set("visits", visitCount);

    // crash every 5th visit
    if (visitCount % 5 == 0) {
      process.exit(-1);
    }

    res.render("home", {
      title: "Welcome",
      visits: visitCount,
    });
  } catch (err) {
    console.error("Error handling visits:", err);
    res.status(500).send("Internal Server Error");
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
