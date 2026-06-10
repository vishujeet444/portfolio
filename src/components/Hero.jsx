import { useEffect, useState } from 'react';
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
      className="hero-section hero-enter relative flex flex-col items-center justify-center text-center z-10 overflow-hidden"
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
        <div className="hero-enter-item flex items-center justify-center gap-4">
          <span className="block w-12 h-px bg-gradient-to-r from-transparent to-white/20" />
          <span className="type-label text-[var(--neon)]/60">Portfolio {SITE.year}</span>
          <span className="block w-12 h-px bg-gradient-to-l from-transparent to-white/20" />
        </div>

        <h1 className="font-display w-full">
          {['Vishwajeet', 'Kumar'].map((line) => (
            <span
              key={line}
              className="hero-enter-item hero-title-line block text-gradient-luxury"
              style={{ letterSpacing: 'var(--tracking-hero)' }}
            >
              {line}
            </span>
          ))}
        </h1>

        <div className="hero-enter-item type-hero-sub min-h-[2rem] flex items-center justify-center">
          <TypingRoles />
        </div>

        <p className="hero-enter-item type-body mx-auto text-center">
          {SITE.tagline}
        </p>

        <div className="hero-enter-item hero-actions">
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
        </div>

        <div className="hero-enter-item hero-stats pt-4">
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
        </div>
      </div>

      <button
        type="button"
        className="hero-enter-item absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer"
        onClick={scrollDown}
        aria-label="Scroll to works"
      >
        <span className="type-label">Scroll</span>
        <div className="scroll-cue" aria-hidden />
      </button>

      <div className="hero-side-rail absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-2 opacity-[0.12]">
        <span
          className="type-label"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          25.2°N · 82.9°E
        </span>
      </div>

      <div className="hero-enter-item hero-side-rail absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4">
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
      </div>
    </section>
  );
}
