import { Camera } from "../Camera";
import { Scene } from "../Scene";

export interface Renderer {
  render(scene: Scene, camera: Camera);
}
