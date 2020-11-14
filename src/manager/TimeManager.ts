import { dispatchFrameEvent } from "../events/frame";

class TimeManager {
  private lastTime: number | null;
  private lastFrame: number;

  constructor() {
    this.lastTime = null;
    this.lastFrame = 0;
  }

  play() {
    // Don't attempt to reset if we're already playing
    if (this.lastTime) {
      return;
    }
    // Grab a time so that the loop doesn't exit early
    requestAnimationFrame((time) => {
      this.lastTime = time;
    });
    // Assign the frame of calling to loop
    this.lastFrame = requestAnimationFrame(this.loop);
  }

  pause() {
    this.lastTime = null;
  }

  private readonly loop = (currentTime: number) => {
    // If lastTime is null, this means we should pause
    if (this.lastTime === null) {
      return;
    }
    const delta = currentTime - this.lastTime;
    this.lastTime = currentTime;
    dispatchFrameEvent({
      delta,
      elapsedTime: currentTime,
      frame: this.lastFrame + 1,
    });
    this.lastFrame = requestAnimationFrame(this.loop);
  };
}

export default new TimeManager();
