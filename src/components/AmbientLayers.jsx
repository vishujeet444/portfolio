import { useEffect, useRef } from 'react';
import { useResponsiveOptional } from '../context/ResponsiveProvider';

export default function AmbientLayers() {
  const dustRef = useRef(null);
  const device = useResponsiveOptional();
  const reduceEffects = device?.reduceEffects ?? false;

  useEffect(() => {
    if (reduceEffects || !dustRef.current) return undefined;

    let raf = 0;
    const tick = () => {
      raf = 0;
      if (dustRef.current) {
        dustRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.05}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduceEffects]);

  if (reduceEffects) return null;

  return (
    <div className="ambient-stack" aria-hidden>
      <div className="ambient-stars" />
      <div ref={dustRef} className="ambient-dust" />
      <div className="ambient-fog" />
      <div className="ambient-light-shafts" />
      <div className="ambient-vignette" />
    </div>
  );
}
