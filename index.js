var app = require("express")();
const express = require("express");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3001;
app.use("/static", express.static("./static/"));
let broadcasterVideo;
let broadcasterAudio;

io.sockets.on("error", (e) => console.log(e));
io.sockets.on("connection", (socket) => {
  socket.on("broadcasterVideo", () => {
    broadcasterVideo = socket.id;
    socket.broadcast.emit("broadcasterVideo");
  });
  socket.on("broadcasterAudio", () => {
    broadcasterAudio = socket.id;
    socket.broadcast.emit("broadcasterAudio");
  });
  socket.on("watcherVideo", () => {
    socket.to(broadcasterVideo).emit("watcherVideo", socket.id);
  });
  socket.on("watcherAudio", () => {
    socket.to(broadcasterAudio).emit("watcherAudio", socket.id);
  });
  socket.on("offerVideo", (id, message) => {
    socket.to(id).emit("offerVideo", socket.id, message);
  });
  socket.on("offerAudio", (id, message) => {
    socket.to(id).emit("offerAudio", socket.id, message);
  });
  socket.on("answerVideo", (id, message) => {
    socket.to(id).emit("answerVideo", socket.id, message);
  });
  socket.on("answerAudio", (id, message) => {
    socket.to(id).emit("answerAudio", socket.id, message);
  });
  socket.on("candidateVideo", (id, message) => {
    socket.to(id).emit("candidateVideo", socket.id, message);
  });
  socket.on("candidateAudio", (id, message) => {
    socket.to(id).emit("candidateAudio", socket.id, message);
  });
  socket.on("disconnect", () => {
    socket.to(broadcasterVideo).emit("disconnectPeer", socket.id);
    socket.to(broadcasterAudio).emit("disconnectPeer", socket.id);
  });
  socket.on("sendMessage", (msg) => {
    console.log(msg);
    io.emit("sendMessage", msg);
  });
});

app.get("/health-check", (req, res) => {
  res.send("ok");
});

http.listen(port, function () {
  console.log("listening on:" + port);
});
