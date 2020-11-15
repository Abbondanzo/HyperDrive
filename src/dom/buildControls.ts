import { MuteBotton } from "./controls/MuteButton";
import { PlayPauseButton } from "./controls/PlayPauseButton";

export const buildControls = (container: HTMLElement) => {
  const controls = document.createElement("div");
  controls.id = "controls";
  const playPause = new PlayPauseButton();
  controls.appendChild(playPause.button);
  const mute = new MuteBotton();
  controls.appendChild(mute.button);

  container.appendChild(controls);
};
