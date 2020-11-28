import { Box3, Group, LoadingManager, Object3D, SpotLight } from "three";

import { addFrameListener, FrameEvent } from "../../events/frame";
import { loadGLTF } from "../../utils/loadGLTF";
import { SceneSubject } from "../SceneSubject";
import { MovingObject } from "./MovingObject";
import { Pavement } from "./Pavement";

export class Lamps extends MovingObject implements SceneSubject {
  name = "Lamps";

  static GAP_DISTANCE = 80;
  private static TOTAL_DISTANCE = 200;

  private lampModel: Group;
  private lampsGroup: Group;

  constructor() {
    super();
    this.offsetMultiplier =
      (Pavement.SQUARE_SIZE / Lamps.GAP_DISTANCE) * Pavement.OFFSET_MULTIPLIER;
    addFrameListener(this.handleFrame);
  }

  async load(loadingManager: LoadingManager) {
    this.lampModel = await loadGLTF(loadingManager, "models/lamp.gltf");
  }

  attach(parent: Object3D) {
    const leftSide = this.buildSide(true);
    const rightSide = this.buildSide(false);
    this.lampsGroup = new Group();
    this.lampsGroup.add(leftSide, rightSide);
    parent.add(this.lampsGroup);
  }

  private readonly handleFrame = ({ delta }: FrameEvent) => {
    const distance = Lamps.GAP_DISTANCE * this.offsetPerMS;
    const newOffset =
      (this.lampsGroup.position.z + delta * distance) % Lamps.GAP_DISTANCE;
    this.lampsGroup.position.z = newOffset;
  };

  private buildSide(left: boolean): Group {
    const sideGroup = new Group();
    for (
      let zOffset = -Lamps.TOTAL_DISTANCE;
      zOffset <= Lamps.GAP_DISTANCE;
      zOffset += Lamps.GAP_DISTANCE
    ) {
      const lampItem = this.lampModel.clone(true);
      lampItem.scale.x *= left ? -1 : 1;
      this.addLightToLamp(lampItem);
      lampItem.position.z = zOffset;
      sideGroup.add(lampItem);
    }
    sideGroup.position.x = left ? -4 : 4;
    return sideGroup;
  }

  private addLightToLamp(lamp: Group) {
    const spotlight = new SpotLight(0xffffdd);
    spotlight.intensity = 2;
    spotlight.penumbra = 0.5;
    const boundingBox = new Box3().setFromObject(lamp);
    const x = boundingBox.min.x;
    const y = boundingBox.max.y;
    const z = (boundingBox.max.z + boundingBox.min.z) / 2;
    spotlight.position.set(x, y, z);
    spotlight.lookAt(x, 0, z);
    lamp.add(spotlight);
    lamp.add(spotlight.target); // This is to avoid all lights pointing at origin
  }
}
