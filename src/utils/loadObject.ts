import { Group, LoadingManager } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

export const loadObject = (
  loadingManager: LoadingManager,
  path: string
): Promise<Group> => {
  return new OBJLoader(loadingManager).loadAsync(path);
};
