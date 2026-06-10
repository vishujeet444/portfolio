import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from './SectionHeader';
import GalleryCard from './GalleryCard';
import { GALLERY_PROJECTS, GALLERY_CATEGORIES } from '../data/galleryProjects';

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

  useEffect(() => {
    const closeBtn = document.getElementById('lightbox-close');
    closeBtn?.focus();
  }, []);

  const accent = project.accent === 'neon' ? 'var(--neon)' : 'var(--cyan)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[9000] modal-cinematic flex flex-col"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(8px)' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex-1 flex flex-col m-3 md:m-6 rounded-2xl overflow-hidden border border-white/10"
        style={{ background: 'rgba(8,10,14,0.85)', boxShadow: '0 40px 120px rgba(0,0,0,0.6)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          id="lightbox-close"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors duration-200"
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
          aria-label="Close project preview"
        >
          ✕
        </button>

        {/* Image */}
        <div className="relative flex-1 min-h-[50vh] bg-[#080a0f]">
          <img
            src={project.imageHd || project.image}
            alt={project.title}
            className="absolute inset-0 block w-full h-full object-cover"
            style={{ maxWidth: 'none', height: '100%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent" />
        </div>

        <div className="relative p-8 md:p-10 border-t border-white/6 glass-stat !rounded-none !border-x-0">
          <div className="flex flex-wrap gap-3 mb-4">
            {[project.category, project.software, project.year].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full type-label"
                style={{ color: accent, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 id="lightbox-title" className="type-project-title text-white/95 mb-6">
            {project.title}
          </h3>
          <p className="type-body max-w-3xl">{project.description}</p>
        </div>
      </motion.div>
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
    ? GALLERY_PROJECTS
    : GALLERY_PROJECTS.filter((p) => p.category === activeFilter);

  useEffect(() => {
    ScrollTrigger.refresh();
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(t);
  }, [filtered.length, activeFilter]);

  return (
    <>
      <section id="works" ref={ref} className="relative z-10 section-pad">
        <div className="section-container">
          <div className="projects-header section-header-row">
            <SectionHeader
              number="01"
              label="Selected Works"
              title="Projects"
              titleAccent="Gallery"
            />

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="filter-scroll"
            >
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  aria-pressed={activeFilter === cat}
                  className={`px-4 py-1.5 rounded-full type-label filter-pill ${
                    activeFilter === cat ? 'filter-pill-active' : ''
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="type-body-sm text-center py-16 mx-auto"
            >
              No projects in this category yet.
            </motion.p>
          ) : (
            <div className="gallery-grid">
              {filtered.map((project, i) => (
                <GalleryCard
                  key={project.id}
                  project={project}
                  index={i}
                  onClick={setSelectedProject}
                />
              ))}
            </div>
          )}

          {/* Showreel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="type-label">Cinematic Showreel</span>
              <span className="flex-1 h-px bg-white/8" />
              <span className="type-label text-[var(--neon)]/50">2026</span>
            </div>

            <div
              className="showreel-wrap relative rounded-2xl overflow-hidden group"
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
                  preload="metadata"
                  poster="https://images.unsplash.com/photo-1614728853911-0441cf48d42b?auto=format&fit=crop&w=1920&q=80"
                  id="showreel-video"
                  aria-label="3D cinematic showreel"
                  onClick={(e) => {
                    if (e.target.paused) e.target.play();
                    else e.target.pause();
                  }}
                >
                  <source src="./3D SHOWREEL.mp4" type="video/mp4" />
                </video>

                {/* Play overlay — HELIOS green */}
                <button
                  type="button"
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group/play border-0 bg-transparent"
                  id="play-overlay"
                  aria-label="Play showreel"
                  onClick={(e) => {
                    const video = document.getElementById('showreel-video');
                    if (video?.paused) {
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
                    className="absolute bottom-6 left-6 type-label"
                    style={{ color: 'rgba(255,255,255,0.38)' }}
                  >
                    Click to play showreel
                  </div>
                </button>
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
