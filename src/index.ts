import { vec3 } from "gl-matrix";
import { Cube } from "./models/Cube";
import SceneManager from "./scene/SceneManager";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById(
    "canvas-container"
  ) as HTMLDivElement;
  container.appendChild(SceneManager.canvas);

  const cube = new Cube();
  cube.position = vec3.fromValues(0, 0, -20);
  SceneManager.scene.add(cube);

  SceneManager.render();
});
