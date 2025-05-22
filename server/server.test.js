// server/server.test.js

const io = require("socket.io-client");
const http = require("http");
const { Server } = require("socket.io");

let ioServer, httpServer, clientSocket1, clientSocket2;

beforeAll((done) => {
  httpServer = http.createServer();
  ioServer = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  ioServer.on("connection", (socket) => {
    socket.on("join_room", (room) => {
      socket.join(room);
    });

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });
  });

  httpServer.listen(() => {
    const port = httpServer.address().port;
    clientSocket1 = io.connect(`http://localhost:${port}`);
    clientSocket2 = io.connect(`http://localhost:${port}`);
    done();
  });
});

afterAll(() => {
  ioServer.close();
  clientSocket1.close();
  clientSocket2.close();
  httpServer.close();
});

test("should broadcast message to other clients in room", (done) => {
  const room = "test-room";
  const messageData = {
    room,
    author: "User1",
    message: "Hello, world!",
    time: "12:00",
  };

  clientSocket2.on("connect", () => {
    clientSocket1.emit("join_room", room);
    clientSocket2.emit("join_room", room);

    clientSocket2.on("receive_message", (data) => {
      expect(data).toEqual(messageData);
      done();
    });

    clientSocket1.emit("send_message", messageData);
  });
});
