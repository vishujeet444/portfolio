import { useEffect, useRef } from 'react';

export default function Loader({ onComplete }) {
  const progressRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete();
      return undefined;
    }

    let count = 0;
    const interval = setInterval(() => {
      count += 12;
      if (count >= 100) {
        count = 100;
        clearInterval(interval);
        if (counterRef.current) counterRef.current.textContent = '100%';
        if (progressRef.current) progressRef.current.style.width = '100%';
        setTimeout(onComplete, 320);
      } else {
        if (counterRef.current) counterRef.current.textContent = `${count}%`;
        if (progressRef.current) progressRef.current.style.width = `${count}%`;
      }
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className="loader-screen fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#050508' }}
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,255,136,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.018) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative w-28 h-28 mb-10">
        <div
          className="absolute inset-0 rounded-full loader-ring"
          style={{ borderTopColor: '#00FF88', animationDuration: '1.1s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full" style={{ background: '#00FF88', boxShadow: '0 0 12px #00FF88' }} />
        </div>
      </div>

      <div className="type-card-title text-white/25 mb-3" style={{ letterSpacing: '0.6em' }}>
        Vishwajeet
      </div>
      <div className="type-label mb-10 text-[var(--neon)]/50">
        3D Cinematic Artist
      </div>

      <div className="w-52 h-px mb-3 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          ref={progressRef}
          className="h-full rounded-full loader-progress-fill"
          style={{ width: '0%' }}
        />
      </div>

      <span ref={counterRef} className="type-label text-[var(--neon)]/50">0%</span>
      <div className="mt-8 type-label !text-[0.65rem]">Initializing experience</div>
    </div>
  );
}
