import React from 'react';
import { useSplit } from './useSplit';
import type { WithSplitProps } from './types';

export const withSplit = <T extends Record<string, unknown>>(
  Component: React.ComponentType<T & WithSplitProps>,
  split: string,
  defaultValue: boolean,
) => (props: T) => {
  console.log('FLAG BEING EVALUATED', split);

  const on = useSplit(split, defaultValue);
  return <Component splitFlagOn={on} {...props} />;
};
