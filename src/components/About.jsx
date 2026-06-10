import { motion } from 'framer-motion';
import { useRef } from 'react';
import { CONTACT, SITE } from '../lib/constants';
import SectionHeader from './SectionHeader';
import StatCounter from './StatCounter';

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
            className="flex-shrink-0 px-3 py-1 type-label cursor-default"
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

  return (
    <section id="about" ref={ref} className="relative z-10 section-pad">
      <div className="section-container">

        <SectionHeader
          number="03"
          label="About Me"
          title="Crafting worlds"
          titleAccent="through light"
        />

        <motion.p
          data-reveal
          {...springIn(0.06)}
          className="type-body mx-auto md:mx-0 mb-14 -mt-4"
        >
          A narrative of light, space, and cinematic craft — from concept to final frame.
        </motion.p>

        {/* ── APPLE BENTO GRID ────────────────────────── */}
        <div className="about-bento">

          <BentoTile className="about-bento__bio" delay={0.05} style={{ ...glassCard, padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
            <div className="h-full flex flex-col justify-between">
              <div>
                <h3 className="type-card-title text-white/90 mb-1">Vishwajeet Kumar</h3>
                <p className="type-label text-[var(--neon)]/60 mb-5">3D Cinematic Artist · Mumbai</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ background: '#00FF88', boxShadow: '0 0 8px rgba(0,255,136,0.7)' }} />
                  <span className="type-label text-[var(--neon)]/60">
                    Open to work
                  </span>
                </div>
                <p className="type-body !max-w-none">
                  Pursuing a Bachelor's in Animation at the Asian Academy of Media and Arts. I transform concepts into breathtaking cinematic realities through rendering, lighting, and visual storytelling.
                </p>
              </div>
            </div>
          </BentoTile>

          <BentoTile delay={0.12} className="!p-0 !bg-transparent !border-0" style={{}} hover={false}>
            <StatCounter value="5+" label="Years in 3D" />
          </BentoTile>

          <BentoTile delay={0.14} className="!p-0 !bg-transparent !border-0" style={{}} hover={false}>
            <StatCounter value="100+" label="Projects completed" accent="var(--cyan)" />
          </BentoTile>

          {/* [E] Location tile */}
          <BentoTile delay={0.16} style={{ ...glassCard, padding: '1.5rem' }}>
            <div className="h-full flex flex-col justify-between" style={{ minHeight: 120 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6" style={{ color: 'rgba(0,255,136,0.5)' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <div className="type-body-sm !text-white/75">Mumbai</div>
                <div className="type-label mt-1">India</div>
              </div>
            </div>
          </BentoTile>

          <BentoTile delay={0.18} className="!p-0 !bg-transparent !border-0" hover={false}>
            <StatCounter value="50+" label="Clients worldwide" />
          </BentoTile>

          {/* [G] Specialty tile */}
          <BentoTile delay={0.2} style={{ ...glassCard, padding: '1.5rem' }}>
            <div style={{ minHeight: 120 }}>
              <div className="type-label mb-3 text-[var(--cyan)]/50">
                Specialty
              </div>
              {['Archviz', 'VFX', 'Unreal 5'].map((tag) => (
                <div key={tag} className="flex items-center gap-2 mb-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--cyan)]" />
                  <span className="type-body-sm">{tag}</span>
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
              <div className="type-body-sm">
                Asian Academy of Media & Arts
              </div>
              <div className="type-label mt-2">
                BFA Animation · {SITE.year}
              </div>
            </div>
          </BentoTile>

          {/* [I] Tools marquee — full width */}
          <BentoTile
            className="about-bento__marquee"
            delay={0.24}
            hover={false}
            style={{ ...glassCard, padding: '1.5rem 1.75rem' }}
          >
            <div className="type-label mb-5">
              Tools & Software
            </div>
            <Marquee items={TOOLS} />
          </BentoTile>

          {/* [J] CTA tile — spans 2 cols */}
          <BentoTile
            className="about-bento__cta"
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

          <BentoTile delay={0.28} className="!p-0 !bg-transparent !border-0" hover={false}>
            <StatCounter value="15+" label="Awards & features" accent="var(--cyan)" />
          </BentoTile>

          {/* [L] Quick facts */}
          <BentoTile delay={0.3} style={{ ...glassCard, padding: '1.5rem' }}>
            <div style={{ minHeight: 100 }}>
              <div className="type-label mb-4">
                Quick Facts
              </div>
              {[
                { k: 'Email', v: CONTACT.email },
                { k: 'Phone', v: CONTACT.phone },
              ].map(({ k, v }) => (
                <div key={k} className="mb-3">
                  <div className="type-label !text-[0.65rem] mb-1">{k}</div>
                  <div className="type-body-sm">{v}</div>
                </div>
              ))}
            </div>
          </BentoTile>

        </div>
      </div>
    </section>
  );
}
