import { dispatchWindowResizeEvent } from "../events/windowResize";

class EventManager {
  addListeners() {
    window.addEventListener("resize", this.handleResize);
  }

  removeListeners() {
    window.removeEventListener("resize", this.handleResize);
  }

  private readonly handleResize = () => {
    dispatchWindowResizeEvent({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
}

// Export single class instance
export default new EventManager();
