import { Camera, Group, LoadingManager, Scene } from "three";

import { addToWindow } from "../../utils/addToWindow";
import { loadObject } from "../../utils/loadObject";
import { SceneSubject } from "../SceneSubject";

export class Car implements SceneSubject {
  private static GROUP_NAME = "CAR_CAMERA_GROUP";

  private camera: Camera;
  private chassis: Group;

  constructor(camera: Camera) {
    this.camera = camera;
  }

  async load(loadingManager: LoadingManager) {
    this.chassis = await loadObject(loadingManager, "models/chassis.obj");
    // Fine tuning the chassis around origin
    this.chassis.position.x = 0.275;
    this.chassis.position.y = -0.7;
    this.chassis.position.z = -0.1;
    addToWindow("chassis", this.chassis);
  }

  attach(scene: Scene) {
    const group = new Group();
    group.name = Car.GROUP_NAME;
    group.add(this.chassis);
    group.add(this.camera);
    scene.add(group);
  }
}
