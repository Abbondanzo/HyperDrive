import { CubeTextureLoader, LoadingManager } from "three";

// http://wwwtyro.github.io/space-3d/#animationSpeed=1&fov=80&nebulae=true&pointStars=true&resolution=2048&seed=12l7ir9qp6nk&stars=true&sun=true
export const loadCubeMap = (loadingManager?: LoadingManager) => {
  return new CubeTextureLoader(loadingManager)
    .setPath("textures/cubemap/")
    .load(["px.png", "nx.png", "py.png", "black.png", "black.png", "nz.png"]); // px, nx, py, ny, pz, nz
};
