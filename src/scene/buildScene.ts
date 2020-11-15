import { LoadingManager, Scene } from "three";

import CameraManager from "../manager/CameraManager";
import { Songs } from "./audio/Songs";
import { SkyBox } from "./background/SkyBox";
import { Car } from "./car/Car";
import { Cube } from "./cube/Cube";
import { EnvironmentLighting } from "./lighting/EnvironmentLighting";
import { Pavement } from "./road/Pavement";
import { SceneSubject } from "./SceneSubject";

export const buildScene = async (
  scene: Scene,
  loadingManager: LoadingManager
) => {
  const sceneSubjects: SceneSubject[] = [
    new Songs(CameraManager.camera),
    new SkyBox(),
    new Car(CameraManager.camera),
    new Cube(),
    new EnvironmentLighting(),
    new Pavement(),
  ];
  // Perform asset loading
  try {
    await Promise.all(
      sceneSubjects.map((subject) => subject.load(loadingManager))
    );
  } catch (err) {
    console.error(err);
  }

  // Attach each object to the scene
  sceneSubjects.forEach((subject) => subject.attach(scene));
};
