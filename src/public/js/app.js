const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

const sendMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");

  li.innerText = message;
  ul.appendChild(li);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();

  const input = room.querySelector("input");
  const message = input.value;

  socket.emit("new_message", input.value, roomName, () => {
    sendMessage(`You: ${message}`);
  });

  input.value = "";
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;

  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;

  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
};

const handleRoomSubmit = () => {
  event.preventDefault();

  const input = form.querySelector("input");

  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  sendMessage("Someone join!");
});

socket.on("bye", () => {
  sendMessage("Someone left!");
});

socket.on("new_message", sendMessage);
