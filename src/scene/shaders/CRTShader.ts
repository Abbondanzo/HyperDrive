import fragmentShader from "./crt_frag.glsl";
import vertexShader from "./crt_vert.glsl";

export const CRTShader = {
  uniforms: {
    tDiffuse: { type: "t", value: null },
    scanlineCount: { type: "f", value: 1200.0 },
    opacity: { type: "f", value: 0.1 },
  },
  fragmentShader,
  vertexShader,
};
