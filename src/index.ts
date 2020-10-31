import SceneManager from "./scene/SceneManager";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const sceneManager = new SceneManager(canvas);
  sceneManager.render();
});
