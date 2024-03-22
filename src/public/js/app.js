const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;

  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
};

const handleRoomSubmit = () => {
  event.preventDefault();

  const input = form.querySelector("input");

  socket.emit("enter_room", { payload: input.value }, showRoom);
  roomName = input.value;
  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);
