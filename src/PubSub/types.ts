export type PubSubAction<T> = (payload: T) => void;

export type PubSubListener<T> = {
  id: string;
  type: string;
  action: PubSubAction<T>;
};

export interface IPubSub<T> {
  on(id: string, type: string, action: PubSubAction<T>): void;
  emit(type: string, value: T): void;
  off(id: string): void;
}
