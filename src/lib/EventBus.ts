import PubSub from "./PubSub";

type EventMap = {
  "post-like-list-refresh": [];
  "post-comment-reply-list-refresh": [];
};


class EventBus extends PubSub {

  subscribe<T extends keyof EventMap = keyof EventMap>(
    event: T,
    listener: (...args: EventMap[T]) => void,
    once: boolean = false
  ) {
    super.subscribe(event, listener, once);
  }

  publish<T extends keyof EventMap = keyof EventMap>(
    event: T,
    ...args: EventMap[T]
  ) {
    super.publish(event, ...args);
  }

  unsubscribe<T extends keyof EventMap = keyof EventMap>(
    event: T,
    listener?: (...args: EventMap[T]) => void
  ) {
    super.unsubscribe(event, listener);
  }

}

export const eventBus = new EventBus();
