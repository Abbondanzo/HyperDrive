import EventBus from "./EventBus";

export interface WindowResizeEvent {
  width: number;
  height: number;
}

const WINDOW_RESIZE = "WINDOW_RESIZE";

export const {
  addEventListener: addWindowResizeListener,
  removeEventListener: removeWindowResizeListener,
  dispatch: dispatchWindowResizeEvent,
} = EventBus.buildEvent<WindowResizeEvent>(WINDOW_RESIZE);
