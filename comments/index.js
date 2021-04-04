const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// this is where this service communicate with the clients
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  // if commentsByPostId[req.params.id] not fount it returns undefined
  // we are going to push the received comment to the array of comments
  const comments = commentsByPostId[req.params.id] || [];
  // status is pending because we need to review the content
  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostId[req.params.id] = comments;
  //   { '1': [ { id: 'a4edb62f', content: "new" } ] }
  try {
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });
  } catch (e) {
    console.log("error in comments", e.message);
  }

  res.status(201).send(comments);
});

// this is where the comments talks to other services.
app.post("/events", async (req, res) => {
  console.log("Received events in comments", req.body.type);
  const { type, data } = req.body;
  // this comes from events service, and moderation service sent it there
  if (type === "CommentModerated") {
    const { postId, status, id } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;
    try {
      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentUpdated",
        data: {
          ...data,
        },
      });
    } catch (e) {
      console.log("error in comments", e.message);
    }
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("Listenin comments on 4001");
});
