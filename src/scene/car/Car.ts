import { Camera, Group, LoadingManager, Object3D } from "three";

import { addToWindow } from "../../utils/addToWindow";
import { loadGLTF } from "../../utils/loadGLTF";
import { SceneSubject } from "../SceneSubject";

export class Car implements SceneSubject {
  name = "Car";

  private static GROUP_NAME = "CAR_CAMERA_GROUP";

  private camera: Camera;
  private chassis: Group;

  constructor(camera: Camera) {
    this.camera = camera;
  }

  async load(loadingManager: LoadingManager) {
    this.chassis = await loadGLTF(loadingManager, "models/chassis.gltf");
    // Fine tuning the chassis around origin
    this.chassis.position.x = 0.275;
    this.chassis.position.y = -0.7;
    this.chassis.position.z = -0.1;
    // TODO: Until we have a fully-developed model, hide this one
    this.chassis.visible = true;
    this.chassis.castShadow = true;
    this.chassis.receiveShadow = true;
    addToWindow("chassis", this.chassis);
  }

  attach(parent: Object3D) {
    const group = new Group();
    group.name = Car.GROUP_NAME;
    group.add(this.chassis);
    group.add(this.camera);
    parent.add(group);
  }
}
