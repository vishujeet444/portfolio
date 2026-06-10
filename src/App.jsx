import { useState, useRef, useEffect, Suspense, lazy, useCallback } from 'react';

import Loader from './components/Loader';
import AmbientLayers from './components/AmbientLayers';
import Navbar from './components/Navbar';
import DynamicIsland from './components/DynamicIsland';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { useResponsive } from './context/ResponsiveProvider';
import useSmoothScroll from './hooks/useSmoothScroll';
import useIntersectionReveal from './hooks/useIntersectionReveal';
import useScrollProgress from './hooks/useScrollProgress';
import SceneErrorBoundary from './components/SceneErrorBoundary';

const CustomCursor = lazy(() => import('./components/CustomCursor'));
const GalaxyScene = lazy(() => import('./components/GalaxyScene'));
const Projects = lazy(() => import('./components/Projects'));
const Interactive3DLab = lazy(() => import('./components/Interactive3DLab'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Experience = lazy(() => import('./components/Experience'));
const Contact = lazy(() => import('./components/Contact'));

export default function App() {
  const [loaded, setLoaded] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const { progressRef, showBackToTop } = useScrollProgress();
  const { reduceEffects } = useResponsive();

  const mouse = useRef({ x: 0, y: 0 });
  const handleLoaded = useCallback(() => setLoaded(true), []);
  const showGalaxy = loaded && !reduceEffects;

  useSmoothScroll();
  useIntersectionReveal(loaded);

  useEffect(() => {
    if (!showGalaxy) return undefined;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return undefined;

    const onMouseMove = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [showGalaxy]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {!loaded && <Loader onComplete={handleLoaded} />}

      {loaded && (
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
      )}

      <div
        ref={progressRef}
        className="scroll-progress"
        role="progressbar"
        aria-valuenow={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />

      {showGalaxy && (
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <GalaxyScene mouse={mouse} />
          </Suspense>
        </SceneErrorBoundary>
      )}

      {!showGalaxy && <AmbientLayers />}

      <div className="relative z-10 app-shell">
        <DynamicIsland />
        <Navbar />
        <main id="main">
          <Hero />
          <div className="section-bridge" aria-hidden />
          <Suspense fallback={<div className="section-pad section-container" aria-hidden />}>
            <Projects />
          </Suspense>
          <div className="section-bridge" aria-hidden />
          <Suspense fallback={<div className="section-pad section-container" aria-hidden />}>
            <Interactive3DLab />
          </Suspense>
          <div className="section-bridge" aria-hidden />
          <Suspense fallback={<div className="section-pad section-container" aria-hidden />}>
            <About />
          </Suspense>
          <div className="section-bridge" aria-hidden />
          <Suspense fallback={<div className="section-pad section-container" aria-hidden />}>
            <Skills />
          </Suspense>
          <div className="section-bridge" aria-hidden />
          <Suspense fallback={<div className="section-pad section-container" aria-hidden />}>
            <Experience />
          </Suspense>
          <div className="section-bridge" aria-hidden />
          <Suspense fallback={<div className="section-pad section-container" aria-hidden />}>
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="back-to-top fixed z-50 w-11 h-11 rounded-full flex items-center justify-center glass-stat reveal-fade-in"
          aria-label="Back to top"
          data-cursor
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 text-[var(--neon)]" aria-hidden>
            <path d="M8 13V3M3 8l5-5 5 5" />
          </svg>
        </button>
      )}
    </>
  );
}
