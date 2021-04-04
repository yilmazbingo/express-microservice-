const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

//we are storing events incase one of the services go down and needs to sync, it will request all the events
const events = [];

app.post("/events", async (req, res) => {
  // we dont know its type
  const event = req.body;
  events.push(event);

  // we dont use localhost inside kubernetes
  try {
    // url is the name of the cluster ip service specified in config
    // kubectl get services
    await axios.post("http://posts-clusterip-srv:4000/events", event);
    await axios.post("http://comments-srv:4001/events", event);
    await axios.post("http://query-srv:4002/events", event);
    await axios.post("http://moderation-srv:4003/events", event);
  } catch (e) {
    console.log("error in event bus", e);
  }
  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listening from event bus on 4005");
});
