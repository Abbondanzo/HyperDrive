import fragmentShader from "./static_frag.glsl";
import vertexShader from "./static_vert.glsl";

export const StaticShader = {
  uniforms: {
    tDiffuse: { type: "t", value: null },
    time: { type: "f", value: 0.0 },
    amount: { type: "f", value: 0.025 },
    size: { type: "f", value: 4.0 },
  },
  fragmentShader,
  vertexShader,
};
