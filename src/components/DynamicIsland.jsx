import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
  { id: 'hero',       label: 'Home',       icon: '⌂' },
  { id: 'works',      label: 'Works',      icon: '◈' },
  { id: 'about',      label: 'About',      icon: '◉' },
  { id: 'skills',     label: 'Skills',     icon: '◎' },
  { id: 'experience', label: 'Journey',    icon: '◆' },
  { id: 'contact',    label: 'Contact',    icon: '◇' },
];

export default function DynamicIsland() {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isAvailable, setIsAvailable] = useState(true);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const current = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setExpanded(false);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center">
      {/* The Island Pill */}
      <motion.div
        layout
        onClick={() => setExpanded(prev => !prev)}
        initial={false}
        animate={{
          width: expanded ? 320 : 200,
          height: expanded ? 'auto' : 38,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="overflow-hidden cursor-pointer select-none"
        style={{
          background: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 99,
          boxShadow: expanded
            ? '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,136,0.12), 0 0 30px rgba(0,255,136,0.08)'
            : '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        {/* Collapsed state */}
        <motion.div
          layout
          className="flex items-center justify-between gap-3 px-4"
          style={{ height: 38 }}
        >
          {/* Left — status dot */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full"
              style={{ background: '#00FF88', boxShadow: '0 0 6px rgba(0,255,136,0.8)' }}
            />
            <span className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: 'rgba(0,255,136,0.7)' }}>
              Available
            </span>
          </div>

          {/* Center — divider */}
          <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.12)' }} />

          {/* Right — current section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-1.5 flex-shrink-0"
            >
              <span className="text-[0.65rem]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {current.icon}
              </span>
              <span className="font-mono text-[0.6rem] tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {current.label}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Expand chevron */}
          <motion.svg
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.div>

        {/* Expanded — nav links */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-3 pb-3"
            >
              <div
                className="h-px mb-3"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.2), transparent)' }}
              />
              <div className="grid grid-cols-3 gap-1.5">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={(e) => { e.stopPropagation(); scrollToSection(s.id); }}
                    className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200"
                    style={{
                      background: activeSection === s.id ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${activeSection === s.id ? 'rgba(0,255,136,0.25)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                    onMouseEnter={(e) => {
                      if (activeSection !== s.id) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== s.id) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      }
                    }}
                  >
                    <span className="text-base">{s.icon}</span>
                    <span
                      className="font-mono text-[0.55rem] tracking-wider"
                      style={{ color: activeSection === s.id ? '#00FF88' : 'rgba(255,255,255,0.4)' }}
                    >
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bottom tag */}
              <div className="flex items-center justify-center gap-1.5 mt-2.5 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FF88', boxShadow: '0 0 5px rgba(0,255,136,0.7)' }} />
                <span className="font-mono text-[0.55rem] tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  VISHWAJEET KUMAR · 3D ARTIST
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
