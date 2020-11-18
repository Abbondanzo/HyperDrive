import Stats from "stats.js";

import { addFrameListener } from "../events/frame";
import { isDevelopment } from "../utils/isDevelopment";

export const displayStats = (container: HTMLElement) => {
  if (!isDevelopment()) {
    return;
  }

  const stats = new Stats();
  stats.setMode(0);

  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0";
  stats.domElement.style.top = "0";

  container.appendChild(stats.domElement);

  addFrameListener(() => {
    stats.update();
  });
};
