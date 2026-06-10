import { useState, useRef, useEffect, Suspense, lazy, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Loader from './components/Loader';
import AmbientLayers from './components/AmbientLayers';
import Navbar from './components/Navbar';
import DynamicIsland from './components/DynamicIsland';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useResponsive } from './context/ResponsiveProvider';
import useSmoothScroll from './hooks/useSmoothScroll';
import useScrollReveal from './hooks/useScrollReveal';
import useScrollProgress from './hooks/useScrollProgress';
import SceneErrorBoundary from './components/SceneErrorBoundary';

const CustomCursor = lazy(() => import('./components/CustomCursor'));

const GalaxyScene = lazy(() => import('./components/GalaxyScene'));
const Projects = lazy(() => import('./components/Projects'));
const Interactive3DLab = lazy(() => import('./components/Interactive3DLab'));

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const { progressRef, showBackToTop } = useScrollProgress();
  const { reduceEffects } = useResponsive();

  const mouse = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);
  const handleLoaded = useCallback(() => setLoaded(true), []);
  useSmoothScroll(loaded);
  useScrollReveal(loaded);

  useEffect(() => {
    const onMouseMove = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        scrollY.current = window.scrollY;
        raf = 0;
      });
    };
    scrollY.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <AnimatePresence>
        {!loaded && <Loader onComplete={handleLoaded} />}
      </AnimatePresence>

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

      {!reduceEffects && (
        <div
          aria-hidden
          className="grain-overlay fixed inset-0 z-[9990] pointer-events-none opacity-[0.018]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {loaded && (
        <SceneErrorBoundary>
          <Suspense fallback={<div className="fixed inset-0 z-0" style={{ background: '#050508' }} />}>
            <GalaxyScene mouse={mouse} scrollY={scrollY} />
          </Suspense>
        </SceneErrorBoundary>
      )}

      <AmbientLayers />

      <div className="relative z-10">
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
          <About />
          <div className="section-bridge" aria-hidden />
          <Skills />
          <div className="section-bridge" aria-hidden />
          <Experience />
          <div className="section-bridge" aria-hidden />
          <Contact />
        </main>
        <Footer />
      </div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="back-to-top fixed z-50 w-11 h-11 rounded-full flex items-center justify-center glass-stat"
            aria-label="Back to top"
            data-cursor
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 text-[var(--neon)]" aria-hidden>
              <path d="M8 13V3M3 8l5-5 5 5" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
