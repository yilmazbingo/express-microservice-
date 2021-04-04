const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
// we dont need cors() because this service does not communicate with the client

// since client will now make any request to this service, we dont need to setup cors()
const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentCreated") {
    const status = data.content.includes("badWord") ? "rejected" : "approved";
    try {
      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      });
    } catch (e) {
      "error in moderation", console.log(e.message);
    }

    console.log("Status in moderations", status);
  }
  res.send({});
});

app.listen(4003, () => {
  console.log("Listening in moderation on 4003");
});

// app.post('/events', async (req, res) => {
//   const { type, data } = req.body;

//   if (type === 'CommentCreated') {
//     const status = data.content.includes('orange') ? 'rejected' : 'approved';

//     await axios.post('http://event-bus-srv:4005/events', {
//       type: 'CommentModerated',
//       data: {
//         id: data.id,
//         postId: data.postId,
//         status,
//         content: data.content
//       }
//     });
//   }

//   res.send({});
// });

// app.listen(4003, () => {
//   console.log('Listening on 4003');
// });
