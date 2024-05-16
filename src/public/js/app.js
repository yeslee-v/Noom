const socket = io();

const video = document.getElementById("myStream");
const myFace = document.getElementById("myFace");

const muteButton = video.querySelector("#mute");
const cameraButton = video.querySelector("#camera");
const selectedCamera = video.querySelector("#cameras");

const welcome = document.getElementById("welcome");
const call = document.getElementById("call");

const welcomeForm = welcome.querySelector("form");

call.hidden = true;

let myStream;
let isMutedAudio = false;
let isCameraOff = false;
let roomName;
let myPeerConnection;

const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];

    cameras.forEach((camera) => {
      const option = document.createElement("option");

      option.value = camera.deviceId;
      option.innerText = camera.label;

      if (currentCamera.label === camera.label) {
        option.selected = true;
      }

      selectedCamera.appendChild(option);
    });
  } catch (err) {
    console.error(`[getMedia] ${err.name}: ${err.message}`);
  }
};

const getMedia = async (deviceId) => {
  const constraint = {
    audio: true,
    video: deviceId
      ? { deviceId }
      : {
          facingMode: "environment",
        },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(constraint);

    myFace.srcObject = myStream;

    !deviceId && (await getCameras());
  } catch (err) {
    console.error(`[getMedia] ${err.name}: ${err.message}`);
  }
};

const handleMuteClick = () => {
  myStream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });

  muteButton.innerText = isMutedAudio ? "Mute" : "Unmute";
  isMutedAudio = isMutedAudio ? false : true;
};

const handleCameraClick = () => {
  myStream.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });

  cameraButton.innerText = isCameraOff ? "Turn Camera Off" : "Turn Camera On";
  isCameraOff = isCameraOff ? false : true;
};

const handleCameraChange = async () => {
  const deviceId = selectedCamera.value;

  await getMedia(deviceId);
};

muteButton.addEventListener("click", handleMuteClick);
cameraButton.addEventListener("click", handleCameraClick);
selectedCamera.addEventListener("input", handleCameraChange);

const startMedia = async () => {
  welcome.hidden = true;
  call.hidden = false;

  await getMedia();
  makeConnection();
};

const handleWelcomeSubmit = async (event) => {
  event.preventDefault();

  const input = welcomeForm.querySelector("input");

  socket.emit("enter_room", input.value, startMedia);
  roomName = input.value;
  input.value = "";
};

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// run on sender: PeerA
socket.on("welcome", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);

  socket.emit("offer", offer, roomName);
});

// run on receiver: PeerB
socket.on("offer", async (offer) => {
  console.log(offer);
});

const makeConnection = () => {
  myPeerConnection = new RTCPeerConnection();

  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
};
