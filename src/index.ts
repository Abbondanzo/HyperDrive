import {
  AmbientLight,
  BoxGeometry,
  Fog,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  PointLight,
} from "three";

import { addFrameListener, FrameEvent } from "./events/frame";
import { loadCubeMap } from "./loaders/background/cubemap";
import CameraManager from "./manager/CameraManager";
import SceneManager from "./manager/SceneManager";
import TimeManager from "./manager/TimeManager";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById(
    "canvas-container"
  ) as HTMLDivElement;
  SceneManager.attach(container);

  const geometry = new BoxGeometry();
  const material = new MeshPhongMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  SceneManager.scene.add(cube);

  const ambientLight = new AmbientLight(0xffffff, 0.2);
  SceneManager.scene.add(ambientLight);

  const pointLight = new PointLight(0xffffff);
  pointLight.position.set(1, 2, 3);
  SceneManager.scene.add(pointLight);

  CameraManager.camera.position.z = 5;

  addFrameListener(({ delta }: FrameEvent) => {
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
  });
  SceneManager.scene.fog = new Fog(0xffffff);

  // const plane = new Mesh(
  //   new PlaneGeometry(4000, 4000),
  //   new MeshLambertMaterial({ color: 0x0000ff })
  // );
  // plane.rotation.x -= Math.PI / 2;
  // plane.position.y -= 5;

  // SceneManager.scene.add(plane);

  SceneManager.scene.background = loadCubeMap();

  TimeManager.play();
});
