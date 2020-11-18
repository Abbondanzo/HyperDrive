import { LoadingManager, Object3D } from "three";

export interface SceneSubject {
  name: string;
  load(loadingManager: LoadingManager): Promise<void>;
  attach(parent: Object3D): void;
}
