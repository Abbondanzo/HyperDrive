import { LoadingManager, Object3D } from "three";

export interface SceneSubject {
  load(loadingManager: LoadingManager): Promise<void>;
  attach(parent: Object3D): void;
}
