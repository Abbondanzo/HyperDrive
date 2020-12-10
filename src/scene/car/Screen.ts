import { LoadingManager, Mesh, Object3D, Quaternion, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import CameraManager from "../../manager/CameraManager";

import { SceneSubject } from "./../SceneSubject";

export class Screen implements SceneSubject {
  name = "Screen";

  // Should match CameraManager.CSS_DISTANCE
  private static CSS_DISTANCE = 500;

  private readonly div: HTMLDivElement;
  private object: Object3D;

  constructor(width: number, height: number) {
    this.div = document.createElement("div");
    // this.div.style.width = `${width * 30}px`;
    // this.div.style.height = `${height * 30}px`;
    this.div.style.color = "#fff";
    this.div.innerHTML = "HELLO WORLD!";
  }

  async load(loadingManager: LoadingManager) {
    this.object = new Object3D();
    const css3dObject = new CSS3DObject(this.div);
    this.object.add(css3dObject);
  }

  attach(parent: Object3D) {
    this.copyWorldPosition(parent as Mesh, this.object);
    // this.object.position.z = -200;
    // this.object.rotateX(-0.3);
    this.object.updateWorldMatrix(false, true);
    // this.object.matrixWorldNeedsUpdate = true;
    parent.add(this.object);
  }

  private copyWorldPosition(source: Mesh, dest: Object3D) {
    // Position
    const sourcePos = this.getBottomLeftPosition(source);
    dest.position.set(sourcePos.x, sourcePos.y, sourcePos.z);
    // Rotation
    const rotationX = this.getXRotation(source);
    dest.rotateX(rotationX);
    // Sizing
    this.applyScale(source);
    // For update
    dest.updateMatrix();
  }

  // Get position of bottom-left corner of screen
  private getBottomLeftPosition(source: Mesh) {
    const { max, min } = source.geometry.boundingBox;
    let worldPosition = new Vector3();
    worldPosition = source.getWorldPosition(worldPosition);
    const deltaX = Math.abs(max.x - min.x);
    const deltaY = Math.abs(max.y - min.y);
    const deltaZ = Math.abs(max.z - min.z);
    const x = worldPosition.x; //+ deltaX / 2;
    const y = worldPosition.y; //- deltaY / 2;
    const z = worldPosition.z; //- deltaZ / 2;
    return new Vector3(x, y, z).multiplyScalar(Screen.CSS_DISTANCE);
  }

  private applyScale(source: Mesh) {
    const { max, min } = source.geometry.boundingBox;
    const deltaX = Math.abs(max.x - min.x);
    this.div.style.width = `${deltaX * 2 * Screen.CSS_DISTANCE}px`;
  }

  // Get X rotation in radians
  private getXRotation(source: Mesh) {
    const { max, min } = source.geometry.boundingBox;
    const deltaX = Math.abs(max.x - min.x);
    const deltaY = Math.abs(max.y - min.y);
    return -Math.atan(deltaX / deltaY);
  }
}
