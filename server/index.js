const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

app.use(cors({ credentials: true, origin: "http://localhost:3001" }));

io.on("connection", socket => {
  socket.on("new-message", message => {
    socket.broadcast.emit("rec-message", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  console.log("New user connected");
});

server.listen(3000, () => {
  console.log("server is listning on port 3000");
});
