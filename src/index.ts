import { DefaultLoadingManager } from "three";

import AudioManager from "./manager/AudioManager";
import SceneManager from "./manager/SceneManager";
import TimeManager from "./manager/TimeManager";
import { buildScene } from "./scene/buildScene";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById(
    "canvas-container"
  ) as HTMLDivElement;
  SceneManager.attach(container);

  await buildScene(SceneManager.scene, DefaultLoadingManager);

  AudioManager.play();
  TimeManager.play();
});
