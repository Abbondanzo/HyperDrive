export const buildShape = (
  type: Canvas3D.ShapeType,
  properties: Partial<Canvas3D.Shape> = {}
): Canvas3D.Shape => {
  return {
    type,
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    dimensions: {
      width: 1,
      height: 1,
      depth: 1,
    },
    color: {
      red: 0,
      green: 0,
      blue: 0,
    },
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    ...properties,
  };
};
