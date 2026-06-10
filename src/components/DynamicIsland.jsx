import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS, scrollToSection } from '../lib/constants';
import useActiveSection from '../hooks/useActiveSection';

const SECTION_ICONS = {
  hero: '⌂',
  works: '◈',
  about: '◉',
  skills: '◎',
  experience: '◆',
  contact: '◇',
};

export default function DynamicIsland() {
  const [expanded, setExpanded] = useState(false);
  const activeSection = useActiveSection(NAV_LINKS.map((s) => s.id), {
    threshold: 0.3,
    rootMargin: '-80px 0px -40% 0px',
  });

  const current = NAV_LINKS.find((s) => s.id === activeSection) || NAV_LINKS[0];

  const goTo = (id) => {
    scrollToSection(`#${id}`);
    setExpanded(false);
  };

  return (
    <div className="fixed top-[4.25rem] left-1/2 -translate-x-1/2 z-[55] flex flex-col items-center md:hidden">
      <motion.div
        layout
        onClick={() => setExpanded((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded((prev) => !prev);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label="Quick navigation"
        initial={false}
        animate={{
          width: expanded ? 300 : 196,
          height: expanded ? 'auto' : 36,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="overflow-hidden cursor-pointer select-none apple-pill"
        style={{
          boxShadow: expanded
            ? '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,136,0.12)'
            : '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <motion.div layout className="flex items-center justify-between gap-3 px-3.5" style={{ height: 36 }}>
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.span
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full bg-neon"
              style={{ boxShadow: '0 0 6px rgba(0,255,136,0.8)' }}
              aria-hidden
            />
            <span className="type-label !text-[0.65rem] text-[var(--neon)]/70">
              Available
            </span>
          </div>

          <div className="w-px h-3.5 bg-white/12" aria-hidden />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-1.5 flex-shrink-0"
            >
              <span className="text-[0.65rem] text-white/40" aria-hidden>
                {SECTION_ICONS[activeSection]}
              </span>
              <span className="type-label !text-[0.65rem] !normal-case text-white/55">
                {current.label}
              </span>
            </motion.div>
          </AnimatePresence>

          <motion.svg
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="text-white/30 flex-shrink-0"
            aria-hidden
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-3 pb-3"
            >
              <div className="apple-divider mb-3" />
              <div className="grid grid-cols-3 gap-1.5">
                {NAV_LINKS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(s.id);
                    }}
                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200 ${
                      activeSection === s.id
                        ? 'bg-neon/10 border border-neon/25'
                        : 'bg-white/5 border border-white/6 hover:bg-white/8'
                    }`}
                  >
                    <span className="text-base" aria-hidden>
                      {SECTION_ICONS[s.id]}
                    </span>
                    <span
                      className={`type-label !text-[0.6rem] ${
                        activeSection === s.id ? 'text-neon' : 'text-white/40'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
