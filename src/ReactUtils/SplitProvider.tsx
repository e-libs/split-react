import React from 'react';
import { FeatureFlags } from '../FeatureFlags';
import { SplitContext } from './SplitContext';

/**
 * The Split Provider to wrap a React application
 * @param children The children components
 * @param config The Split config to be used by Split SDK. It must contain at least the authorizationKey and the user key
 */
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
