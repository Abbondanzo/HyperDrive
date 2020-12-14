import { Mesh, Object3D, PlaneGeometry, ShaderMaterial, Vector3 } from "three";

import {
  addSongFrequencyListener,
  SongFrequencyEvent,
} from "../../events/songFrequency";
import { addToWindow } from "./../../utils/addToWindow";
import { SceneSubject } from "./../SceneSubject";
import { VisualizerShader } from "../shaders/VisualizerShader";

export class SongVisualizer implements SceneSubject {
  name = "SongVisualizer";

  private static FFT_SIZE = 1024;
  private static N_BANDS = 16;

  private mesh: Mesh;
  private material: ShaderMaterial;

  constructor() {
    addSongFrequencyListener(this.handleSongFrequency);
  }

  async load() {
    const geometry = new PlaneGeometry(0.15, 0.15, SongVisualizer.N_BANDS * 2);
    this.material = new ShaderMaterial({
      ...VisualizerShader,
      defines: {
        FFT_SIZE: SongVisualizer.FFT_SIZE,
        N_BANDS: SongVisualizer.N_BANDS,
      },
      uniforms: {
        frequencies: { value: new Float32Array(SongVisualizer.FFT_SIZE) },
      },
      transparent: true,
    });

    this.mesh = new Mesh(geometry, this.material);
    this.mesh.position.set(0, 0.375, -0.4);
  }

  attach(parent: Object3D) {
    parent.add(this.mesh);
  }

  setRotation(xRotation: number) {
    this.mesh.setRotationFromAxisAngle(new Vector3(1, 0, 0), xRotation);
  }

  private readonly handleSongFrequency = ({
    frequencyData,
  }: SongFrequencyEvent) => {
    if (this.material) {
      this.material.uniforms.frequencies.value = frequencyData;
    }
  };
}
