import { PubSub } from '../PubSub';
import type { IPubSub } from '../PubSub/types';

export class FeatureFlags {
  protected client: SplitIO.IClient | undefined;

  private userKey: string | undefined;

  protected events: IPubSub<string>;

  protected splits: Record<string, string>;

  protected splitConfig: SplitIO.IBrowserSettings;

  constructor(config: SplitIO.IBrowserSettings) {
    this.splitConfig = config;
    this.events = new PubSub<string>();
    this.splits = {};
  }

  on(split: string, eventId: string, callback: (value: string) => void): void {
    this.events.on(split, eventId, callback);
  }

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

  getSplit(split: string, defaultValue: string): string {
    return this.client ? this.client.getTreatment(split) : defaultValue;
  }
}
