import { LoadingManager } from "three";

import { buildControls } from "./dom/buildControls";
import { displaySplash } from "./dom/displaySplash";
import AudioManager from "./manager/AudioManager";
import SceneManager from "./manager/SceneManager";
import TimeManager from "./manager/TimeManager";
import { buildScene } from "./scene/buildScene";

const launch = async (loadingManager: LoadingManager) => {
  const splashContainer = document.getElementById(
    "splash-container"
  ) as HTMLDivElement;
  const canvasContainer = document.getElementById(
    "canvas-container"
  ) as HTMLDivElement;
  SceneManager.attach(canvasContainer);

  await buildScene(SceneManager.scene, loadingManager);
  buildControls(canvasContainer);

  splashContainer.classList.add("hidden");
  canvasContainer.classList.add("fade-in");
  canvasContainer.classList.remove("hidden");

  AudioManager.start();
  TimeManager.play();
};

document.addEventListener("DOMContentLoaded", () => {
  const splashContainer = document.getElementById(
    "splash-container"
  ) as HTMLDivElement;
  displaySplash(splashContainer, launch);
});
