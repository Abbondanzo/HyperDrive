import { LoadingManager } from "three";

import { buildControls } from "./dom/buildControls";
import { displayError } from "./dom/displayError";
import { displaySplash } from "./dom/displaySplash";
import { displayStats } from "./dom/displayStats";
import AudioManager from "./manager/AudioManager";
import SceneManager from "./manager/SceneManager";
import TimeManager from "./manager/TimeManager";
import { buildScene } from "./scene/buildScene";

const launch = async (loadingManager: LoadingManager, withSound: boolean) => {
  const splashContainer = document.getElementById(
    "splash-container"
  ) as HTMLDivElement;
  const canvasContainer = document.getElementById(
    "canvas-container"
  ) as HTMLDivElement;
  SceneManager.attach(canvasContainer);

  const built = await buildScene(SceneManager.scene, loadingManager);
  if (!built) {
    displayError(splashContainer);
    return;
  }

  buildControls(canvasContainer);

  splashContainer.classList.add("hidden");
  canvasContainer.classList.add("fade-in");
  canvasContainer.classList.remove("hidden");

  displayStats(canvasContainer);

  AudioManager.start(withSound);
  TimeManager.play();
};

document.addEventListener("DOMContentLoaded", () => {
  const splashContainer = document.getElementById(
    "splash-container"
  ) as HTMLDivElement;
  displaySplash(splashContainer, launch);
});
