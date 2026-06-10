import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeader from './SectionHeader';

const TIMELINE = [
  {
    period: '2024 – Present',
    title: "Bachelor's in Animation",
    org: 'Asian Academy of Media & Arts',
    desc: 'Pursuing a degree in Animation with focus on 3D rendering, environment design, and cinematic visualization. Specializing in real-time pipelines and VFX.',
    accent: 'neon',
    tags: ['3D Rendering', 'VFX', 'Unreal Engine'],
    icon: 'edu',
  },
  {
    period: '2022 – 2024',
    title: 'Freelance 3D Artist',
    org: 'Independent Studio',
    desc: 'Delivered photorealistic 3D visualization and cinematic rendering for architecture firms, product companies, and media clients across India.',
    accent: 'cyan',
    tags: ['Archviz', 'Product Viz', 'V-Ray'],
    icon: 'work',
  },
  {
    period: '2021 – 2022',
    title: 'Intermediate Education',
    org: 'Kendriya Vidyalaya AFS Purnea',
    desc: 'Completed intermediate education with a focus on sciences and foundational digital arts.',
    accent: 'neon',
    tags: ['Science', 'Arts', 'Design'],
    icon: 'school',
  },
];

const TESTIMONIALS = [
  {
    quote: '"Vishwajeet\'s attention to lighting and detail transformed our project. His ability to capture the exact mood we needed was exceptional."',
    name: 'Sarah Jenkins',
    role: 'Art Director, Creative Studio X',
    accent: 'neon',
  },
  {
    quote: '"A true professional who delivers cinematic quality under tight deadlines. Highly recommended for any high-stakes visualization work."',
    name: 'David Chen',
    role: 'Senior Architect, BuildWell',
    accent: 'cyan',
  },
];

const TIMELINE_ICONS = {
  edu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-4 h-4" aria-hidden>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  work: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-4 h-4" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  school: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-4 h-4" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
};

function TimelineItem({ item, index, total }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [hovered, setHovered] = useState(false);
  const accent = item.accent === 'neon' ? 'var(--neon)' : 'var(--cyan)';

  return (
    <div
      ref={ref}
      className="relative flex gap-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Vertical line */}
      {index < total - 1 && <div className="timeline-trail" />}

      {/* Node */}
      <div className="relative flex-shrink-0 mt-1">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
          style={{
            border: `1px solid ${accent}${hovered ? '60' : '28'}`,
            background: hovered ? `${accent}14` : `${accent}06`,
            boxShadow: hovered ? `0 0 28px ${accent}22` : `0 0 12px ${accent}08`,
            color: accent,
          }}
        >
          {TIMELINE_ICONS[item.icon] ?? (
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
            />
          )}
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        data-reveal-child
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 pb-12"
      >
        <div className={`glass-stat p-5 transition-all duration-500 ${hovered ? '!border-[var(--border-accent)]' : ''}`}>
          <span
            className="type-label mb-3 block"
            style={{ color: accent }}
          >
            {item.period}
          </span>
          <h3 className="type-card-title text-white/90 mb-2">
            {item.title}
          </h3>
          <h4 className="type-label mb-4 !normal-case">
            {item.org}
          </h4>
          <p className="type-body-sm mb-6 !max-w-none">
            {item.desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-md type-label !text-[0.65rem]"
                style={{ color: accent, border: `1px solid ${accent}18`, background: `${accent}07` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" ref={ref} className="relative z-10 section-pad">
      <div className="section-container">
        {/* Header */}
        <SectionHeader number="05" label="Experience" title="Journey &" titleAccent="Education" />

        <div className="experience-layout">
          <div data-reveal>
            <div data-reveal-stagger>
              {TIMELINE.map((item, i) => (
                <TimelineItem key={item.title} item={item} index={i} total={TIMELINE.length} />
              ))}
            </div>
          </div>

          <div data-reveal>
            <h3 className="type-section mb-12">
              Clients & <span className="type-section-accent text-[var(--cyan)]">Recognition</span>
            </h3>

            {/* Client grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-10"
            >
              <div
                className="type-label mb-6"
              >
                Select Clients
              </div>
              <div className="clients-grid">
                {['TechFlow', 'BuildWell', 'LuxeInteriors', 'MotionArts', 'VisuArch', 'StudioX'].map((client, i) => (
                  <motion.div
                    key={client}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                    className="py-4 px-3 rounded-xl text-center type-label !normal-case cursor-default transition-all duration-300"
                    style={{
                      color: 'rgba(255,255,255,0.28)',
                      border: '1px solid rgba(0,255,136,0.06)',
                      background: 'rgba(0,255,136,0.015)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'rgba(0,255,136,0.7)';
                      e.currentTarget.style.borderColor = 'rgba(0,255,136,0.18)';
                      e.currentTarget.style.background = 'rgba(0,255,136,0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.28)';
                      e.currentTarget.style.borderColor = 'rgba(0,255,136,0.06)';
                      e.currentTarget.style.background = 'rgba(0,255,136,0.015)';
                    }}
                  >
                    {client}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="divider-gold mb-10" />

            {/* Testimonials */}
            <div className="space-y-5">
              {TESTIMONIALS.map((t, i) => {
                const accent = t.accent === 'neon' ? 'var(--neon)' : 'var(--cyan)';
                return (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.5 + i * 0.15 }}
                    className="glass-stat p-6 transition-all duration-500"
                  >
                    {/* Quote mark */}
                    <div
                      className="type-stat !text-[3rem] leading-none mb-4 opacity-20"
                      style={{ color: accent }}
                    >
                      "
                    </div>
                    <p className="type-body italic mb-6 !max-w-none opacity-90">
                      {t.quote}
                    </p>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center type-card-title"
                        style={{
                          background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
                          border: `1px solid ${accent}20`,
                          color: accent,
                        }}
                      >
                        {t.name[0]}
                      </div>
                      <div>
                        <div className="type-body-sm !text-white/70">
                          {t.name}
                        </div>
                        <div className="type-label mt-1">
                          {t.role}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
