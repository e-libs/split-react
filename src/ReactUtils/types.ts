import type { FeatureFlags } from '../FeatureFlags';

/**
 * The FeatureFlagsContext type containing the featureFlags instance
 * @typedef {string} FeatureFlagsContext
 */
export type FeatureFlagsContext = {
  featureFlags?: FeatureFlags;
};

/**
 * A wrapper to export Split's IBrowserSettings
 */
export type SplitConfig = SplitIO.IBrowserSettings;
