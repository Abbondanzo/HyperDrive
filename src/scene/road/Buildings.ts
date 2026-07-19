import {
  BoxGeometry,
  DynamicDrawUsage,
  InstancedMesh,
  LoadingManager,
  Matrix4,
  MeshBasicMaterial,
  Object3D,
  Quaternion,
  Texture,
  Vector3,
} from "three";

import { addFrameListener, FrameEvent } from "../../events/frame";
import { SceneSubject } from "../SceneSubject";
import {
  SKYSCRAPER_PALETTES,
  createSkyscraperTexture,
} from "../../utils/skyscraperTexture";
import { Lamps } from "./Lamps";
import { MovingObject } from "./MovingObject";
import { Pavement } from "./Pavement";

export class Buildings extends MovingObject implements SceneSubject {
  name = "Buildings";

  private static Z_DISTANCE = 480; // 30 long
  private static MAX_WIDTH_SQUARES = 3;
  private static SQUARE_SIZE = 12;
  private static FULL_SQUARE_SIZE = 16;
  private static VERTICAL_SCALE = 8;

  private static ROTATE_O = true;
  private static ROTATE_AFFECTED_ROWS = 15;
  private static ROTATE_MIN = Math.PI / 3;

  private static HIDDEN_Y = -10000;
  private static VARIANTS_PER_PALETTE = 3;

  private readonly instanceCount: number;
  private readonly length: number;
  private readonly width: number;

  private leftInstances: InstancedMesh[];
  private rightInstances: InstancedMesh[];

  // Used to track which z-row in the instances is closest to z=0
  private lastZOffset: number;

  constructor() {
    super();
    this.length = Math.floor(Buildings.Z_DISTANCE / Buildings.FULL_SQUARE_SIZE);
    this.width = Buildings.MAX_WIDTH_SQUARES;
    this.instanceCount = this.length * this.width;

    this.lastZOffset = 0;
    // Copied from Lamps
    this.offsetMultiplier =
      (Pavement.SQUARE_SIZE / Lamps.GAP_DISTANCE) * Pavement.OFFSET_MULTIPLIER;
    addFrameListener(this.handleFrame);
  }

  async load(loadingManager: LoadingManager) {
    const textures = SKYSCRAPER_PALETTES.flatMap((palette) =>
      Array.from({ length: Buildings.VARIANTS_PER_PALETTE }, () => {
        const texture = createSkyscraperTexture(palette);
        texture.repeat.set(1, 2);
        return texture;
      }),
    );

    this.leftInstances = textures.map((texture) => {
      const mesh = this.buildingMesh(texture);
      mesh.position.x = -Pavement.SQUARE_SIZE * 3;
      return mesh;
    });
    this.rightInstances = textures.map((texture) => {
      const mesh = this.buildingMesh(texture);
      mesh.position.x = Pavement.SQUARE_SIZE * 3;
      return mesh;
    });

    for (let length = 0; length < this.length; length++) {
      this.computeRow(length, 0);
    }
  }

  private buildingMesh(texture: Texture): InstancedMesh {
    const baseSize = Buildings.SQUARE_SIZE;
    const minHeight = Buildings.SQUARE_SIZE * Buildings.VERTICAL_SCALE;
    const boxGeometry = new BoxGeometry(baseSize, minHeight, baseSize);
    const material = new MeshBasicMaterial({ map: texture });
    const mesh = new InstancedMesh(boxGeometry, material, this.instanceCount);
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.frustumCulled = false;
    return mesh;
  }

  private computeRow(zRow: number, iterations: number) {
    // Discardable matrix instance
    const matrix = new Matrix4();
    const hiddenMatrix = new Matrix4().setPosition(0, Buildings.HIDDEN_Y, 0);

    for (let width = 0; width < this.width; width++) {
      let offset = Buildings.FULL_SQUARE_SIZE / 2;
      // Use full square size offset on the last row to hide skybox
      offset *= width + 1 === this.width ? 2 : 1;
      // Apply a z-offset based on how many times this row has been generated
      const zIterOffset = iterations * Buildings.Z_DISTANCE;
      const x = offset + Buildings.FULL_SQUARE_SIZE * width;
      // Make buildings closer to the road appear shorter
      let y = (Buildings.FULL_SQUARE_SIZE / -4) * (this.width - width);
      // Apply random vertical manipulation
      y -= Math.random() * 2.5 * Buildings.FULL_SQUARE_SIZE - offset;
      const z = offset + Buildings.FULL_SQUARE_SIZE * zRow + zIterOffset;
      // Index of the matrix in the instance mesh
      const idx = zRow * this.width + width;
      // Randomly choose which texture variant this building uses
      const variantIdx = Math.floor(Math.random() * this.leftInstances.length);

      this.leftInstances.forEach((instance, i) => {
        instance.setMatrixAt(
          idx,
          i === variantIdx
            ? matrix.setPosition(new Vector3(-x, y, -z))
            : hiddenMatrix,
        );
      });
      this.rightInstances.forEach((instance, i) => {
        instance.setMatrixAt(
          idx,
          i === variantIdx
            ? matrix.setPosition(new Vector3(x, y, -z))
            : hiddenMatrix,
        );
      });
    }

    // Necessary to recompute entire instance
    this.leftInstances.forEach((instance) => {
      instance.instanceMatrix.needsUpdate = true;
    });
    this.rightInstances.forEach((instance) => {
      instance.instanceMatrix.needsUpdate = true;
    });
  }

  attach(parent: Object3D) {
    parent.add(...this.leftInstances, ...this.rightInstances);
  }

  private readonly handleFrame = ({ delta }: FrameEvent) => {
    const distance = Lamps.GAP_DISTANCE * this.offsetPerMS * delta;
    const newOffset = this.leftInstances[0].position.z + distance;

    while (newOffset > this.lastZOffset + Buildings.FULL_SQUARE_SIZE * 4) {
      const iterations =
        1 + Math.floor(this.lastZOffset / Buildings.Z_DISTANCE);
      const zRow =
        (this.lastZOffset % Buildings.Z_DISTANCE) / Buildings.FULL_SQUARE_SIZE;
      this.computeRow(zRow, iterations);
      this.lastZOffset += Buildings.FULL_SQUARE_SIZE;
    }

    if (Buildings.ROTATE_O) {
      this.computeRotateO();
    }

    this.leftInstances.forEach((instance) => {
      instance.position.z = newOffset;
    });
    this.rightInstances.forEach((instance) => {
      instance.position.z = newOffset;
    });
  };

  private computeRotateO() {
    const closestRow =
      (this.lastZOffset % Buildings.Z_DISTANCE) / Buildings.FULL_SQUARE_SIZE;
    const offset =
      (this.lastZOffset +
        Buildings.FULL_SQUARE_SIZE * 4 -
        this.leftInstances[0].position.z) /
      Buildings.FULL_SQUARE_SIZE;

    const stepSize = 1 / Buildings.ROTATE_AFFECTED_ROWS;

    for (let idx = 0; idx < this.length; idx++) {
      const zRow = (closestRow + idx) % this.length;
      let theta = 0;

      // Only apply theta in the further rows
      if (this.length - idx <= Buildings.ROTATE_AFFECTED_ROWS) {
        const step = Buildings.ROTATE_AFFECTED_ROWS - (this.length - idx);
        const pctOffset = Math.min(step * stepSize + offset * stepSize, 1);
        theta = pctOffset * Buildings.ROTATE_MIN;
      }

      this.leftInstances.forEach((instance) =>
        this.applyRowRotation(instance, zRow, theta),
      );
      this.rightInstances.forEach((instance) =>
        this.applyRowRotation(instance, zRow, -theta),
      );
    }
  }

  private applyRowRotation(
    instancedMesh: InstancedMesh,
    zRow: number,
    theta: number,
  ) {
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();

    for (let width = 0; width < this.width; width++) {
      const mIdx = zRow * this.width + width;

      let matrix = new Matrix4();
      instancedMesh.getMatrixAt(mIdx, matrix);
      matrix.decompose(position, quaternion, scale);
      const yOffset = position.y;
      position.y = 0;
      quaternion.setFromAxisAngle(new Vector3(0, 0, 1), theta);
      matrix = matrix.compose(position, quaternion, scale);
      matrix = matrix.setPosition(position.x, yOffset, position.z);
      instancedMesh.setMatrixAt(mIdx, matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
  }
}
