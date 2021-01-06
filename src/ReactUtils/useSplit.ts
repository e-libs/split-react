import { useState, useEffect, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { SplitContext } from './SplitContext';

/**
 * The useSplit hook
 * @param split The split (flag) to connect/listen to
 * @param defaultValue The default value to be applied if/when Split client is not ready
 * @returns `true` if the feature is "on" and `false` in case it's "off"
 */
export const useSplit = (split: string, defaultValue = true): boolean => {
  const { featureFlags } = useContext(SplitContext);
  const value = defaultValue ? 'on' : 'off';
  const [currentSplit, setCurrentSplit] = useState(featureFlags?.getSplit(split, value) ?? value);

  useEffect(() => {
    const id = uuid();

    featureFlags?.on(split, id, (splitValue: string) => {
      setCurrentSplit(splitValue);
    });

    return () => {
      featureFlags?.off(id);
    };
  }, [split]);

  if (process.env.NODE_ENV === 'test') {
    return defaultValue;
  }

  return currentSplit === 'on';
};
