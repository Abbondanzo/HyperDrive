import EventBus from "./EventBus";

export interface FrameEvent {
  delta: number;
  elapsedTime: number;
  frame: number;
}

const FRAME = "FRAME";

export const {
  addEventListener: addFrameListener,
  removeEventListener: removeFrameListener,
  dispatch: dispatchFrameEvent,
} = EventBus.buildEvent<FrameEvent>(FRAME);
