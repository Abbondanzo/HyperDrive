import { AbstractObject } from "../Object";

export class Light extends AbstractObject {
  static TYPE = "light";

  constructor() {
    super();
    this.isLight = true;
    this.name = "Light";
    this.type = Light.TYPE;
  }
}
