import { AbstractObject } from "./Object";

export class Scene extends AbstractObject {
  static TYPE = "scene";

  constructor() {
    super();
    this.name = "Scene";
    this.type = Scene.TYPE;
  }
}
