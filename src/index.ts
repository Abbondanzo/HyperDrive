import { Cube } from "./models/Cube";
import SceneManager from "./scene/SceneManager";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById(
    "canvas-container"
  ) as HTMLDivElement;
  container.appendChild(SceneManager.canvas);

  SceneManager.scene.add(new Cube());

  SceneManager.render();
});
