import {
  Camera,
  Group,
  LoadingManager,
  Mesh,
  Object3D,
  PointLight,
} from "three";

import { addToWindow } from "../../utils/addToWindow";
import { CAR_X_OFFSET, PURPLE } from "../../utils/constants";
import { loadGLTF } from "../../utils/loadGLTF";
import { SceneSubject } from "../SceneSubject";
import { Screen } from "./Screen";

export class Car implements SceneSubject {
  name = "Car";

  private static GROUP_NAME = "CAR_CAMERA_GROUP";

  private readonly camera: Camera;
  private chassis: Group;
  private readonly screen: Screen;

  constructor(camera: Camera) {
    this.camera = camera;
    this.screen = new Screen();
  }

  async load(loadingManager: LoadingManager) {
    this.chassis = await loadGLTF(loadingManager, "models/chassis.gltf");
    await this.screen.load();
    // Fine tuning the chassis around origin
    this.applyOffset(this.chassis);
    this.chassis.castShadow = true;
    this.chassis.receiveShadow = true;
    addToWindow("chassis", this.screen);
  }

  attach(parent: Object3D) {
    const screenMesh = this.getScreenMesh(this.chassis);
    this.screen.attach(screenMesh);

    const group = new Group();
    group.name = Car.GROUP_NAME;
    group.add(this.chassis);
    group.add(this.camera);
    group.add(this.getPointLight());
    parent.add(group);
  }

  private applyOffset(object: Object3D) {
    object.position.x = CAR_X_OFFSET;
    object.position.y = -0.7;
    object.position.z = -0.1;
  }

  private getScreenMesh(group: Object3D): Mesh | null {
    let screen = group.children.find((child) => child.name === "Screen");
    if (screen) {
      return screen as Mesh;
    }
    for (const child of group.children) {
      let screen = this.getScreenMesh(child);
      if (screen) {
        return screen;
      }
    }
    return null;
  }

  private getPointLight() {
    const light = new PointLight(PURPLE, 0.2);
    this.applyOffset(light);
    light.position.y = 0.1;
    light.lookAt(0, -3, -3);
    return light;
  }
}
