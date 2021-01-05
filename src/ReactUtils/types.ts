import type { FeatureFlags } from '../FeatureFlags';

export type FeatureFlagsContext = {
  featureFlags?: FeatureFlags;
};

export type SplitConfig = SplitIO.IBrowserSettings;
