import { useEffect, useMemo, useState } from 'react';

export const useCountUp = (value: number, duration = 800, fromValue = 0) => {
  const [current, setCurrent] = useState(fromValue);

  const startValue = useMemo(() => fromValue, [fromValue]);

  useEffect(() => {
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const next = startValue + (value - startValue) * progress;
      setCurrent(next);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration, startValue]);

  return current;
};
