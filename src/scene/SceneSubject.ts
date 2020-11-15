import { LoadingManager, Scene } from "three";

export interface SceneSubject {
  load(loadingManager: LoadingManager): Promise<void>;
  attach(scene: Scene): void;
}
