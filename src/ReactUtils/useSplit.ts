import { useState, useEffect, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { SplitContext } from './SplitContext';

export const useSplit = (split: string, defaultValue = true): boolean => {
  const { featureFlags } = useContext(SplitContext);
  const [currentSplit, setCurrentSplit] = useState(
    featureFlags?.getSplit(split, defaultValue ? 'on' : 'off'),
  );

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
