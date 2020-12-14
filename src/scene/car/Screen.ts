import { Mesh, Object3D, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

import { CSS_DISTANCE } from "./../../utils/constants";
import { SceneSubject } from "./../SceneSubject";
import { ScreenDOM } from "./ScreenDOM";
import { SongVisualizer } from "./SongVisualizer";

export class Screen implements SceneSubject {
  name = "Screen";

  private object: Object3D;
  private readonly screenDOM: ScreenDOM;
  private readonly visualizer: SongVisualizer;

  constructor() {
    this.screenDOM = new ScreenDOM();
    this.visualizer = new SongVisualizer();
  }

  async load() {
    this.object = new Object3D();
    const css3dObject = new CSS3DObject(this.screenDOM.div);
    this.object.add(css3dObject);

    await this.visualizer.load();
  }

  attach(parent: Object3D) {
    this.copyWorldPosition(parent as Mesh, this.object);
    this.object.updateWorldMatrix(false, true);
    this.screenDOM.setIntersect(parent);
    parent.add(this.object);
    this.visualizer.attach(parent);
    this.visualizer.setRotation(this.getXRotation(parent as Mesh));
  }

  private copyWorldPosition(source: Mesh, dest: Object3D) {
    // Whole lotta guess-and-check
    const pos = new Vector3(0.685, -0.49, -0.1).multiplyScalar(CSS_DISTANCE);
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
    this.screenDOM.div.style.width = `${deltaX * 2 * CSS_DISTANCE}px`;
    this.screenDOM.div.style.height = `${deltaY * 2.35 * CSS_DISTANCE}px`;
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
