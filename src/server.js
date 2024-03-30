import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

const getPublicRooms = () => {
  const { sids, rooms } = wsServer.sockets.adapter;
  const publicRoomList = [];

  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRoomList.push(key);
    }
  });

  return publicRoomList;
};

const countRoomMember = (roomName) => {
  const { rooms } = wsServer.sockets.adapter;

  return rooms.get(roomName)?.size;
};

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";

  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on("new_nickname", (nickname) => (socket["nickname"] = nickname));

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);

    done();

    socket
      .to(roomName)
      .emit("welcome", socket.nickname, countRoomMember(roomName));

    wsServer.sockets.emit("change_room", getPublicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoomMember(room) - 1)
    );
  });

  socket.on("disconnect", () => {
    wsServer.sockets.emit("change_room", getPublicRooms());
  });

  socket.on("new_message", (message, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${message}`);

    done();
  });
});

// const wss = new WebSocketServer({ server });

// const sockets = [];

// wss.on("connection", (socket) => {
//   sockets.push(socket);

//   socket["nickname"] = "Anonymous";

//   console.log("Connected to Browser!");

//   socket.on("close", () => {
//     console.log("Disconnected from the Browser!");
//   });

//   socket.on("message", (message) => {
//     const parsedMessage = JSON.parse(message)

//     switch (parsedMessage.type) {
//       case "newMessage":
//         sockets.forEach((aSocket) => {
//           aSocket.send(`${socket.nickname}: ${parsedMessage.payload}`);
//         });

//         break
//       case "nickname":
//         socket["nickname"] = parsedMessage.payload;

//         break
//     }
//   });
// });

httpServer.listen(3000, handleListen);
