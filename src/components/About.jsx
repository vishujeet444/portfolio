import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const TOOLS = [
  'Maya', 'Blender', 'ZBrush', '3ds Max', 'V-Ray', 'Arnold',
  'Unreal Engine 5', 'Houdini', 'Substance Painter', 'After Effects',
  'Photoshop', 'Premiere Pro', 'Cinema 4D', 'Octane',
];

// Apple spring animation preset
const springIn = (delay = 0) => ({
  initial: { opacity: 0, y: 30, scale: 0.96 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: '-60px' },
  transition: { type: 'spring', stiffness: 280, damping: 28, delay },
});

// Apple Liquid Glass card base style
const glassCard = {
  background: 'rgba(255,255,255,0.035)',
  backdropFilter: 'blur(32px)',
  WebkitBackdropFilter: 'blur(32px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 24,
};

function Marquee({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div className="marquee-track flex gap-3">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex-shrink-0 px-3 py-1 font-mono text-[0.65rem] cursor-default"
            style={{
              color: 'rgba(0,255,136,0.55)',
              border: '1px solid rgba(0,255,136,0.1)',
              background: 'rgba(0,255,136,0.03)',
              borderRadius: 99,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// Individual bento tile
function BentoTile({ children, className = '', style = {}, delay = 0, hover = true }) {
  return (
    <motion.div
      {...springIn(delay)}
      className={`relative overflow-hidden ${className}`}
      style={{ ...glassCard, ...style }}
      whileHover={hover ? { scale: 1.015, boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,255,136,0.12)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Apple inner glow */}
      <div
        className="absolute inset-0 rounded-[24px] pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)' }}
      />
      {children}
    </motion.div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} className="relative z-10 py-32 px-4">
      <div className="section-container">

        {/* Section label */}
        <motion.div {...springIn(0)} className="flex items-center gap-4 mb-12">
          <span className="section-number">02</span>
          <span className="block w-8 h-px" style={{ background: 'rgba(0,255,136,0.3)' }} />
          <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>
            About Me
          </span>
        </motion.div>

        {/* Section heading */}
        <motion.h2 {...springIn(0.08)} className="font-display text-[clamp(2.8rem,6vw,5rem)] font-light leading-tight mb-14" style={{ color: 'rgba(255,255,255,0.92)' }}>
          Crafting worlds<br />
          <span className="text-gradient-gold italic">through light</span>
        </motion.h2>

        {/* ── APPLE BENTO GRID ────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-auto gap-4">

          {/* [A] Profile photo — tall left card, spans 2 rows */}
          <BentoTile
            className="col-span-2 row-span-2 md:col-span-1 md:row-span-2"
            delay={0.05}
            style={{ ...glassCard, minHeight: 360 }}
          >
            <div className="relative h-full min-h-[360px]">
              <img
                src="./profile.jpeg"
                alt="Vishwajeet Kumar"
                className="w-full h-full object-cover object-top"
                style={{ borderRadius: 24 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(5,5,8,0.8) 0%, transparent 45%)',
                  borderRadius: 24,
                }}
              />
              {/* Name tag */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-display text-xl font-light" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Vishwajeet Kumar
                </div>
                <div className="font-mono text-[0.6rem] tracking-widest uppercase mt-1" style={{ color: 'rgba(0,255,136,0.6)' }}>
                  3D Cinematic Artist
                </div>
              </div>
            </div>
          </BentoTile>

          {/* [B] Bio tile — spans 2 cols */}
          <BentoTile className="col-span-2 md:col-span-2" delay={0.1} style={{ ...glassCard, padding: '1.75rem' }}>
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ background: '#00FF88', boxShadow: '0 0 8px rgba(0,255,136,0.7)' }} />
                  <span className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: 'rgba(0,255,136,0.6)' }}>
                    Open to work
                  </span>
                </div>
                <p className="font-body text-sm leading-[1.9]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Pursuing a Bachelor's in Animation at the Asian Academy of Media and Arts. I transform concepts into breathtaking cinematic realities through rendering, lighting, and visual storytelling.
                </p>
              </div>
            </div>
          </BentoTile>

          {/* [C] Years stat */}
          <BentoTile delay={0.12} style={{ ...glassCard, padding: '1.5rem' }}>
            <div className="h-full flex flex-col justify-between" style={{ minHeight: 120 }}>
              <div className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: 'rgba(0,255,136,0.4)' }}>
                Experience
              </div>
              <div>
                <div className="font-display text-5xl font-light text-gradient-gold">5+</div>
                <div className="font-mono text-[0.6rem] tracking-widest uppercase mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Years in 3D
                </div>
              </div>
            </div>
          </BentoTile>

          {/* [D] Projects stat */}
          <BentoTile delay={0.14} style={{ ...glassCard, padding: '1.5rem' }}>
            <div className="h-full flex flex-col justify-between" style={{ minHeight: 120 }}>
              <div className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: 'rgba(0,229,255,0.4)' }}>
                Projects
              </div>
              <div>
                <div className="font-display text-5xl font-light" style={{ color: '#00E5FF' }}>100+</div>
                <div className="font-mono text-[0.6rem] tracking-widest uppercase mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Completed
                </div>
              </div>
            </div>
          </BentoTile>

          {/* [E] Location tile */}
          <BentoTile delay={0.16} style={{ ...glassCard, padding: '1.5rem' }}>
            <div className="h-full flex flex-col justify-between" style={{ minHeight: 120 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6" style={{ color: 'rgba(0,255,136,0.5)' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <div className="font-body text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>Mumbai</div>
                <div className="font-mono text-[0.6rem] tracking-widest uppercase mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>India</div>
              </div>
            </div>
          </BentoTile>

          {/* [F] Clients stat */}
          <BentoTile delay={0.18} style={{ ...glassCard, padding: '1.5rem' }}>
            <div className="h-full flex flex-col justify-between" style={{ minHeight: 120 }}>
              <div className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: 'rgba(0,255,136,0.4)' }}>
                Clients
              </div>
              <div>
                <div className="font-display text-5xl font-light text-gradient-gold">50+</div>
                <div className="font-mono text-[0.6rem] tracking-widest uppercase mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Worldwide
                </div>
              </div>
            </div>
          </BentoTile>

          {/* [G] Specialty tile */}
          <BentoTile delay={0.2} style={{ ...glassCard, padding: '1.5rem' }}>
            <div style={{ minHeight: 120 }}>
              <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-3" style={{ color: 'rgba(0,229,255,0.4)' }}>
                Specialty
              </div>
              {['Archviz', 'VFX', 'Unreal 5'].map((tag) => (
                <div key={tag} className="flex items-center gap-2 mb-1.5">
                  <span className="w-1 h-1 rounded-full" style={{ background: '#00E5FF' }} />
                  <span className="font-mono text-[0.65rem]" style={{ color: 'rgba(255,255,255,0.55)' }}>{tag}</span>
                </div>
              ))}
            </div>
          </BentoTile>

          {/* [H] Education tile */}
          <BentoTile delay={0.22} style={{ ...glassCard, padding: '1.5rem' }}>
            <div style={{ minHeight: 120 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5 mb-3" style={{ color: 'rgba(0,255,136,0.5)' }}>
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <div className="font-body text-[0.75rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Asian Academy of Media & Arts
              </div>
              <div className="font-mono text-[0.58rem] tracking-widest uppercase mt-1" style={{ color: 'rgba(0,255,136,0.35)' }}>
                BFA Animation · 2024
              </div>
            </div>
          </BentoTile>

          {/* [I] Tools marquee — full width */}
          <BentoTile
            className="col-span-2 md:col-span-4"
            delay={0.24}
            hover={false}
            style={{ ...glassCard, padding: '1.5rem 1.75rem' }}
          >
            <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-4" style={{ color: 'rgba(0,255,136,0.35)' }}>
              Tools & Software
            </div>
            <Marquee items={TOOLS} />
          </BentoTile>

          {/* [J] CTA tile — spans 2 cols */}
          <BentoTile
            className="col-span-2 md:col-span-2"
            delay={0.26}
            style={{ ...glassCard, padding: '1.75rem' }}
          >
            <div className="flex flex-wrap gap-3">
              <a
                href="./Vishuu_Kumar_Resume (1).pdf"
                download
                className="btn-cinematic btn-cinematic-primary flex items-center gap-2 flex-1 justify-center"
                data-cursor
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5">
                  <path d="M8 2v8M5 7l3 3 3-3M2 13h12" />
                </svg>
                Download Resume
              </a>
              <a
                href="https://www.artstation.com/vishwajeetkumar684"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cinematic flex items-center gap-2 flex-1 justify-center"
                data-cursor
              >
                ArtStation ↗
              </a>
            </div>
          </BentoTile>

          {/* [K] Awards stat */}
          <BentoTile delay={0.28} style={{ ...glassCard, padding: '1.5rem' }}>
            <div className="h-full flex flex-col justify-between" style={{ minHeight: 100 }}>
              <div className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: 'rgba(0,229,255,0.4)' }}>
                Awards
              </div>
              <div>
                <div className="font-display text-5xl font-light" style={{ color: '#00E5FF' }}>15+</div>
                <div className="font-mono text-[0.6rem] tracking-widest uppercase mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  & Features
                </div>
              </div>
            </div>
          </BentoTile>

          {/* [L] Quick facts */}
          <BentoTile delay={0.3} style={{ ...glassCard, padding: '1.5rem' }}>
            <div style={{ minHeight: 100 }}>
              <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-3" style={{ color: 'rgba(0,255,136,0.35)' }}>
                Quick Facts
              </div>
              {[
                { k: 'Email', v: 'vishwajeetkumar@gmail' },
                { k: 'Phone', v: '+91-9608975704' },
              ].map(({ k, v }) => (
                <div key={k} className="mb-1.5">
                  <div className="font-mono text-[0.55rem] uppercase" style={{ color: 'rgba(0,255,136,0.3)' }}>{k}</div>
                  <div className="font-mono text-[0.62rem]" style={{ color: 'rgba(255,255,255,0.5)' }}>{v}</div>
                </div>
              ))}
            </div>
          </BentoTile>

        </div>
      </div>
    </section>
  );
}
