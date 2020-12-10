import { Camera, Group, LoadingManager, Mesh, Object3D } from "three";

import { addToWindow } from "../../utils/addToWindow";
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
    // this.screen = this.getScreen(this.chassis);
    // Fine tuning the chassis around origin
    this.chassis.position.x = 0.345;
    this.chassis.position.y = -0.7;
    this.chassis.position.z = -0.1;
    this.chassis.castShadow = true;
    this.chassis.receiveShadow = true;
    addToWindow("chassis", this.screen);
  }

  attach(parent: Object3D) {
    const screenMesh = this.getScreen(this.chassis);
    this.screen.attach(screenMesh);

    const group = new Group();
    group.name = Car.GROUP_NAME;
    group.add(this.chassis);
    group.add(this.camera);
    parent.add(group);
  }

  private getScreen(group: Object3D): Mesh | null {
    let screen = group.children.find((child) => child.name === "Screen");
    if (screen) {
      return screen as Mesh;
    }
    for (const child of group.children) {
      let screen = this.getScreen(child);
      if (screen) {
        return screen;
      }
    }
    return null;
  }
}
