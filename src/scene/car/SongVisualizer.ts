import {
  DataTexture,
  FloatType,
  Mesh,
  Object3D,
  PlaneGeometry,
  RedFormat,
  ShaderMaterial,
  Vector3,
} from "three";

import {
  addSongFrequencyListener,
  SongFrequencyEvent,
} from "../../events/songFrequency";
import { N_BANDS } from "../../utils/constants";
import { VisualizerShader } from "../shaders/VisualizerShader";
import { FFT_SIZE } from "./../../utils/constants";
import { SceneSubject } from "./../SceneSubject";

export class SongVisualizer implements SceneSubject {
  name = "SongVisualizer";

  private mesh: Mesh;
  private material: ShaderMaterial;

  constructor() {
    addSongFrequencyListener(this.handleSongFrequency);
  }

  async load() {
    const geometry = new PlaneGeometry(0.15, 0.15, N_BANDS * 2);
    this.material = new ShaderMaterial({
      ...VisualizerShader,
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
      const dataTexture = this.toDataTexture(frequencyData);
      this.material.uniforms.frequencies.value = dataTexture;
    }
  };

  private toDataTexture(frequencyData: Uint8Array) {
    const height = 1;
    const width = FFT_SIZE / 2;
    const floatArray = new Float32Array(frequencyData);
    return new DataTexture(floatArray, width, height, RedFormat, FloatType);
  }
}
