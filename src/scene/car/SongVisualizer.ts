import { Mesh, Object3D, PlaneGeometry, ShaderMaterial, Vector3 } from "three";

import {
  addSongFrequencyListener,
  SongFrequencyEvent,
} from "../../events/songFrequency";
import { N_BANDS } from "../../utils/constants";
import { VisualizerShader } from "../shaders/VisualizerShader";
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
      this.material.uniforms.frequencies.value = frequencyData;
    }
  };
}
