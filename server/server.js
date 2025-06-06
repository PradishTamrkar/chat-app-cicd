// server.js
const http = require("http");
const { Server } = require("socket.io");

const httpServer = http.createServer();
const ioServer = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

ioServer.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

module.exports = { ioServer, httpServer };

