import React from 'react';
import type { FeatureFlagsContext } from './types';

/**
 * The SplitContext where the FeatureFlags singleton will live
 */
export const SplitContext = React.createContext<FeatureFlagsContext>({
  featureFlags: undefined,
});
