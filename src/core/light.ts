import AbstractObject from "./object";

export default class Light extends AbstractObject {
  constructor() {
    super();
    this.isLight = true;
    this.name = "Light";
    this.type = "light";
  }
}
