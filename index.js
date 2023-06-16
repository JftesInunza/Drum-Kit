"use strict";

function main() {
  const resources = {
    sounds: loadAsJSON("#audios audio"),
    buttons: loadAsJSON("#hotkeys button"),
    areas: loadAsJSON("#drumkit-map area"),
  };

  initButtons(resources);
  window.addEventListener("resize", viewport);

  viewport();
}

function loadAsJSON(selector) {
  let json = {};
  document.querySelectorAll(selector).forEach((e) => {
    json[e.getAttribute("data-drum-id")] = e;
  });
  return json;
}

function initButtons(resources) {
  for (let key in resources.buttons) {
    let button = resources.buttons[key];
    let area = resources.areas[key];
    let sound = resources.sounds[key];

    button.addEventListener("click", (event) => {
      event.preventDefault();
      playSound(sound);
    });
    area.addEventListener("click", (event) => {
      event.preventDefault();
      playSound(sound);
      simulateActive(button);
    });
    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      if (event.key == button.getAttribute("data-hotkey")) {
        playSound(sound);
        simulateActive(button);
      }
    });
  }
}

function simulateActive(button) {
  button.classList.replace("drum-no-hit", "drum-hit");
  setTimeout(() => {
    button.classList.replace("drum-hit", "drum-no-hit");
  }, 200);
}

function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}

function scaleDrumkit(width) {
  const drumkit = document.querySelector("#drumkit");
  const img = drumkit.querySelector("img");
  const areas = drumkit.querySelectorAll("area");

  const scale = width / img.width;
  img.setAttribute("width", scale * img.width);

  const attCoords = "coords";
  for (let i = 0; i < areas.length; i++) {
    const area = areas[i];
    const coords = area.getAttribute(attCoords);
    const scaledCoords = scaleCoords(scale, coords);
    area.setAttribute(attCoords, scaledCoords);
  }
}

function scaleCoords(scale, coords) {
  const separator = ", ";
  return coords
    .split(separator)
    .map((coord) => {
      return Math.round(scale * Number(coord));
    })
    .join(separator);
}

function viewport() {
  const width = window.screen.width;
  const height = window.screen.height;
  let scale = 0;
  if (width < 576) {
    scale = 900;
  } else if (width < 992) {
    scale = 800;
  } else if (width < 1400) {
    scale = 450;
  } else {
    scale = 600;
  }
  scaleDrumkit(scale);
}

window.addEventListener("load", main);
