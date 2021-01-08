import { PubSub } from '../';
import { v4 as uuid } from 'uuid';

describe('The PubSub', () => {
  let pubSub: PubSub<string>;
  const action = () => {};

  beforeEach(() => {
    pubSub = new PubSub<string>();
  })

  it('sets events correctly', () => {
    expect(pubSub.listeners.length).toBe(0);

    const firstEvent = { type: 'event1', id: 'id1', action };
    const secondEvent = { type: 'event2', id: 'id2', action };

    pubSub.on(firstEvent.type, firstEvent.id, firstEvent.action);
    pubSub.on(secondEvent.type, secondEvent.id, secondEvent.action);

    expect(pubSub.listeners.length).toBe(2);
  });

  it('sets events according to types', () => {
    expect(pubSub.listeners.length).toBe(0);

    const someEvent = { type: 'event1', id: 'id1', action };
    const anotherEvent = { type: 'event2', id: 'id2', action };

    pubSub.on(someEvent.type, someEvent.id, someEvent.action);
    pubSub.on(someEvent.type, uuid(), someEvent.action);
    pubSub.on(anotherEvent.type, anotherEvent.id, anotherEvent.action);
    
    expect(pubSub.listeners.length).toBe(3);

    expect(pubSub.listeners.filter(({ type }) => type === someEvent.type).length).toBe(2);
    expect(pubSub.listeners.filter(({ type }) => type === anotherEvent.type).length).toBe(1);
  });

  it('emits events correctly', () => {
    const values: string[] = [];
    const otherValues: string[] = [];
    const TYPE = 'type';
    
    const firstEvent = {
      type: TYPE,
      id: 'id1',
      action: (value: string) => values.push(value),
    };

    const secondEvent = {
      type: TYPE,
      id: 'id2',
      action: (value: string) => otherValues.push(value),
    };

    pubSub.on(firstEvent.type, firstEvent.id, firstEvent.action);
    pubSub.on(secondEvent.type, secondEvent.id, secondEvent.action);
    pubSub.emit(TYPE, 'message');

    expect(values).toContain('message');
    expect(otherValues).toContain('message');
  });

  it('remove events correctly', () => {
    expect(pubSub.listeners.length).toBe(0);

    const firstEvent = { type: 'event1', id: 'id1', action };
    const secondEvent = { type: 'event2', id: 'id2', action };

    pubSub.on(firstEvent.type, firstEvent.id, firstEvent.action);
    pubSub.on(secondEvent.type, secondEvent.id, secondEvent.action);

    expect(pubSub.listeners.length).toBe(2);

    pubSub.off(secondEvent.id);

    expect(pubSub.listeners.length).toBe(1);
  });

  it('does not emit removed events actions', () => {
    const values: string[] = [];
    const otherValues: string[] = [];
    const TYPE = 'type';
    
    const firstEvent = {
      type: TYPE,
      id: 'id1',
      action: (value: string) => values.push(value),
    };

    const secondEvent = {
      type: TYPE,
      id: 'id2',
      action: (value: string) => otherValues.push(value),
    };

    pubSub.on(firstEvent.type, firstEvent.id, firstEvent.action);
    pubSub.on(secondEvent.type, secondEvent.id, secondEvent.action);
    pubSub.emit(TYPE, 'message');

    expect(values).toContain('message');
    expect(otherValues).toContain('message');

    pubSub.off(secondEvent.id);
    pubSub.emit(TYPE, 'another_message');

    expect(values).toContain('another_message');
    expect(otherValues).not.toContain('another_message');
  })
});
