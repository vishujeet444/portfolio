import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const PROJECTS = [
  {
    id: 1,
    title: 'Architectural Visualization',
    category: 'Archviz',
    software: 'Blender + Cycles',
    year: '2024',
    description: 'Photorealistic interior and exterior renders with dynamic lighting studies and material exploration.',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=90',
    size: 'large',
    accent: 'neon',
  },
  {
    id: 2,
    title: 'Product Showcase',
    category: 'Product',
    software: 'Maya + Arnold',
    year: '2024',
    description: 'High-end product visualization with studio-quality lighting and material fidelity.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=90',
    size: 'medium',
    accent: 'cyan',
  },
  {
    id: 3,
    title: 'Cinematic Environment',
    category: 'VFX',
    software: 'Houdini + Mantra',
    year: '2023',
    description: 'Cinematic environment design with volumetric atmospherics and hero lighting.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=90',
    size: 'medium',
    accent: 'neon',
  },
  {
    id: 4,
    title: 'Interior Design Render',
    category: 'Archviz',
    software: '3ds Max + V-Ray',
    year: '2023',
    description: 'Luxury interior render with warm cinematic color grading and precise material accuracy.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=90',
    size: 'medium',
    accent: 'cyan',
  },
  {
    id: 5,
    title: 'Automotive Render',
    category: 'Automotive',
    software: 'Blender + EEVEE',
    year: '2024',
    description: 'Sleek automotive visualization with dynamic studio lighting and reflective materials.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=90',
    size: 'large',
    accent: 'neon',
  },
  {
    id: 6,
    title: 'Abstract 3D Motion',
    category: 'Motion',
    software: 'Cinema 4D + Octane',
    year: '2023',
    description: 'Experimental abstract work exploring form, light, and motion.',
    image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=900&q=90',
    size: 'medium',
    accent: 'cyan',
  },
];

const CATEGORIES = ['All', 'Archviz', 'Product', 'VFX', 'Automotive', 'Motion'];

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ project, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const accent = project.accent === 'neon' ? '#00FF88' : '#00E5FF';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4 md:p-10"
      style={{ background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-5xl w-full rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${accent}20`, background: '#05080A' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors duration-200"
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          ✕
        </button>

        {/* Image */}
        <div className="aspect-[16/9]">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(8,8,16,0.9) 0%, transparent 60%)' }}
          />
        </div>

        {/* Info */}
        <div className="p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: accent }}>
                {project.category} · {project.software} · {project.year}
              </div>
              <h3 className="font-display text-3xl font-light text-white/95">{project.title}</h3>
            </div>
          </div>
          <p className="font-body text-sm text-white/45 leading-loose max-w-2xl">{project.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index, onClick }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const isLarge = project.size === 'large';
  const accent = project.accent === 'neon' ? '#00FF88' : '#00E5FF';

  const handleMouseMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 6, y: -x * 6 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`project-card cursor-pointer ${isLarge ? 'md:col-span-2' : 'md:col-span-1'}`}
      style={{
        transform: hovered ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)` : 'none',
        transition: hovered ? 'transform 0.1s ease' : 'transform 0.5s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(project)}
      data-cursor
    >
      <div className={`relative overflow-hidden ${isLarge ? 'aspect-[2/1]' : 'aspect-[4/3]'}`}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.7s ease' }}
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.25) 50%, transparent 100%)',
            opacity: hovered ? 1 : 0.65,
          }}
        />

        {/* Accent glow */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 100%, ${accent}20 0%, transparent 65%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Year badge */}
        <div
          className="absolute top-4 right-4 px-2.5 py-1 rounded-full font-mono text-[0.6rem] tracking-wider"
          style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${accent}25`, color: accent }}
        >
          {project.year}
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
          <motion.span
            animate={{ y: hovered ? 0 : 10, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-xs tracking-widest uppercase mb-2"
            style={{ color: accent }}
          >
            {project.category} · {project.software}
          </motion.span>

          <h3 className="font-display text-2xl font-light text-white mb-2">{project.title}</h3>

          <motion.p
            initial={false}
            animate={{ y: hovered ? 0 : 10, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="font-body text-xs text-white/50 leading-relaxed overflow-hidden"
            style={{ maxHeight: hovered ? '60px' : '0px', transition: 'max-height 0.4s ease' }}
          >
            {project.description}
          </motion.p>

          <motion.div
            animate={{ x: hovered ? 0 : -10, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="mt-4 flex items-center gap-2"
          >
            <span className="font-mono text-xs tracking-wider" style={{ color: accent }}>View Project</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: accent }}>
              <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

        {/* Top accent border */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute top-0 left-0 right-0 h-px origin-left"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

// ── Main Projects Section ──────────────────────────────────────────────────────
export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <>
      <section id="works" ref={ref} className="relative z-10 py-32 px-4">
        <div className="section-container">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4 mb-4"
              >
                <span className="section-number">01</span>
                <span className="block w-8 h-px" style={{ background: 'rgba(0,255,136,0.3)' }} />
                <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>Selected Works</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-display text-[clamp(2rem,5vw,3.5rem)] font-light text-white/90"
              >
                Projects Gallery
              </motion.h2>
            </div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="px-4 py-1.5 rounded-full font-mono text-xs tracking-wider transition-all duration-300"
                  style={activeFilter === cat ? {
                    background: 'rgba(0,255,136,0.08)',
                    color: '#00FF88',
                    border: '1px solid rgba(0,255,136,0.35)',
                  } : {
                    color: 'rgba(255,255,255,0.28)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                  onMouseEnter={(e) => { if (activeFilter !== cat) { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; } }}
                  onMouseLeave={(e) => { if (activeFilter !== cat) { e.currentTarget.style.color = 'rgba(255,255,255,0.28)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; } }}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onClick={setSelectedProject}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Showreel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>Cinematic Showreel</span>
              <span className="flex-1 h-px" style={{ background: 'rgba(0,255,136,0.08)' }} />
              <span className="font-mono text-xs tracking-wider" style={{ color: 'rgba(0,255,136,0.4)' }}>2024</span>
            </div>

            <div
              className="relative rounded-2xl overflow-hidden group"
              style={{ border: '1px solid rgba(0,255,136,0.1)', background: '#000' }}
            >
              {/* HELIOS neon glow on hover */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.04) 0%, transparent 60%)' }}
              />

              <div style={{ paddingBottom: '56.25%', position: 'relative', height: 0 }}>
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                  preload="none"
                  poster="https://images.unsplash.com/photo-1614728853911-0441cf48d42b?auto=format&fit=crop&w=1920&q=80"
                  id="showreel-video"
                  onClick={(e) => {
                    if (e.target.paused) e.target.play();
                    else e.target.pause();
                  }}
                >
                  <source src="./3D SHOWREEL.mp4" type="video/mp4" />
                </video>

                {/* Play overlay — HELIOS green */}
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
                  id="play-overlay"
                  onClick={(e) => {
                    const video = document.getElementById('showreel-video');
                    if (video.paused) {
                      video.play();
                      e.currentTarget.style.opacity = '0';
                      e.currentTarget.style.pointerEvents = 'none';
                    }
                  }}
                >
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: 'rgba(0,255,136,0.12)' }}
                    />
                    <div
                      className="relative w-20 h-20 rounded-full flex items-center justify-center group-hover/play:scale-110 transition-transform duration-300"
                      style={{
                        background: 'rgba(0,255,136,0.08)',
                        border: '1px solid rgba(0,255,136,0.28)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 0 30px rgba(0,255,136,0.12)',
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="#00FF88">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                  <div
                    className="absolute bottom-6 left-6 font-mono text-xs tracking-widest uppercase"
                    style={{ color: 'rgba(255,255,255,0.38)' }}
                  >
                    Click to play showreel
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedProject && (
          <Lightbox project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
