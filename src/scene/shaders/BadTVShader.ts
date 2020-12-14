import fragmentShader from "./badtv_frag.glsl";
import vertexShader from "./badtv_vert.glsl";

// Attribution: https://github.com/felixturner/bad-tv-shader
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
