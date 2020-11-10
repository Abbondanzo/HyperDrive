import { Color } from "../data/Color";

interface MaterialOptions {
  color: Color;
  /**
   * Ideally we'd use a map here, but this project is unpaid.
   *
   * @see https://resources.turbosquid.com/stemcell/stemcell-3d-modeling-workflow/stemcell-textures-materials/diffuse-specular-vs-basecolor/
   * @default near-black Color(20, 20, 20)
   */
  specular?: Color;
  /**
   * Constant from 0 to 1.
   *
   * @see https://cs.wellesley.edu/~cs307/readings/OpenGL-VRML-Materials.html
   * @default 1
   */
  shininess?: number;
  /**
   * Constant from 0 to 1.
   *
   * @default 1
   */
  reflectivity?: number;
}

export class Material {
  color: Color;
  specular: Color;
  shininess: number;
  reflectivity: number;

  constructor({ color, specular, shininess, reflectivity }: MaterialOptions) {
    this.color = color;
    this.specular = specular || new Color(20, 20, 20);
    this.shininess = shininess || 30;
    this.reflectivity = reflectivity || 0;
  }
}
