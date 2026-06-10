import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeader from './SectionHeader';

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

const SKILL_COLORS = ['var(--neon)', 'var(--cyan)', 'rgba(61,214,140,0.55)'];

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
    <div ref={ref} className="group" data-reveal-child>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          />
          <span
            className="type-label !normal-case !tracking-normal"
            style={{ color: 'rgba(255,255,255,0.58)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.58)'; }}
          >
            {skill.name}
          </span>
          <span
            className="type-label !text-[0.65rem] px-2 py-0.5 rounded normal-case"
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
          className="type-label !normal-case"
          style={{ color: 'rgba(255,255,255,0.35)' }}
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
  const color = item.color === 'neon' ? 'var(--neon)' : 'var(--cyan)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.08 }}
      className="capability-card group cursor-default"
      data-reveal-child
      data-cursor
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 30%, rgba(45,160,110,0.08) 0%, transparent 65%)` }}
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
          className="type-card-title mb-2 transition-colors duration-300 group-hover:text-white"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          {item.title}
        </h4>
        <p className="type-body-sm transition-colors duration-300 group-hover:text-white/55">
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
    <section id="skills" ref={ref} className="relative z-10 section-pad">
      <div className="section-container">
        {/* Header */}
        <SectionHeader number="04" label="Skills" title="Technical" titleAccent="Proficiency" />

        <div className="skills-layout">
          <div data-reveal>
            <div className="space-y-5" data-reveal-stagger>
              {SKILLS.map((skill, i) => (
                <SkillBar key={skill.name} skill={skill} index={i} />
              ))}
            </div>
          </div>

          <div data-reveal>
            <h3 className="type-section mb-12">
              Areas of <span className="type-section-accent text-[var(--cyan)]">Expertise</span>
            </h3>
            <div className="expertise-grid" data-reveal-stagger>
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
