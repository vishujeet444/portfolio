import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const SKILLS = [
  { name: 'Maya', level: 95, category: '3D' },
  { name: 'Blender', level: 90, category: '3D' },
  { name: '3ds Max', level: 88, category: '3D' },
  { name: 'ZBrush', level: 85, category: 'Sculpting' },
  { name: 'V-Ray', level: 92, category: 'Rendering' },
  { name: 'Arnold', level: 82, category: 'Rendering' },
  { name: 'Corona', level: 78, category: 'Rendering' },
  { name: 'Unreal Engine 5', level: 80, category: 'Realtime' },
  { name: 'Substance Painter', level: 88, category: 'Texturing' },
  { name: 'After Effects', level: 75, category: 'Motion' },
  { name: 'Photoshop', level: 85, category: 'Post' },
  { name: 'Premiere Pro', level: 72, category: 'Motion' },
];

// HELIOS: alternating neon green / cyan / dim green
const SKILL_COLORS = ['#00FF88', '#00E5FF', 'rgba(0,255,136,0.65)'];

const EXPERTISE = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: '3D Modeling',
    desc: 'High-poly to game-ready assets with production-level topology',
    color: 'neon',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    title: 'Lighting & Shading',
    desc: 'HDR, PBR & global illumination for photorealistic results',
    color: 'cyan',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: 'Texturing & Materials',
    desc: 'PBR workflows, 4K asset creation, tileable materials',
    color: 'neon',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    title: 'Animation & VFX',
    desc: 'Dynamics, simulations, compositing, and motion graphics',
    color: 'cyan',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Architectural Viz',
    desc: 'Interior, exterior, urban environments with spatial precision',
    color: 'neon',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Realtime Engines',
    desc: 'Unreal Engine 5, lumen, nanite & real-time rendering',
    color: 'cyan',
  },
];

function SkillBar({ skill, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const color = SKILL_COLORS[index % 3];

  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          />
          <span
            className="font-mono text-xs transition-colors duration-300"
            style={{ color: 'rgba(255,255,255,0.58)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.58)'; }}
          >
            {skill.name}
          </span>
          <span
            className="font-mono text-[0.58rem] px-1.5 py-0.5 rounded"
            style={{
              color,
              border: `1px solid ${color}22`,
              background: `${color}09`,
            }}
          >
            {skill.category}
          </span>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.05 + 0.3 }}
          className="font-mono text-xs"
          style={{ color: 'rgba(255,255,255,0.22)' }}
        >
          {skill.level}%
        </motion.span>
      </div>

      <div className="h-px rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}55)`,
            boxShadow: `0 0 10px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}

function ExpertiseCard({ item, index, inView }) {
  const color = item.color === 'neon' ? '#00FF88' : '#00E5FF';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.08 }}
      className="group relative p-5 rounded-2xl cursor-default overflow-hidden transition-all duration-500"
      style={{
        border: '1px solid rgba(0,255,136,0.07)',
        background: 'rgba(0,255,136,0.018)',
      }}
      whileHover={{ y: -4 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}20`;
        e.currentTarget.style.background = `${color}04`;
        e.currentTarget.style.boxShadow = `0 8px 40px rgba(0,0,0,0.4), 0 0 30px ${color}06`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,255,136,0.07)';
        e.currentTarget.style.background = 'rgba(0,255,136,0.018)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      data-cursor
    >
      {/* Hover radial glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 30%, ${color}08 0%, transparent 65%)` }}
      />

      <div className="relative z-10">
        <div
          className="mb-4 transition-colors duration-300"
          style={{ color: `${color}65` }}
        >
          {item.icon}
        </div>

        <div
          className="w-6 h-px mb-3 transition-all duration-300 group-hover:w-10"
          style={{ background: color, opacity: 0.45 }}
        />

        <h4
          className="font-mono text-sm font-medium mb-1.5 transition-colors duration-300 group-hover:text-white"
          style={{ color: 'rgba(255,255,255,0.72)' }}
        >
          {item.title}
        </h4>
        <p
          className="font-body text-xs leading-relaxed transition-colors duration-300 group-hover:text-white/45"
          style={{ color: 'rgba(255,255,255,0.27)' }}
        >
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" ref={ref} className="relative z-10 py-32 px-4">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="section-number">03</span>
          <span className="block w-8 h-px" style={{ background: 'rgba(0,255,136,0.3)' }} />
          <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Skills
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Skill bars */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-[clamp(2rem,4vw,3rem)] font-light mb-10"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              Technical<br />
              <span className="text-gradient-gold italic">Proficiency</span>
            </motion.h2>

            <div className="space-y-5">
              {SKILLS.map((skill, i) => (
                <SkillBar key={skill.name} skill={skill} index={i} />
              ))}
            </div>
          </div>

          {/* Right: Expertise cards */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-[clamp(2rem,4vw,3rem)] font-light mb-10"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              Areas of<br />
              <span className="italic" style={{ color: '#00E5FF' }}>Expertise</span>
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EXPERTISE.map((item, i) => (
                <ExpertiseCard key={item.title} item={item} index={i} inView={inView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
