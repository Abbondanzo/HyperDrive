import { Group, LoadingManager } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const loadGLTF = (
  loadingManager: LoadingManager,
  path: string
): Promise<Group> => {
  return new Promise(
    (
      resolve: (object: Group) => void,
      reject: (err: Error | ErrorEvent) => void
    ) => {
      const gltfLoader = new GLTFLoader(loadingManager);
      gltfLoader.load(
        path,
        (gltf: GLTF) => {
          const group = new Group();
          group.add(...gltf.scene.children);
          resolve(group);
        },
        undefined,
        (error: Error | ErrorEvent) => {
          reject(error);
        }
      );
    }
  );
};
