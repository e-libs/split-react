import React from 'react';
import type { FeatureFlagsContext } from './types';

export const SplitContext = React.createContext<FeatureFlagsContext>({
  featureFlags: undefined,
});
