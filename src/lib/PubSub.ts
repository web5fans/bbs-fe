type Listener = {
  (...args: any): void;
  __once?: boolean;
}

type EventMap = Record<string, Set<Listener>>;

export default class PubSub {
  private listeners: EventMap = {};

  subscribe(event: string, listener: Listener, once = false) {
    this.listeners[event] ??= new Set<Listener>();
    listener.__once = once;
    this.listeners[event].add(listener);
  }

  unsubscribe(event: string, listener?: Listener) {
    if (listener) {
      this.listeners[event]?.delete(listener)
    } else {
      this.listeners[event] = new Set<Listener>();
    }
  }

  publish(event: string, ...args: unknown[]) {
    const listeners = new Set(this.listeners[event]);
    listeners.forEach(listener => {
      listener(...args);
      if (listener.__once) this.listeners[event].delete(listener);
    })
  }
}