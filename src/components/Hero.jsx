import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SITE, SOCIAL_LINKS, scrollToSection } from '../lib/constants';
import MagneticButton from './MagneticButton';

const ROLES = [
  '3D Cinematic Artist',
  'Architectural Visualizer',
  'VFX & Rendering Specialist',
  'Immersive World Builder',
];

function TypingRoles() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[index];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 55);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % ROLES.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index]);

  return (
    <span className="type-section-accent text-gradient-luxury">
      {displayed}
      <span className="text-[var(--neon)] opacity-70">|</span>
    </span>
  );
}

export default function Hero() {
  const scrollDown = () => scrollToSection('#works');

  return (
    <section
      id="hero"
      className="hero-section relative flex flex-col items-center justify-center text-center z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(45,160,110,0.07) 0%, transparent 62%)',
        }}
      />
      <div
        className="hero-glow-soft absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(110,196,212,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="hero-stack relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex items-center justify-center gap-4"
        >
          <span className="block w-12 h-px bg-gradient-to-r from-transparent to-white/20" />
          <span className="type-label text-[var(--neon)]/60">Portfolio {SITE.year}</span>
          <span className="block w-12 h-px bg-gradient-to-l from-transparent to-white/20" />
        </motion.div>

        <h1 className="font-display w-full">
          {['Vishwajeet', 'Kumar'].map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 40, letterSpacing: '0.02em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: 'var(--tracking-hero)' }}
              transition={{ duration: 1.1, delay: 0.5 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="hero-title-line block text-gradient-luxury"
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="type-hero-sub min-h-[2rem] flex items-center justify-center"
        >
          <TypingRoles />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.45 }}
          className="type-body mx-auto text-center"
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.65 }}
          className="hero-actions"
        >
          <MagneticButton
            variant="primary"
            href="#works"
            onClick={(e) => { e.preventDefault(); scrollToSection('#works'); }}
          >
            Explore Works
          </MagneticButton>
          <MagneticButton
            variant="glass"
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
          >
            Get In Touch
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.85 }}
          className="hero-stats pt-4"
        >
          {[
            { num: '5+', label: 'Years' },
            { num: '100+', label: 'Projects' },
            { num: '50+', label: 'Clients' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="type-stat-inline text-gradient-luxury">{num}</div>
              <div className="type-label mt-2">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer"
        onClick={scrollDown}
        aria-label="Scroll to works"
      >
        <span className="type-label">Scroll</span>
        <div className="relative w-px h-12 overflow-hidden bg-gradient-to-b from-[var(--neon)]/40 to-transparent">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[var(--neon)]"
            animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.button>

      <div className="hero-side-rail absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-2 opacity-[0.12]">
        <span
          className="type-label"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          25.2°N · 82.9°E
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="hero-side-rail absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4"
      >
        {SOCIAL_LINKS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            title={s.label}
            className="w-9 h-9 rounded-full flex items-center justify-center type-label social-pill"
            data-cursor
          >
            {s.short}
          </a>
        ))}
      </motion.div>
    </section>
  );
}
