import { vec3 } from "gl-matrix";
import { init } from "./homework/components/App";

import { Cube } from "./models/Cube";
import SceneManager from "./scene/SceneManager";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById(
    "canvas-container"
  ) as HTMLDivElement;

  const canvas = document.createElementNS(
    "http://www.w3.org/1999/xhtml",
    "canvas"
  ) as HTMLCanvasElement;
  container.appendChild(canvas);

  init(canvas);

  // const cube = new Cube();
  // cube.position = vec3.fromValues(0, 0, -20);
  // SceneManager.scene.add(cube);

  // SceneManager.render();
});
