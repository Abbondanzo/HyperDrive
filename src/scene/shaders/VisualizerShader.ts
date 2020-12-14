import fragmentShader from "./visualizer_frag.glsl";
import vertexShader from "./visualizer_vert.glsl";

export const VisualizerShader = {
  defines: {
    FFT_SIZE: 1024,
    N_BANDS: 16,
  },
  uniforms: {
    frequencies: { type: "f", value: new Int8Array(16) },
  },
  fragmentShader,
  vertexShader,
};
