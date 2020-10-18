var app = require("express")();
const express = require("express");
var fs = require('fs')
var https = require('https')
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3001;
app.use("/static", express.static("./static/"));
let broadcasterVideo;
let broadcasterAudio;
user = [];
userAll = [];

io.sockets.on("error", (e) => console.log(e));
io.sockets.on("connection", (socket) => {
  socket.on("create", (room) => {
    socket.join(room);
    console.log(socket.id, "=>", "Connected");
    socket.on("broadcasterVideo", () => {
      broadcasterVideo = socket.id;
      socket.broadcast.in(room).emit("broadcasterVideo");
    });
    socket.on("broadcasterAudioSend", () => {
      broadcasterAudio = socket.id;
      socket.broadcast.in(room).emit("broadcasterAudioReceive");
    });
    socket.on("broadcasterAudioSend2", () => {
      broadcasterAudio = socket.id;
      socket.broadcast.in(room).emit("broadcasterAudioReceive2");
    });
    socket.on("watcherVideo", () => {
      socket.to(broadcasterVideo).in(room).emit("watcherVideo", socket.id);
    });
    socket.on("watcherAudioReceive", () => {
      socket.to(broadcasterAudio).in(room).emit("watcherAudioSend", socket.id);
    });
    socket.on("watcherAudioReceive2", () => {
      socket.to(broadcasterAudio).in(room).emit("watcherAudioSend2", socket.id);
    });
    socket.on("offerVideo", (id, message) => {
      socket.to(id).emit("offerVideo", socket.id, message);
    });
    socket.on("offerAudioSend", (id, message) => {
      socket.to(id).emit("offerAudioReceive", socket.id, message);
    });
    socket.on("offerAudioSend2", (id, message) => {
      socket.to(id).emit("offerAudioReceive2", socket.id, message);
    });
    socket.on("answerVideo", (id, message) => {
      socket.to(id).emit("answerVideo", socket.id, message);
    });
    socket.on("answerAudioReceive", (id, message) => {
      socket.to(id).emit("answerAudioSend", socket.id, message);
    });
    socket.on("answerAudioReceive2", (id, message) => {
      socket.to(id).emit("answerAudioSend2", socket.id, message);
    });
    socket.on("candidateVideo", (id, message) => {
      socket.to(id).emit("candidateVideo", socket.id, message);
    });
    socket.on("candidateAudioSend", (id, message) => {
      socket.to(id).emit("candidateAudioReceive", socket.id, message);
    });
    socket.on("candidateAudioSend2", (id, message) => {
      socket.to(id).emit("candidateAudioReceive2", socket.id, message);
    });
    socket.on("candidateAudioReceive", (id, message) => {
      socket.to(id).emit("candidateAudioSend", socket.id, message);
    });
    socket.on("candidateAudioReceive2", (id, message) => {
      socket.to(id).emit("candidateAudioSend2", socket.id, message);
    });
    socket.on("disconnect", () => {
      console.log(socket.id, "=>", "disconnected");
      if (userAll.find((element) => element.ID === socket.id) != undefined) {
        const deleteUsername = userAll.find(
          (element) => element.ID === socket.id
        ).USERNAME;
        user.splice(user.indexOf(deleteUsername), 1);
        userAll.splice(
          userAll.indexOf(userAll.find((element) => element.ID === socket.id)),
          1
        );
      }
      let sendUser = []
      io.of('/').in(room).clients((error, clients) => {
        if (error) throw error;
        try {
          clients.forEach(element => {
          sendUser.push(userAll.find((item) => item.ID === element).USERNAME)
          sendUser = [...new Set(sendUser)];
           });
            io.in(room).emit("sendUsername", sendUser);
        } catch (error) {
          console.log(error)
        }
      });
      socket.to(broadcasterVideo).in(room).emit("disconnectPeer", socket.id);
      socket.to(broadcasterAudio).in(room).emit("disconnectPeer", socket.id);
    });
    socket.on("sendMessage", (msg) => {
      console.log(msg);
      io.in(room).emit("sendMessage", msg);
    });
    socket.on("sendUsername", (dataUser) => {
      let sendUser = []
      user.push(dataUser);
      userAll.push({ ID: socket.id, USERNAME: dataUser });
      user = [...new Set(user)];
      io.of('/').in(room).clients((error, clients) => {
        if (error) throw error;
        try {
          clients.forEach(element => {
          sendUser.push(userAll.find((item) => item.ID === element).USERNAME)
          sendUser = [...new Set(sendUser)];
           });
            io.in(room).emit("sendUsername", sendUser);
        } catch (error) {
          console.log(error)
        }
        
      });
    });
  });
});

app.get("/health-check", (req, res) => {
  res.send("ok");
});

http.listen(port, function () {
  console.log("listening on:" + port);
});

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(3002, function () {
  console.log('Example app listening on port 3002! Go to https://localhost:3002/')
})
