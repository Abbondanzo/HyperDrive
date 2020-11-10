import { Mesh } from "../../../core/objects/Mesh";
import { Cube } from "./cube";

// TODO: These options should be placed in a singleton vault
interface RenderOptions {
  shape: Canvas3D.Shape;
  context: WebGLRenderingContext;
  bufferCoords: WebGLBuffer;
  normalBuffer: WebGLBuffer | null;
}

export const renderShape = ({ shape }: RenderOptions): Mesh => {
  switch (shape.type) {
    case "CUBE":
      return new Cube();
    default:
      console.error("Rendering unhandled shape type", shape);
  }
};
