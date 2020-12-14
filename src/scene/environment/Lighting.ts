import { AmbientLight, HemisphereLight, Object3D, PointLight } from "three";

import { addSongFrequencyListener } from "../../events/songFrequency";
import { PURPLE, YELLOW } from "../../utils/constants";
import { SceneSubject } from "../SceneSubject";
import { SongFrequencyEvent } from "./../../events/songFrequency";

export class Lighting implements SceneSubject {
  name = "Environment Lighting";

  private ambientLight: AmbientLight;
  private pointLight: PointLight;
  private hemisphereLight: HemisphereLight;

  constructor() {
    addSongFrequencyListener(this.handleSongFrequency);
  }

  async load() {
    this.ambientLight = new AmbientLight(0xffffff, 0.1);
    this.pointLight = new PointLight(0xffffff, 0.1);
    this.pointLight.position.set(1, 2, 3);
    this.hemisphereLight = new HemisphereLight(YELLOW, PURPLE, 0.1);
    this.hemisphereLight.position.set(0, 50, 0);
  }

  attach(parent: Object3D) {
    parent.add(this.ambientLight);
    parent.add(this.hemisphereLight);
    // parent.add(this.pointLight);
  }

  private readonly handleSongFrequency = ({
    averageFrequency,
  }: SongFrequencyEvent) => {
    const increase = (0.1 * averageFrequency) / 255;
    this.ambientLight.intensity = 0.1 + increase;
    this.hemisphereLight.intensity = 0.1 + increase;
  };
}
