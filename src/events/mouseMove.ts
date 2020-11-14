import EventBus from "./EventBus";

export interface MouseMoveEvent {
  x: number;
  y: number;
}

const MOUSE_MOVE = "MOUSE_MOVE";

export const {
  addEventListener: addMouseMoveListener,
  removeEventListener: removeMouseMoveListener,
  dispatch: dispatchMouseMoveEvent,
} = EventBus.buildEvent<MouseMoveEvent>(MOUSE_MOVE);
