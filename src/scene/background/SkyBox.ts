import {
  CubeTexture,
  CubeTextureLoader,
  Fog,
  LoadingManager,
  Scene,
} from "three";

import { SceneSubject } from "../SceneSubject";

export class SkyBox implements SceneSubject {
  name = "Sky Box";

  private cubeTexture: CubeTexture;
  private fog: Fog;

  async load(loadingManager: LoadingManager) {
    this.cubeTexture = new CubeTextureLoader(loadingManager)
      .setPath("textures/cubemap/")
      .load(["px.png", "nx.png", "py.png", "black.png", "black.png", "nz.png"]);
    this.fog = new Fog(0x111111, 1, 200);
  }

  attach(parent: Scene) {
    parent.background = this.cubeTexture;
    parent.fog = this.fog;
  }
}
