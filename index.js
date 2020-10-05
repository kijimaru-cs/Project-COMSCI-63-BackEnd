var app = require("express")();
const express = require("express");
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
    socket.on("broadcasterAudio", () => {
      broadcasterAudio = socket.id;
      socket.broadcast.in(room).emit("broadcasterAudio");
    });
    socket.on("watcherVideo", () => {
      socket.to(broadcasterVideo).in(room).emit("watcherVideo", socket.id);
    });
    socket.on("watcherAudio", () => {
      socket.to(broadcasterAudio).in(room).emit("watcherAudio", socket.id);
    });
    socket.on("offerVideo", (id, message) => {
      socket.to(id).in(room).emit("offerVideo", socket.id, message);
    });
    socket.on("offerAudio", (id, message) => {
      socket.to(id).in(room).emit("offerAudio", socket.id, message);
    });
    socket.on("answerVideo", (id, message) => {
      socket.to(id).in(room).emit("answerVideo", socket.id, message);
    });
    socket.on("answerAudio", (id, message) => {
      socket.to(id).in(room).emit("answerAudio", socket.id, message);
    });
    socket.on("candidateVideo", (id, message) => {
      socket.to(id).in(room).emit("candidateVideo", socket.id, message);
    });
    socket.on("candidateAudio", (id, message) => {
      socket.to(id).in(room).emit("candidateAudio", socket.id, message);
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
      io.in(room).emit("sendUsername", user);
      socket.to(broadcasterVideo).in(room).emit("disconnectPeer", socket.id);
      socket.to(broadcasterAudio).in(room).emit("disconnectPeer", socket.id);
    });
    socket.on("sendMessage", (msg) => {
      console.log(msg);
      io.in(room).emit("sendMessage", msg);
    });
    socket.on("sendUsername", (dataUser) => {
      user.push(dataUser);
      userAll.push({ ID: socket.id, USERNAME: dataUser });
      user = [...new Set(user)];
      io.in(room).emit("sendUsername", user);
    });
  });
});

app.get("/health-check", (req, res) => {
  res.send("ok");
});

http.listen(port, function () {
  console.log("listening on:" + port);
});
