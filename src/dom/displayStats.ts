import { addFrameListener } from "../events/frame";
import Stats from "stats.js";

export const displayStats = (container: HTMLElement) => {
  if (process.env.NODE_ENV !== "development") {
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
