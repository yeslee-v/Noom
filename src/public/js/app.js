const socket = io();

const nickname = document.getElementById("nickname");
const nicknameForm = nickname.querySelector("form");

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

const room = document.getElementById("room");

room.hidden = true;

let roomName;

const handleNicknameSubmit = (event) => {
  event.preventDefault();

  const input = nicknameForm.querySelector("#nickname input");
  const h3 = nickname.querySelector("h3");
  h3.innerText = `Your nickname is ${input.value}!`;

  socket.emit("new_nickname", input.value);
};

const sendMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");

  li.innerText = message;
  ul.appendChild(li);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();

  const input = room.querySelector("#message input");
  const message = input.value;

  socket.emit("new_message", input.value, roomName, () => {
    sendMessage(`You: ${message}`);
  });

  input.value = "";
};

const showMessageForm = () => {
  const messageForm = room.querySelector("#message");

  messageForm.addEventListener("submit", handleMessageSubmit);
};

const showRoom = (countRoomMember) => {
  welcome.hidden = true;
  room.hidden = false;

  const h2 = room.querySelector("h2");
  h2.innerText =
    `Room ${roomName} ` +
    `(${countRoomMember === undefined ? 1 : countRoomMember})`;

  showMessageForm();
};

const handleRoomSubmit = () => {
  event.preventDefault();

  const input = welcomeForm.querySelector("input");

  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
};

nicknameForm.addEventListener("submit", handleNicknameSubmit);
welcomeForm.addEventListener("submit", handleRoomSubmit);

const showRoomList = (rooms) => {
  const roomList = welcome.querySelector("ul");

  roomList.innerHTML = "";

  rooms.forEach((room) => {
    const li = document.createElement("li");

    li.innerText = room;
    roomList.appendChild(li);
  });
};

socket.on("welcome", (nickname, countRoomMember) => {
  showRoom(countRoomMember);
  sendMessage(`${nickname} join!`);
});

socket.on("bye", (nickname, countRoomMember) => {
  showRoom(countRoomMember);
  sendMessage(`${nickname} left!`);
});

socket.on("new_message", sendMessage);

socket.on("change_room", showRoomList);
