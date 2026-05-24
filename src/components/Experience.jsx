import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const TIMELINE = [
  {
    period: '2024 – Present',
    title: "Bachelor's in Animation",
    org: 'Asian Academy of Media & Arts',
    desc: 'Pursuing a degree in Animation with focus on 3D rendering, environment design, and cinematic visualization. Specializing in real-time pipelines and VFX.',
    accent: 'neon',
    tags: ['3D Rendering', 'VFX', 'Unreal Engine'],
    icon: '🎓',
  },
  {
    period: '2022 – 2024',
    title: 'Freelance 3D Artist',
    org: 'Independent Studio',
    desc: 'Delivered photorealistic 3D visualization and cinematic rendering for architecture firms, product companies, and media clients across India.',
    accent: 'cyan',
    tags: ['Archviz', 'Product Viz', 'V-Ray'],
    icon: '🎨',
  },
  {
    period: '2021 – 2022',
    title: 'Intermediate Education',
    org: 'Kendriya Vidyalaya AFS Purnea',
    desc: 'Completed intermediate education with a focus on sciences and foundational digital arts.',
    accent: 'neon',
    tags: ['Science', 'Arts', 'Design'],
    icon: '📚',
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

function TimelineItem({ item, index, total }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [hovered, setHovered] = useState(false);
  const accent = item.accent === 'neon' ? '#00FF88' : '#00E5FF';

  return (
    <div
      ref={ref}
      className="relative flex gap-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Vertical line */}
      {index < total - 1 && (
        <div
          className="absolute left-[19px] top-12 bottom-0 w-px"
          style={{ background: `linear-gradient(to bottom, ${accent}20, transparent)` }}
        />
      )}

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
          }}
        >
          <div
            className="w-2 h-2 rounded-full transition-all duration-500"
            style={{ background: accent, boxShadow: hovered ? `0 0 14px ${accent}` : `0 0 6px ${accent}` }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 pb-12"
      >
        <div
          className="p-5 rounded-xl transition-all duration-500"
          style={{
            border: `1px solid ${hovered ? accent + '18' : 'rgba(0,255,136,0.06)'}`,
            background: hovered ? `${accent}05` : 'rgba(0,255,136,0.015)',
          }}
        >
          <span
            className="font-mono text-xs tracking-widest mb-2 block"
            style={{ color: accent }}
          >
            {item.period}
          </span>
          <h3
            className="font-display text-xl font-light mb-1"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {item.title}
          </h3>
          <h4
            className="font-mono text-xs tracking-wider mb-3"
            style={{ color: 'rgba(255,255,255,0.26)' }}
          >
            {item.org}
          </h4>
          <p
            className="font-body text-sm leading-loose mb-4"
            style={{ color: 'rgba(255,255,255,0.36)' }}
          >
            {item.desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md font-mono text-xs"
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
    <section id="experience" ref={ref} className="relative z-10 py-32 px-4">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="section-number">04</span>
          <span className="block w-8 h-px" style={{ background: 'rgba(0,255,136,0.3)' }} />
          <span
            className="font-mono text-xs tracking-[0.3em] uppercase"
            style={{ color: 'rgba(255,255,255,0.28)' }}
          >
            Experience
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Timeline */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-[clamp(2rem,4vw,3rem)] font-light mb-12"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              Journey &<br />
              <span className="text-gradient-gold italic">Education</span>
            </motion.h2>

            <div>
              {TIMELINE.map((item, i) => (
                <TimelineItem key={item.title} item={item} index={i} total={TIMELINE.length} />
              ))}
            </div>
          </div>

          {/* Right column */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-[clamp(2rem,4vw,3rem)] font-light mb-12"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              Clients &<br />
              <span className="italic" style={{ color: '#00E5FF' }}>Recognition</span>
            </motion.h2>

            {/* Client grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-10"
            >
              <div
                className="font-mono text-[0.65rem] tracking-widest uppercase mb-5"
                style={{ color: 'rgba(0,255,136,0.28)' }}
              >
                Select Clients
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['TechFlow', 'BuildWell', 'LuxeInteriors', 'MotionArts', 'VisuArch', 'StudioX'].map((client, i) => (
                  <motion.div
                    key={client}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                    className="py-3 px-4 rounded-xl text-center font-mono text-xs cursor-default transition-all duration-300"
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
                const accent = t.accent === 'neon' ? '#00FF88' : '#00E5FF';
                return (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.5 + i * 0.15 }}
                    className="p-6 rounded-2xl transition-all duration-500"
                    style={{
                      border: '1px solid rgba(0,255,136,0.06)',
                      background: 'rgba(0,255,136,0.015)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${accent}12`;
                      e.currentTarget.style.background = `${accent}03`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,255,136,0.06)';
                      e.currentTarget.style.background = 'rgba(0,255,136,0.015)';
                    }}
                  >
                    {/* Quote mark */}
                    <div
                      className="font-display text-5xl leading-none mb-3"
                      style={{ color: `${accent}18` }}
                    >
                      "
                    </div>
                    <p
                      className="font-body text-sm leading-loose italic mb-5"
                      style={{ color: 'rgba(255,255,255,0.38)' }}
                    >
                      {t.quote}
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-display text-sm"
                        style={{
                          background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
                          border: `1px solid ${accent}20`,
                          color: accent,
                        }}
                      >
                        {t.name[0]}
                      </div>
                      <div>
                        <div
                          className="font-mono text-xs"
                          style={{ color: 'rgba(255,255,255,0.68)' }}
                        >
                          {t.name}
                        </div>
                        <div
                          className="font-mono text-xs"
                          style={{ color: 'rgba(255,255,255,0.24)' }}
                        >
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
