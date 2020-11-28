import {
  BoxBufferGeometry,
  Euler,
  InstancedMesh,
  Matrix4,
  MeshPhongMaterial,
  Object3D,
  Quaternion,
  Vector3,
} from "three";
import { addFrameListener, FrameEvent } from "../../events/frame";

import { SceneSubject } from "../SceneSubject";
import { Lamps } from "./Lamps";
import { MovingObject } from "./MovingObject";
import { Pavement } from "./Pavement";

export class Buildings extends MovingObject implements SceneSubject {
  name = "Buildings";

  private static DISTANCE = 396; // 33 long
  private static MAX_WIDTH_SQUARES = 3;
  private static SQUARE_SIZE = 10;
  private static FULL_SQUARE_SIZE = 12;

  private readonly instanceCount: number;
  private readonly length: number;
  private readonly width: number;

  private leftInstance: InstancedMesh;
  private rightInstance: InstancedMesh;

  private lastZOffset: number;

  constructor() {
    super();
    this.length = Math.floor(Buildings.DISTANCE / Buildings.FULL_SQUARE_SIZE);
    this.width = Buildings.MAX_WIDTH_SQUARES;
    this.instanceCount = this.length * this.width;

    this.lastZOffset = 0;
    this.offsetMultiplier =
      (Pavement.SQUARE_SIZE / Lamps.GAP_DISTANCE) * Pavement.OFFSET_MULTIPLIER;
    addFrameListener(this.handleFrame);
  }

  async load() {
    const baseSize = Buildings.SQUARE_SIZE;
    const minHeight = Buildings.SQUARE_SIZE * 2;
    const boxGeometry = new BoxBufferGeometry(baseSize, minHeight, baseSize);
    const material = new MeshPhongMaterial({ color: 0xff0000 });

    this.leftInstance = new InstancedMesh(
      boxGeometry,
      material,
      this.instanceCount
    );
    this.leftInstance.position.x = -Pavement.SQUARE_SIZE * 3;
    this.rightInstance = new InstancedMesh(
      boxGeometry.clone(),
      material.clone(),
      this.instanceCount
    );
    this.rightInstance.position.x = Pavement.SQUARE_SIZE * 3;

    for (let length = 0; length < this.length; length++) {
      this.computeRow(length, 0);
    }
  }

  private computeRow(zRow: number, iterations: number) {
    const matrix = new Matrix4();

    for (let width = 0; width < this.width; width++) {
      let offset = Buildings.FULL_SQUARE_SIZE / 2;
      offset *= width + 1 === this.width ? 2 : 1;
      const zIterOffset = iterations * Buildings.DISTANCE;
      const z = offset + Buildings.FULL_SQUARE_SIZE * zRow + zIterOffset;
      const x = offset + Buildings.FULL_SQUARE_SIZE * width;
      const scaleY = 1 + Math.random() * 4;
      const idx = zRow * this.width + width;

      this.leftInstance.setMatrixAt(
        idx,
        this.positionMatrix(matrix, -x, -z, scaleY)
      );
      this.rightInstance.setMatrixAt(
        idx,
        this.positionMatrix(matrix, x, -z, scaleY)
      );
    }
    this.leftInstance.instanceMatrix.needsUpdate = true;
    this.rightInstance.instanceMatrix.needsUpdate = true;
  }

  private positionMatrix(
    matrix: Matrix4,
    x: number,
    z: number,
    scaleY: number
  ) {
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3(1, 1, 1);

    position.x = x;
    position.z = z;

    scale.y = scaleY;

    return matrix.compose(position, quaternion, scale);
  }

  attach(parent: Object3D) {
    parent.add(this.leftInstance, this.rightInstance);
  }

  private readonly handleFrame = ({ delta }: FrameEvent) => {
    const distance = Lamps.GAP_DISTANCE * this.offsetPerMS * delta;
    const newOffset = this.leftInstance.position.z + distance;

    while (newOffset > this.lastZOffset + Buildings.FULL_SQUARE_SIZE * 4) {
      const iterations = 1 + Math.floor(this.lastZOffset / Buildings.DISTANCE);
      const zRow =
        (this.lastZOffset % Buildings.DISTANCE) / Buildings.FULL_SQUARE_SIZE;
      this.computeRow(zRow, iterations);
      this.lastZOffset += Buildings.FULL_SQUARE_SIZE;
    }

    this.leftInstance.position.z = newOffset;
    this.rightInstance.position.z = newOffset;
  };
}
