// 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. 'http' is not allowed.
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server!");
});

socket.addEventListener("message", (message) => {
  console.log("New Message: ", message.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server!!");
});

setTimeout(() => {
  socket.send("hello from the Browser!");
}, 10000);
