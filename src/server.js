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

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);

    // showRoom
    done();

    socket.to(roomName).emit("welcome");
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
