import { CubeTextureLoader, LoadingManager } from "three";

export const loadCubeMap = (loadingManager?: LoadingManager) => {
  return new CubeTextureLoader(loadingManager)
    .setPath("textures/cubemap/")
    .load(["px.png", "nx.png", "py.png", "black.png", "black.png", "nz.png"]); // px, nx, py, ny, pz, nz
};
