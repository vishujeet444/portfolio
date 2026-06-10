import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ onComplete }) {
  const progressRef = useRef(null);
  const counterRef = useRef(null);
  const loaderRef = useRef(null);
  const [phase, setPhase] = useState('loading'); // loading | revealing

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete();
      return undefined;
    }

    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 8) + 4;
      if (count >= 100) {
        count = 100;
        clearInterval(interval);
        if (counterRef.current) counterRef.current.textContent = '100%';
        if (progressRef.current) progressRef.current.style.width = '100%';
        setTimeout(() => setPhase('revealing'), 200);
        setTimeout(() => onComplete(), 700);
      }
      if (counterRef.current) counterRef.current.textContent = count + '%';
      if (progressRef.current) progressRef.current.style.width = count + '%';
    }, 35);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase === 'loading' && (
        <motion.div
          key="loader"
          ref={loaderRef}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#050508' }}
        >
          {/* HELIOS scanline effect */}
          <div
            className="absolute inset-0 pointer-events-none helios-scanline"
            style={{ animation: 'scanMove 8s linear infinite' }}
          />

          {/* Neon grid faint overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,255,136,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.018) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Corner brackets — neon green */}
          {[
            'top-8 left-8 border-t border-l',
            'top-8 right-8 border-t border-r',
            'bottom-8 left-8 border-b border-l',
            'bottom-8 right-8 border-b border-r',
          ].map((cls, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`absolute w-10 h-10 ${cls}`}
              style={{ borderColor: 'rgba(0,255,136,0.3)' }}
            />
          ))}

          {/* HELIOS cosmic ring */}
          <div className="relative w-28 h-28 mb-10">
            {/* Outer breathing pulse */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(0,255,136,0.08)' }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Second pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(0,229,255,0.05)' }}
              animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
            {/* Main spinning ring */}
            <div
              className="absolute inset-0 rounded-full loader-ring"
              style={{ borderTopColor: '#00FF88', animationDuration: '1.1s' }}
            />
            {/* Counter ring — cyan, reverse */}
            <div
              className="absolute inset-3 rounded-full"
              style={{
                border: '1px solid rgba(0,229,255,0.2)',
                animation: 'spin 3.5s linear infinite reverse',
              }}
            />
            {/* Core neon glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ background: '#00FF88' }}
                animate={{ boxShadow: ['0 0 6px #00FF88', '0 0 24px #00FF88, 0 0 40px rgba(0,255,136,0.3)', '0 0 6px #00FF88'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            {/* Orbit dot — cyan */}
            <div className="absolute inset-0 animate-orbit-loader">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: '#00E5FF', boxShadow: '0 0 8px #00E5FF, 0 0 16px rgba(0,229,255,0.4)' }}
              />
            </div>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.6em' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="type-card-title text-white/25 mb-3"
          >
            Vishwajeet
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="type-label mb-10 text-[var(--neon)]/50"
          >
            3D Cinematic Artist
          </motion.div>

          {/* Progress bar */}
          <div
            className="w-52 h-px mb-3 overflow-hidden rounded-full"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div
              ref={progressRef}
              className="h-full rounded-full"
              style={{
                width: '0%',
                background: 'linear-gradient(90deg, #00FF88, #00E5FF)',
                boxShadow: '0 0 14px rgba(0,255,136,0.8)',
                transition: 'width 0.12s linear',
              }}
            />
          </div>

          <span
            ref={counterRef}
            className="type-label text-[var(--neon)]/50"
          >
            0%
          </span>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 type-label !text-[0.65rem]"
          >
            Initializing experience
          </motion.div>

          {/* Data stream lines on sides */}
          {['-left-0', 'right-0'].map((side, idx) => (
            <div
              key={idx}
              className={`absolute top-0 ${side} w-px h-full overflow-hidden opacity-20`}
            >
              <motion.div
                className="w-full"
                style={{
                  height: '30%',
                  background: `linear-gradient(to bottom, transparent, ${idx === 0 ? '#00FF88' : '#00E5FF'}, transparent)`,
                }}
                animate={{ y: ['-30%', '130%'] }}
                transition={{ duration: 3 + idx, repeat: Infinity, ease: 'linear', delay: idx * 0.5 }}
              />
            </div>
          ))}
        </motion.div>
      )}

      {phase === 'revealing' && (
        <motion.div
          key="reveal"
          className="fixed inset-0 z-[99999] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeInOut' }}
        >
          {/* Curtain wipe — top half */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2"
            style={{ background: '#050508', transformOrigin: 'top' }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Curtain wipe — bottom half */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1/2"
            style={{ background: '#050508', transformOrigin: 'bottom' }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
