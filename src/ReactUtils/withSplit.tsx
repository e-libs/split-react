import React from 'react';
import { useSplit } from './useSplit';
import type { WithSplitProps } from './types';

/**
 * The withSplit HOC
 * @param Component the component to be wrapped by the HOC, which will receive the new `splitFlagOn` prop
 * @param split The split (flag) to connect/listen to
 * @param defaultValue The default value to be applied if/when Split client is not ready
 * @returns The wrapped component
 */
export const withSplit = <T extends Record<string, unknown>>(
  Component: React.ComponentType<T & WithSplitProps>,
  split: string,
  defaultValue: boolean,
) => (props: T) => {
  const splitFlagOn = useSplit(split, defaultValue);
  const newProps = { ...props, splitFlagOn };
  return <Component {...newProps} />;
};
