namespace Canvas3D {
  type ShapeType = "RECTANGLE" | "TRIANGLE" | "CIRCLE" | "STAR" | "CUBE";

  interface Vector3 {
    x: number;
    y: number;
    z: number;
  }

  type Position = Vector3;

  interface Dimensions {
    width: number;
    height: number;
    depth: number;
  }

  interface Color {
    red: number;
    blue: number;
    green: number;
  }

  type Translation = Vector3;

  interface Rotation {
    x: number;
    y: number;
    z: number;
  }

  type Scale = Vector3;

  interface Shape {
    type: ShapeType;
    position: Position;
    dimensions: Dimensions;
    color: Color;
    translation: Translation;
    rotation: Rotation;
    scale: Scale;
  }

  // 2D
  type Triangle = Shape & { type: "TRIANGLE" };
  type Rectangle = Shape & { type: "RECTANGLE" };
  type Circle = Shape & { type: "CIRCLE" };
  type Star = Shape & { type: "STAR" };
  // 3D
  type Cube = Shape & { type: "CUBE" };
}
