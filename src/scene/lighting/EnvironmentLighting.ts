import { AmbientLight, PointLight, Scene } from "three";

import { SceneSubject } from "../SceneSubject";

export class EnvironmentLighting implements SceneSubject {
  private ambientLight: AmbientLight;
  private pointLight: PointLight;

  async load() {
    this.ambientLight = new AmbientLight(0xffffff, 0.2);
    this.pointLight = new PointLight(0xffffff);
    this.pointLight.position.set(1, 2, 3);
  }

  attach(scene: Scene) {
    scene.add(this.ambientLight);
    scene.add(this.pointLight);
  }
}
