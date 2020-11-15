import { LoadingManager, Scene } from "three";

import CameraManager from "../manager/CameraManager";
import { SkyBox } from "./background/SkyBox";
import { Car } from "./car/Car";
import { Cube } from "./cube/Cube";
import { EnvironmentLighting } from "./lighting/EnvironmentLighting";
import { SceneSubject } from "./SceneSubject";

export const buildScene = async (
  scene: Scene,
  loadingManager: LoadingManager
) => {
  const car = new Car(CameraManager.camera);

  const sceneSubjects: SceneSubject[] = [
    car,
    new SkyBox(),
    new Cube(),
    new EnvironmentLighting(),
  ];
  await Promise.all(
    sceneSubjects.map((subject) => subject.load(loadingManager))
  );
  sceneSubjects.forEach((subject) => subject.attach(scene));
};
