type ListenerTarget = Window | Document | HTMLElement | MediaQueryList;

interface ListenerRecord {
  target: ListenerTarget;
  event: string;
  handler: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
}

export class EventListenerManager {
  private listeners: ListenerRecord[] = [];

  /**
   * Adds an event listener and tracks it for cleanup
   */
  addListener<T extends Event>(
    target: ListenerTarget,
    event: string,
    handler: (event: T) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addListener(
    target: ListenerTarget,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  addListener(
    target: ListenerTarget,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    target.addEventListener(event, handler, options);
    this.listeners.push({ target, event, handler, options });
  }

  /**
   * Removes all tracked event listeners
   */
  clearListeners(): void {
    this.listeners.forEach(({ target, event, handler, options }) => {
      target.removeEventListener(event, handler, options);
    });
    this.listeners = [];
  }
}
