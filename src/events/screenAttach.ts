import EventBus from "./EventBus";

export interface ScreenAttachEvent {
  screen: HTMLElement;
}

const SCREEN_ATTACH = "SCREEN_ATTACH";

export const {
  addEventListener: addScreenAttachListener,
  removeEventListener: removeScreenAttachListener,
  dispatch: dispatchScreenAttachEvent,
} = EventBus.buildEvent<ScreenAttachEvent>(SCREEN_ATTACH);
