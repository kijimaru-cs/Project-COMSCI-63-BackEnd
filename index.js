var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
const path = require("path");
const cv = require("opencv4nodejs");

const wCap = new cv.VideoCapture(0);
const FPS = 30;
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

setInterval(() => {
  const frame = wCap.read();
  const image = cv.imencode(".jpg", frame).toString("base64");
  io.emit("image", image);
}, 1000 / FPS);

http.listen(port, function () {
  console.log("listening on:" + port);
});
