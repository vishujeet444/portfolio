import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

export default function useCountUp(target, { duration = 2, suffix = '' } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;

    const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    const hasPlus = String(target).includes('+');
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - (1 - p) ** 3;
      setValue(Math.round(numeric * eased));
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return undefined;
  }, [inView, target, duration]);

  const display = `${value}${suffix || (String(target).includes('+') ? '+' : '')}`;
  return { ref, display, inView };
}
