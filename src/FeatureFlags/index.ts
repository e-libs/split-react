import { PubSub } from '../PubSub';
import type { IPubSub } from '../PubSub/types';

/**
 * The main FeatureFlags class. It's meant to be used as a singleton, as it will control
 * the single instance of Split's client, and orchestrate the flags values to emit the events
 * of the changed ones only, avoid unnecessary updates
 */
export class FeatureFlags {
  protected client: SplitIO.IClient | undefined;

  private userKey: string | undefined;

  protected events: IPubSub<string>;

  protected splits: Record<string, string>;

  protected splitConfig: SplitIO.IBrowserSettings;

  /**
   * Creates a new FeatureFlags instance
   * @param config The SplitIO config - see https://github.com/splitio/javascript-client/blob/development/types/splitio.d.ts#L807
   */
  constructor(config: SplitIO.IBrowserSettings) {
    this.splitConfig = config;
    this.events = new PubSub<string>();
    this.splits = {};
  }

  /**
   * Adds an event listener to the FeatureFlags instance
   * @param split the event/split name
   * @param eventId the unique event/split ID
   * @param callback The action callback to be emitted
   */
  on(split: string, eventId: string, callback: (value: string) => void): void {
    this.events.on(split, eventId, callback);
  }

  /**
   * Removes an event from the FeatureFlags collection
   * @param eventId The unique ID of the event to be removed
   */
  off(eventId: string): void {
    this.events.off(eventId);
  }

  private async getSplitFactory(userKey: string) {
    const { SplitFactory } = await import('@splitsoftware/splitio');

    const splitFactory = SplitFactory({
      ...this.splitConfig,
      core: { ...this.splitConfig.core, key: userKey },
    });

    return {
      client: splitFactory.client(),
      manager: splitFactory.manager(),
    };
  }

  /**
   * Initializes the FeatureFlags instance with a user key and client instance
   * @param userKey the user key to be added as its main identifier on Split
   */
  async setup(userKey: string): Promise<void> {
    if (process.env.NODE_ENV === 'test') return;

    if (!this.userKey || this.userKey !== userKey) {
      this.client?.destroy();
      this.userKey = userKey;
      this.client = await this.createClient(userKey);
    }
  }

  private update(splitClient: SplitIO.IClient, manager: SplitIO.IManager, boot = false) {
    manager.names().forEach((split) => {
      const value = splitClient.getTreatment(split);

      if (boot || this.splits[split] !== value) {
        // console.log('DIFF ON', split);
        this.splits[split] = value;
        this.events.emit(split, value);
      }
    });
  }

  private onClientReady(splitClient: SplitIO.IClient, manager: SplitIO.IManager) {
    if (Object.keys(this.splits).length === 0) {
      const splits: Record<string, string> = {};

      manager.names().forEach((split) => {
        splits[split] = splitClient.getTreatment(split);
      });
      this.splits = splits;
      this.update(splitClient, manager, true);
    } else {
      this.update(splitClient, manager);
    }
  }

  private async createClient(userKey: string): Promise<SplitIO.IClient> {
    const { manager, client } = await this.getSplitFactory(userKey);

    manager.once(client.Event.SDK_READY, () => {
      this.onClientReady(client, manager);
    });

    client.on(client.Event.SDK_UPDATE, () => {
      this.update(client, manager);
    });

    return client;
  }

  /**
   * Gets a split (flag) value
   * @param split The split (flag) name to be evaluated
   * @param defaultValue The default value to be returned, in case it's failed or not ready
   * @returns The split (flag) value or the default one
   */
  getSplit(split: string, defaultValue: string): string {
    return this.client ? this.client.getTreatment(split) : defaultValue;
  }
}
