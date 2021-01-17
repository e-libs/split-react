import React from 'react';
import { useSplit } from './useSplit';
import type { WithSplitProps } from './types';

export const withSplit = <T extends Record<string, unknown>>(
  Component: React.ComponentType<T & WithSplitProps>,
  split: string,
  defaultValue: boolean,
) => (props: T) => {
  const splitFlagOn = useSplit(split, defaultValue);
  const newProps = { ...props, splitFlagOn };
  return <Component {...newProps} />;
};
