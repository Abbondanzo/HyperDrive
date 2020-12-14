import { Mesh, MeshLambertMaterial, Object3D, PlaneGeometry } from "three";

import { addFrameListener } from "../../events/frame";
import { SceneSubject } from "../SceneSubject";

export class Mountains implements SceneSubject {
  name = "Mountains";

  private static Z_DISTANCE = 400;

  private plane: Mesh;

  private geometry: PlaneGeometry;
  private zDiffs: number[];

  constructor() {
    addFrameListener(this.handleFrame);
  }

  async load() {
    this.geometry = new PlaneGeometry(160, 80, 20, 10);
    const material = new MeshLambertMaterial({ color: 0x000000 });
    this.zDiffs = Array(this.geometry.vertices.length).fill(0);
    this.plane = new Mesh(this.geometry, material);
    this.plane.rotateX(-Math.PI / 4);
    this.plane.position.set(0, -20, -Mountains.Z_DISTANCE);
  }

  attach(parent: Object3D) {
    parent.add(this.plane);
  }

  private readonly handleFrame = () => {
    this.assignRandomDiffs();
  };

  private assignRandomDiffs() {
    for (let idx = 0; idx < this.zDiffs.length; idx++) {
      const diff = this.zDiffs[idx];
      if (diff < 0.01 && diff > -0.01) {
        this.zDiffs[idx] =
          Math.random() * 20 + 10 - this.geometry.vertices[idx].z;
      } else {
        const pct = 0.015;
        this.zDiffs[idx] = diff * (1 - pct);
        this.geometry.vertices[idx].z += diff * pct;
      }
    }
    this.geometry.verticesNeedUpdate = true;
    this.geometry.normalsNeedUpdate = true;
  }
}
