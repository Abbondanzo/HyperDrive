import { BoxGeometry, Mesh, MeshPhongMaterial, Scene } from "three";

import { addFrameListener } from "../../events/frame";
import { SceneSubject } from "../SceneSubject";

export class Cube implements SceneSubject {
  name = "Cube";

  private cube: Mesh;

  constructor() {
    addFrameListener(this.handleFrame);
  }

  async load() {
    const geometry = new BoxGeometry();
    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      opacity: 0,
      transparent: true,
    });
    this.cube = new Mesh(geometry, material);
  }

  attach(scene: Scene) {
    this.cube.position.z -= 5;
    scene.add(this.cube);
  }

  private readonly handleFrame = () => {
    if (this.cube) {
      this.cube.rotation.x += 0.005;
      this.cube.rotation.y += 0.005;
    }
  };
}
