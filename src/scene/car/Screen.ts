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
    this.div.id = "screen";
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
    // Whole lotta guess-and-check
    const pos = new Vector3(0.55, -0.5, -0.1).multiplyScalar(
      Screen.CSS_DISTANCE
    );
    dest.position.set(pos.x, pos.y, pos.z);
    // Rotation
    const rotationX = this.getXRotation(source);
    dest.rotateX(rotationX);
    // Sizing
    this.applyScale(source);
    // For update
    dest.updateMatrix();
  }

  private applyScale(source: Mesh) {
    const { max, min } = source.geometry.boundingBox;
    const deltaX = Math.abs(max.x - min.x);
    const deltaY = Math.abs(max.y - min.y);
    this.div.style.width = `${deltaX * 2 * Screen.CSS_DISTANCE}px`;
    this.div.style.height = `${deltaY * 2.25 * Screen.CSS_DISTANCE}px`;
  }

  // Get X rotation in radians
  private getXRotation(source: Mesh) {
    const { max, min } = source.geometry.boundingBox;
    // Why 1.21? Why not?
    const deltaX = 1.21 * Math.abs(max.x - min.x);
    const deltaY = Math.abs(max.y - min.y);
    return -Math.atan(deltaX / deltaY);
  }
}
