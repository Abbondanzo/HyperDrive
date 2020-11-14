import { dispatchMouseMoveEvent } from "../events/mouseMove";
import { dispatchWindowResizeEvent } from "../events/windowResize";

class EventManager {
  addListeners() {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("resize", this.handleResize);
  }

  removeListeners() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("resize", this.handleResize);
  }

  private readonly handleResize = () => {
    dispatchWindowResizeEvent({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  private readonly handleMouseMove = (event: MouseEvent) => {
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    dispatchMouseMoveEvent({ x, y });
  };
}

// Export single class instance
export default new EventManager();
