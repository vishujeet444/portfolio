import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

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
    <span className="text-gradient-gold">
      {displayed}
      <span
        className="animate-pulse"
        style={{ color: '#00FF88', opacity: 0.8 }}
      >|</span>
    </span>
  );
}


export default function Hero() {
  const scrollDown = () => {
    document.querySelector('#works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 z-10 overflow-hidden"
    >
      {/* HELIOS ambient glow — neon green core */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0,255,136,0.065) 0%, transparent 65%)',
        }}
      />
      {/* Cyan accent top-left */}
      <div
        className="absolute top-0 -left-1/4 w-2/3 h-2/3 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,229,255,0.04) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
      {/* Neon grid overlay (subtle) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,255,136,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.025) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)',
        }}
      />

      {/* Horizontal decorative lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-1/2 left-0 right-0 h-px pointer-events-none opacity-[0.035]"
        style={{ background: 'linear-gradient(90deg, transparent, #00FF88, transparent)' }}
      />

      {/* Corner decorations — neon green */}
      {['top-20 left-8', 'top-20 right-8'].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 + i * 0.2 }}
          className={`absolute ${pos} hidden lg:block`}
        >
          <div
            className="w-14 h-14"
            style={{
              borderTop: '1px solid rgba(0,255,136,0.2)',
              borderLeft: i === 0 ? '1px solid rgba(0,255,136,0.2)' : 'none',
              borderRight: i === 1 ? '1px solid rgba(0,255,136,0.2)' : 'none',
            }}
          />
        </motion.div>
      ))}

      {/* HELIOS badge — eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        className="flex items-center gap-4 mb-10"
      >
        <span
          className="block w-16 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(0,255,136,0.5))' }}
        />
        <span
          className="font-mono text-[0.65rem] tracking-[0.45em] uppercase"
          style={{ color: 'rgba(0,255,136,0.55)' }}
        >
          Portfolio 2024
        </span>
        <span
          className="block w-16 h-px"
          style={{ background: 'linear-gradient(to left, transparent, rgba(0,255,136,0.5))' }}
        />
      </motion.div>

      {/* Main Title — HELIOS: VISHWAJEET KUMAR */}
      <h1 className="font-display font-light leading-[0.9] mb-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(4rem,12vw,9rem)] tracking-[0.07em] uppercase text-gradient-gold text-glow-gold"
        >
          VISHWAJEET
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(4rem,12vw,9rem)] tracking-[0.07em] uppercase text-gradient-gold text-glow-gold"
        >
          KUMAR
        </motion.div>
      </h1>

      {/* Animated roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.2 }}
        className="font-display text-[clamp(1rem,3vw,1.6rem)] font-light mb-4 h-10 flex items-center"
      >
        <TypingRoles />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.6, ease: [0.22, 1, 0.36, 1] }}
        className="font-body text-sm max-w-sm leading-relaxed mb-14 tracking-wide"
        style={{ color: 'rgba(255,255,255,0.22)' }}
      >
        Photorealistic rendering · Architectural visualization · Cinematic storytelling
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3.0, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap gap-5 justify-center mb-20"
      >
        <a
          href="#works"
          onClick={(e) => { e.preventDefault(); document.querySelector('#works')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="btn-cinematic btn-cinematic-primary magnetic"
          data-cursor
        >
          Explore Works
        </a>
        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="btn-cinematic magnetic"
          data-cursor
        >
          Get In Touch
        </a>
      </motion.div>

      {/* Floating stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3.4 }}
        className="flex gap-12 md:gap-20"
      >
        {[
          { num: '5+', label: 'Years' },
          { num: '100+', label: 'Projects' },
          { num: '50+', label: 'Clients' },
        ].map(({ num, label }) => (
          <div key={label} className="text-center">
            <div className="font-display text-2xl text-gradient-gold font-light">{num}</div>
            <div
              className="font-mono text-[0.6rem] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.22)' }}
            >
              {label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator — neon green */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group"
        onClick={scrollDown}
        aria-label="Scroll to works"
      >
        <span
          className="font-mono text-[0.55rem] tracking-[0.5em] uppercase transition-colors duration-300"
          style={{ color: 'rgba(255,255,255,0.18)' }}
        >
          Scroll
        </span>
        <div
          className="relative w-px h-14 overflow-hidden"
          style={{ background: 'linear-gradient(to bottom, rgba(0,255,136,0.4), transparent)' }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full"
            style={{ background: '#00FF88' }}
            animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.button>

      {/* Side coordinates */}
      <div
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-2"
        style={{ opacity: 0.14 }}
      >
        <span
          className="font-mono text-[0.55rem] tracking-widest text-white"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '0.15em' }}
        >
          25.2°N · 82.9°E
        </span>
        <div
          className="w-px h-16"
          style={{ background: 'linear-gradient(to bottom, rgba(0,255,136,0.3), transparent)' }}
        />
      </div>

      {/* Right side — social quick links */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 3.8 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4"
      >
        {[
          { label: 'AS', href: 'https://www.artstation.com/vishwajeetkumar684', title: 'ArtStation' },
          { label: 'LI', href: 'https://www.linkedin.com/in/vishwajeet-kumar-811949217', title: 'LinkedIn' },
          { label: 'IG', href: 'https://www.instagram.com/vishu_u___13', title: 'Instagram' },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            title={s.title}
            className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[0.6rem] transition-all duration-300"
            style={{
              color: 'rgba(255,255,255,0.22)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#00FF88';
              e.currentTarget.style.borderColor = 'rgba(0,255,136,0.4)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(0,255,136,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.22)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            data-cursor
          >
            {s.label}
          </a>
        ))}
        <div
          className="w-px h-16"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,255,136,0.15), transparent)' }}
        />
      </motion.div>
    </section>
  );
}
