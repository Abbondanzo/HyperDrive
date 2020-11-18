import { Group, LoadingManager, Object3D } from "three";

import { addFrameListener, FrameEvent } from "../../events/frame";
import { addToWindow } from "../../utils/addToWindow";
import { loadGLTF } from "../../utils/loadGLTF";
import { SceneSubject } from "../SceneSubject";
import { MovingObject } from "./MovingObject";

export class Lamps extends MovingObject implements SceneSubject {
  private static DISTANCE = 20;

  private lamp: Group;

  constructor() {
    super();
    this.offsetMultiplier = 1;
    addFrameListener(this.handleFrame);
  }

  async load(loadingManager: LoadingManager) {
    this.lamp = await loadGLTF(loadingManager, "models/lamp.gltf");
    addToWindow("lamp", this.lamp);
    this.lamp.position.z = -200;
  }

  attach(parent: Object3D) {
    parent.add(this.lamp);
  }

  private readonly handleFrame = ({ delta }: FrameEvent) => {
    const distance = Lamps.DISTANCE * this.offsetPerMS;
    const newOffset = this.lamp.position.z + delta * distance;
    this.lamp.position.z = newOffset;
  };
}
