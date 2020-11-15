import { CubeTexture, CubeTextureLoader, LoadingManager, Scene } from "three";

import { SceneSubject } from "../SceneSubject";

export class SkyBox implements SceneSubject {
  private cubeTexture: CubeTexture;

  async load(loadingManager: LoadingManager) {
    this.cubeTexture = new CubeTextureLoader(loadingManager)
      .setPath("textures/cubemap/")
      .load(["px.png", "nx.png", "py.png", "black.png", "black.png", "nz.png"]);
  }

  attach(scene: Scene) {
    scene.background = this.cubeTexture;
  }
}
