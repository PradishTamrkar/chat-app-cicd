const io = require("socket.io-client");
const { ioServer, httpServer } = require("./server");

let clientSocket1, clientSocket2;

beforeAll((done) => {
  httpServer.listen(() => {
    const port = httpServer.address().port;
    clientSocket1 = io(`http://localhost:${port}`);
    clientSocket2 = io(`http://localhost:${port}`);
    done();
  });
});

afterAll(() => {
  ioServer.close();
  httpServer.close();
  clientSocket1.close();
  clientSocket2.close();
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
;
