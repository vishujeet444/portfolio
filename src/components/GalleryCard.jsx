import { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

const ASPECT = {
  cinematic: '21 / 9',
  portrait: '4 / 5',
  standard: '4 / 3',
};

export default function GalleryCard({ project, index, onClick }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [imgFailed, setImgFailed] = useState(false);

  const isLarge = project.size === 'large';
  const aspectRatio = ASPECT[project.aspect] || ASPECT.standard;
  const accent = project.accent === 'neon' ? 'var(--neon)' : 'var(--cyan)';
  const enableTilt = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const handleMouseMove = useCallback((e) => {
    if (!enableTilt) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 5, y: -x * 5 });
  }, [enableTilt]);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`gallery-card project-card-premium group cursor-pointer ${isLarge ? 'gallery-card--large' : ''}`}
      style={
        enableTilt && hovered
          ? {
              transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px)`,
            }
          : undefined
      }
      onMouseEnter={() => enableTilt && setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      onClick={() => onClick(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(project);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title}`}
      data-cursor
    >
      <div
        className="gallery-card__media relative w-full overflow-hidden"
        style={{ aspectRatio, minHeight: isLarge ? '12rem' : '10rem' }}
      >
        {imgFailed ? (
          <div
            className="gallery-card__placeholder absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <span className="type-label opacity-40">Image unavailable</span>
          </div>
        ) : (
          <img
            src={project.image}
            alt={project.title}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="gallery-card__image"
            onError={() => setImgFailed(true)}
          />
        )}

        <div className="project-card-glass" />
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-[3]"
          style={{
            opacity: hovered ? 1 : 0.35,
            background: `radial-gradient(ellipse at 50% 100%, ${accent}22 0%, transparent 60%)`,
          }}
        />

        <span
          className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full type-label"
          style={{ background: 'rgba(0,0,0,0.55)', border: `1px solid ${accent}33`, color: accent }}
        >
          {project.year}
        </span>

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10 pointer-events-none">
          <span className="type-label mb-2 block" style={{ color: accent }}>
            {project.category} · {project.software}
          </span>
          <h3 className="type-project-title text-white mb-2">{project.title}</h3>
          <p className="type-body-sm !max-w-none line-clamp-2 opacity-0 max-h-0 overflow-hidden transition-all duration-300 group-hover:opacity-100">
            {project.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
