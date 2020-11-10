import Camera from "../webgl/Camera";
import Light from "../webgl/Light";
import Scene from "../webgl/Scene";
import {
  DEFAULT_CAMERA_SETTINGS,
  DEFAULT_LIGHT_SETTINGS,
  DEFAULT_SHAPES,
} from "./constants";

export const init = (canvas: HTMLCanvasElement) => {
  const shapes = DEFAULT_SHAPES;
  const camera = Camera.fromSettings(DEFAULT_CAMERA_SETTINGS);
  const light = Light.fromSettings(DEFAULT_LIGHT_SETTINGS);
  const scene = Scene.init(canvas);
  scene.render(shapes, camera, light);
};
