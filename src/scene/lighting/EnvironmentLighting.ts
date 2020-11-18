import { AmbientLight, Object3D, PointLight } from "three";

import { SceneSubject } from "../SceneSubject";

export class EnvironmentLighting implements SceneSubject {
  private ambientLight: AmbientLight;
  private pointLight: PointLight;

  async load() {
    this.ambientLight = new AmbientLight(0xffffff, 0.2);
    this.pointLight = new PointLight(0xffffff);
    this.pointLight.position.set(1, 2, 3);
  }

  attach(parent: Object3D) {
    parent.add(this.ambientLight);
    parent.add(this.pointLight);
  }
}
