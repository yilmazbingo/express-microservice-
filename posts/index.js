const express = require("express");
const { randomBytes } = require("crypto");
// since it is an express dependency, express will install it
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();

// this will store every object that we create
const posts = {};

app.use(bodyParser.json());
app.use(cors());

// ---we dont need this anymore
app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex"); // 4 bytes
  const { title } = req.body;
  posts[id] = { id, title };
  //  { ca771f49: { id: 'ca771f49', title: 'new one' } } structure

  // await axios.post("http://localhost:4005/events", {
  //   type: "PostCreated",
  //   data: { id, title },
  // });
  //------------------- WE ARE INSIDE KUBERNETES-----------
  try {
    await axios.post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      data: { id, title },
    });
  } catch (e) {
    console.log("error in posts", e.message);
  }

  //   201 indicates we just created a source
  res.status(201).json(posts[id]);
});

// whenever "events" service receives any event it broadcast
app.post("/events", (req, res) => {
  console.log("Received event", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("v20");
  console.log("listening in posts on 4000");
});
