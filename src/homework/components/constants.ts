import { buildShape } from "../common/model/canvas3DShapeBuilders";
import { hexToRgb } from "../common/util/colors";
import { CameraSettings } from "../webgl/Camera";
import { LightSettings } from "../webgl/Light";

const ORIGIN: Canvas3D.Position = { x: 0, y: 0, z: 0 };
const SIZE_ONE: Canvas3D.Dimensions = { width: 1, height: 1, depth: 1 };
const RED_RGB = hexToRgb("#FF0000");
const GREEN_RGB = hexToRgb("#00FF00");
const BLUE_RGB = hexToRgb("#0000FF");

const BLUE_CUBE = buildShape("CUBE", {
  position: ORIGIN,
  dimensions: SIZE_ONE,
  color: BLUE_RGB,
  translation: { x: 0, y: 0, z: 0 },
  scale: { x: 15, y: 15, z: 15 },
  rotation: { x: 0, y: 0, z: 0 },
});

const GREEN_CUBE = buildShape("CUBE", {
  position: ORIGIN,
  dimensions: SIZE_ONE,
  color: GREEN_RGB,
  translation: { x: 20, y: 0, z: 0 },
  scale: { x: 15, y: 15, z: 15 },
  rotation: { x: 0, y: 0, z: 0 },
});

const RED_CUBE = buildShape("CUBE", {
  position: ORIGIN,
  dimensions: SIZE_ONE,
  color: RED_RGB,
  translation: { x: -20, y: 0, z: 0 },
  scale: { x: 15, y: 15, z: 15 },
  rotation: { x: 0, y: 0, z: 0 },
});

export const DEFAULT_SHAPES = [BLUE_CUBE, GREEN_CUBE, RED_CUBE];

export const DEFAULT_CAMERA_SETTINGS: CameraSettings = {
  fovDegrees: 90,
  target: undefined,
  translation: { x: -45, y: -35, z: 21 },
  rotation: { x: 40, y: 235, z: 0 },
};

export const DEFAULT_LIGHT_SETTINGS: LightSettings = {
  direction: { x: 0.4, y: 0.3, z: -0.5 },
};
