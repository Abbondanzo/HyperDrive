import { LoadingManager } from "three";

import { Splash } from "./splash/Splash";

type Callback = (loadingManager: LoadingManager) => void;

export const displaySplash = (container: HTMLElement, callback: Callback) => {
  const splash = new Splash(callback);
  container.appendChild(splash.container);
};
