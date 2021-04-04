// this service is kinda our database
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, postId, content, status } = data;
    // we creta post first, so there is already a post saved with postId inside posts
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    // we found the comment in current and replaced it with updated part
    // this comment is already stored so we are just updating
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening in query on 4002");
  try {
    const res = await axios.get("http://event-bus-srv/events");
    // syncing

    for (let event of res.data) {
      console.log("processing event", event.type);
      handleEvent(event.type, event.data);
    }
  } catch (e) {
    console.log("error in query ", e.message);
  }
});
