import EventBus from "./EventBus";

export interface LockedMousedownEvent {
  x: number;
  y: number;
}

const LOCKED_MOUSEDOWN = "LOCKED_MOUSEDOWN";

export const {
  addEventListener: addLockedMousedownListener,
  removeEventListener: removeLockedMousedownListener,
  dispatch: dispatchLockedMousedownEvent,
} = EventBus.buildEvent<LockedMousedownEvent>(LOCKED_MOUSEDOWN);
