import React from 'react';
import { FeatureFlags } from '../FeatureFlags';
import { SplitContext } from './SplitContext';

export const SplitProvider = ({
  children,
  config,
}: {
  children: React.ReactElement;
  config: SplitIO.IBrowserSettings;
}): React.ReactElement => {
  const featureFlags = new FeatureFlags(config);
  featureFlags.setup(config.core.key as string);

  return <SplitContext.Provider value={{ featureFlags }}>{children}</SplitContext.Provider>;
};
