import fragmentShader from "./badtv_frag.glsl";
import vertexShader from "./badtv_vert.glsl";

export const BadTVShader = {
  uniforms: {
    tDiffuse: { type: "t", value: null },
    time: { type: "f", value: 0.0 },
    distortion: { type: "f", value: 3.0 },
    distortion2: { type: "f", value: 5.0 },
    speed: { type: "f", value: 0.2 },
    rollSpeed: { type: "f", value: 0.1 },
  },
  fragmentShader,
  vertexShader,
};
