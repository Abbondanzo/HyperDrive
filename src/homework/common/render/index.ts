import { renderCube } from "./cube";

// TODO: These options should be placed in a singleton vault
interface RenderOptions {
  shape: Canvas3D.Shape;
  context: WebGLRenderingContext;
  bufferCoords: WebGLBuffer;
  normalBuffer: WebGLBuffer | null;
}

export const renderShape = ({
  shape,
  context,
  bufferCoords,
  normalBuffer,
}: RenderOptions) => {
  switch (shape.type) {
    case "CUBE":
      renderCube(context, shape as Canvas3D.Cube, bufferCoords, normalBuffer);
      break;
    default:
      console.error("Rendering unhandled shape type", shape);
  }
};
