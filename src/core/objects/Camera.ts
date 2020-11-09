import { AbstractObject } from "../Object";

export class Camera extends AbstractObject {
  static TYPE = "camera";

  constructor() {
    super();
    this.isCamera = true;
    this.name = "Camera";
    this.type = Camera.TYPE;
  }
}
