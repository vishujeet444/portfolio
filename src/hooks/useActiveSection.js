import { useEffect, useState } from 'react';

export default function useActiveSection(sectionIds, options = {}) {
  const { threshold = 0.25, rootMargin = '-60px 0px -40% 0px' } = options;
  const [active, setActive] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const observers = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold, rootMargin }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds, threshold, rootMargin]);

  return active;
}
