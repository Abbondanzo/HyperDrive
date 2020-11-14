import EventBus from "./EventBus";

export interface CanvasResizeEvent {
  width: number;
  height: number;
}

const CANVAS_RESIZE = "CANVAS_RESIZE";

export const {
  addEventListener: addCanvasResizeListener,
  removeEventListener: removeCanvasResizeListener,
  dispatch: dispatchCanvasResizeEvent,
} = EventBus.buildEvent<CanvasResizeEvent>(CANVAS_RESIZE);
