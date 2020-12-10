import EventBus from "./EventBus";

export interface LockedMousemoveEvent {
  x: number;
  y: number;
}

const LOCKED_MOUSEMOVE = "LOCKED_MOUSEMOVE";

export const {
  addEventListener: addLockedMousemoveListener,
  removeEventListener: removeLockedMousemoveListener,
  dispatch: dispatchLockedMousemoveEvent,
} = EventBus.buildEvent<LockedMousemoveEvent>(LOCKED_MOUSEMOVE);
