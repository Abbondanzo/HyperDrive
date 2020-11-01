import SceneManager from "./scene/SceneManager";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById(
    "canvas-container"
  ) as HTMLDivElement;
  container.appendChild(SceneManager.canvas);
  SceneManager.render();
});
