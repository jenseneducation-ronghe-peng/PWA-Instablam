import {
  requestNotificationPermission,
  //createNotification,
} from "./notifications.js";

import push from "./push-notifications.js";

var newImg = "";
let stream = {};
var canvas = document.querySelector("canvas");

//Create donwload link if user is online.
function createDownload() {
  document.querySelector("#download").href = canvas
    .toDataURL("image/jpeg")
    .replace("image/jpeg", "image/octet-stream");

  if (!navigator.onLine) {
    document.querySelector("#download").href = "#filters";
    document.querySelector("#download").removeAttribute("download");
    console.log("Disable download");
  } else {
    document.querySelector("#download").download = "image.png";
    console.log("Enable download");
  }
}
// Show 'unable to download photo' massage while offline
function offlineText() {
  var offlineText = document.querySelector(".offline-text");
  if (!navigator.onLine) {
    offlineText.classList.remove("hide");
    offlineText.classList.add("show");
    console.log("show text");
  } else {
    offlineText.classList.remove("show");
    offlineText.classList.add("hide");
    console.log("hide text");
  }
}
// show photo
async function captureImage(stream) {
  const mediaTrack = stream.getVideoTracks()[0];
  console.log(mediaTrack);
  const captureImg = new ImageCapture(mediaTrack);
  const photo = await captureImg.takePhoto();
  console.log(photo);
  const imgUrl = URL.createObjectURL(photo);

  newImg = imgUrl;
  console.log(newImg);
  Caman("#photo", imgUrl, function () {
    this.render();
  });
}
// show video
var showVideo = document.querySelector("#showVideo");
async function getMedia() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoElem = document.querySelector("#me");
    videoElem.srcObject = stream;
    videoElem.addEventListener("loadedmetadata", () => {
      videoElem.play();
      //randomiseHue(videoElem);
    });
    console.log(stream);
  } catch (error) {
    console.log(error);
  }
}

showVideo.addEventListener("click", (e) => {
  e.preventDefault();
  getMedia();
  document.querySelector(".video-div").classList.remove("hide");
  document.querySelector(".video-div").classList.add("show");
});

Caman.Event.listen("processStart", function (job) {
  console.log("Start: ", job.name);
});

document.querySelector("#screenShot").addEventListener("click", (event) => {
  captureImage(stream);
  document.querySelector(".filters").classList.remove("hide");
  document.querySelector(".filters").classList.add("show");
});

var brightness = document.querySelector("#brightness");
var exposure = document.querySelector("#exposure");
var noise = document.querySelector("#noise");
var hue = document.querySelector("#hue");
var sepia = document.querySelector("#sepia");
var revert = document.querySelector(".revertBtn");
var download = document.querySelector(".saveBtn");

var brightnessValue = document.querySelector(".valueBright");
var exposureValue = document.querySelector(".valueExposure");
var noiseValue = document.querySelector(".valueNoise");
var hueValue = document.querySelector(".valueHue");
var sepiaValue = document.querySelector(".valueSepia");
var oldValue = 0;

download.addEventListener("click", createDownload);

// Change filters

//Brightness
brightness.addEventListener("input", (e) => {
  e.preventDefault();
  var value = parseInt(brightness.value);
  let newValue = value - oldValue;
  Caman("#photo", function () {
    if (-10 < value < 10) {
      this.revert();
    }
    this.brightness(newValue);
    this.render();
    console.log("new brightness");
  });
  brightnessValue.innerHTML = parseInt(brightness.value);
});
//Exposure

exposure.addEventListener("input", (e) => {
  e.preventDefault();
  var value = parseInt(exposure.value);
  let newValue = value - oldValue;
  Caman("#photo", function () {
    if (-10 < value < 10) {
      this.revert();
    }
    this.exposure(newValue);
    this.render();
    console.log("new exposure");
  });
  exposureValue.innerHTML = parseInt(exposure.value);
});
//Noise

noise.addEventListener("input", (e) => {
  e.preventDefault();
  var value = parseInt(noise.value);
  let newValue = value - oldValue;
  Caman("#photo", function () {
    if (value === 0) {
      this.revert();
    }
    this.noise(newValue);
    this.render();
    console.log("new noise");
  });
  noiseValue.innerHTML = parseInt(noise.value);
});

//Hue

hue.addEventListener("input", (e) => {
  e.preventDefault();
  var value = parseInt(hue.value);
  let newValue = value - oldValue;
  Caman("#photo", function () {
    if (value === 0) {
      this.revert();
    }
    this.hue(newValue);
    this.render();
    console.log("new hue");
  });
  hueValue.innerHTML = parseInt(hue.value);
});
//Sepia

sepia.addEventListener("input", (e) => {
  e.preventDefault();
  var value = parseInt(sepia.value);
  let newValue = value - oldValue;
  Caman("#photo", function () {
    if (value === 0) {
      this.revert();
    }
    this.sepia(newValue);
    this.render();
    console.log("new sepia");
  });
  sepiaValue.innerHTML = parseInt(sepia.value);
});

//Revert
revert.addEventListener("click", (e) => {
  e.preventDefault();
  Caman("#photo", function () {
    this.revert();
    this.render();
    console.log("revert!");
  });
  brightness.value = 0;
  brightnessValue.innerHTML = brightness.value;
  exposure.value = 0;
  exposureValue.innerHTML = exposure.value;
  noise.value = 0;
  noiseValue.innerHTML = noise.value;
  hue.value = 0;
  hueValue.innerHTML = hue.value;
  sepia.value = 0;
  sepiaValue.innerHTML = sepia.value;
});

// register Service worker
function registrateServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("../sw.js")
      .then((registration) => {
        console.log("Registered service worker");
        push();
      })
      .catch((error) => console.log("Error with register service worker"));
  }
}
registrateServiceWorker();
requestNotificationPermission();
window.addEventListener("online", offlineText);
window.addEventListener("offline", offlineText);
