import { LoadingManager, Scene } from "three";

import CameraManager from "../manager/CameraManager";
import { isDevelopment } from "../utils/isDevelopment";
import { Songs } from "./audio/Songs";
import { SkyBox } from "./background/SkyBox";
import { Car } from "./car/Car";
import { Cube } from "./cube/Cube";
import { EnvironmentLighting } from "./lighting/EnvironmentLighting";
import { Road } from "./road/Road";
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
    new Road(),
  ];
  // Perform asset loading
  try {
    const loadTimes = await Promise.all(
      sceneSubjects.map((subject) =>
        measurePromise(subject.name, () => subject.load(loadingManager))
      )
    );
    if (isDevelopment()) {
      console.info(loadTimes);
    }
  } catch (err) {
    console.error(err);
  }

  // Attach each object to the scene
  sceneSubjects.forEach((subject) => subject.attach(scene));
};

const measurePromise = (
  name: string,
  fn: () => Promise<any>
): Promise<[string, number]> => {
  const onPromiseDone = (): [string, number] => [
    name,
    performance.now() - start,
  ];
  const start = performance.now();
  return fn().then(onPromiseDone, onPromiseDone);
};
