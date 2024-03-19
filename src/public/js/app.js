const messageList = document.querySelector("ul");
const nicknameForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");

// 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. 'http' is not allowed.
const socket = new WebSocket(`ws://${window.location.host}`);

const modifyJsonToString = (type, payload) => {
  const msg = { type, payload }

  return JSON.stringify(msg)
}

socket.addEventListener("open", () => {
  console.log("Connected to Server!");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");

  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server!!");
});

const handleNicknameSubmit = (event) => {
  event.preventDefault();

  const input = nicknameForm.querySelector("input");

  socket.send(modifyJsonToString("nickname", input.value));
  input.value = "";
};

const handleMessageSubmit = (event) => {
  event.preventDefault();

  const input = messageForm.querySelector("input");

  socket.send(modifyJsonToString("newMessage", input.value));
  input.value = "";
};

nicknameForm.addEventListener("submit", handleNicknameSubmit);
messageForm.addEventListener("submit", handleMessageSubmit);
