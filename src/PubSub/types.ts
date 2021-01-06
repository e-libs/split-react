/**
 * The PubSubAction
 * @param payload The payload to be sent of type `T`
 * @template T the type of the payload to be sent
 * @typedef {string} PubSubAction
 */
export type PubSubAction<T> = (payload: T) => void;

/**
 * The PubSubListener
 * @template T The type to be sent when the emit action is Fired
 * @typedef {string} PubSubListener
 */
export type PubSubListener<T> = {
  id: string;
  type: string;
  action: PubSubAction<T>;
};

/**
 * The basic PubSub interface
 * @template T The type to be emitted when events are emitted
 * @interface IPubSub
 */
export interface IPubSub<T> {
  /**
   * Sets/adds an event listener
   * @param type The event type string
   * @param id The unique event ID
   * @param action The action callback to be emitted
   */
  on(type: string, id: string, action: PubSubAction<T>): void;
  /**
   * Emits an event passing a value of type T, based on its type
   * @param type The event type string
   * @param value The value to be passed/emmited
   */
  emit(type: string, value: T): void;
  /**
   * Removes an event from the listeners
   * @param id The unique ID of the event to be removed
   */
  off(id: string): void;
}
