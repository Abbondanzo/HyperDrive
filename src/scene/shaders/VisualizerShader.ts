import { FFT_SIZE, N_BANDS } from "../../utils/constants";
import fragmentShader from "./visualizer_frag.glsl";
import vertexShader from "./visualizer_vert.glsl";

export const VisualizerShader = {
  defines: {
    BIN_SIZE: FFT_SIZE / 2,
    N_BANDS,
  },
  uniforms: {
    frequencies: { type: "f", value: new Int8Array(FFT_SIZE / 2) },
  },
  fragmentShader,
  vertexShader,
};
