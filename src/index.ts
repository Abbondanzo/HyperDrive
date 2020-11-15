import { DefaultLoadingManager } from "three";

import CameraManager from "./manager/CameraManager";
import SceneManager from "./manager/SceneManager";
import TimeManager from "./manager/TimeManager";
import { buildScene } from "./scene/buildScene";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById(
    "canvas-container"
  ) as HTMLDivElement;
  SceneManager.attach(container);

  await buildScene(SceneManager.scene, DefaultLoadingManager);

  CameraManager.camera.position.z = 5;

  TimeManager.play();
});
