import { useEffect, useRef, useState } from 'react';

/**
 * RAF-throttled scroll progress — updates the progress bar via ref (no re-render)
 * and only re-renders when crossing the back-to-top threshold.
 */
export default function useScrollProgress() {
  const progressRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const rafRef = useRef(0);
  const lastPctRef = useRef(0);
  const backToTopRef = useRef(false);

  useEffect(() => {
    const tick = () => {
      rafRef.current = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;

      if (progressRef.current && Math.abs(pct - lastPctRef.current) > 0.25) {
        lastPctRef.current = pct;
        progressRef.current.style.width = `${pct}%`;
        progressRef.current.setAttribute('aria-valuenow', String(Math.round(pct)));
      }

      const show = pct > 15;
      if (show !== backToTopRef.current) {
        backToTopRef.current = show;
        setShowBackToTop(show);
      }
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { progressRef, showBackToTop };
}
