import { Group, LoadingManager, Object3D } from "three";

import { SceneSubject } from "../SceneSubject";
import { Lamps } from "./Lamps";
import { Pavement } from "./Pavement";

export class Road implements SceneSubject {
  name = "Road";

  private readonly subjects: SceneSubject[];
  private readonly group: Group;

  constructor() {
    this.subjects = [new Lamps(), new Pavement()];
    this.group = new Group();
    this.group.name = "Road";
  }

  async load(loadingManager: LoadingManager) {
    // Offset from car
    this.group.position.x = 0.275 * 2; // 2x the Car x offset
    this.group.position.y = -1.5;

    await Promise.all(
      this.subjects.map((object) => object.load(loadingManager))
    );
  }

  attach(parent: Object3D) {
    this.subjects.forEach((object) => {
      object.attach(this.group);
    });
    parent.add(this.group);
  }
}
