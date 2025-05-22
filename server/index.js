const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

// for cors error
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",    // kun server le server call haru garxa vanera, yo bata socket communication garna sakinxa vanerw
    methods: ["GET", "POST"],       // kun requests chahi accept garni ta
  },
});

// socketIO works based on events

// aba first maa connect vo vanerw detect garnu paryo, ani tyo connect wala event huda action garnu paryo through paxadi ko callback function
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined the room: ${data}`);

  });

  socket.on("send_message", (data) => {
    // console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
