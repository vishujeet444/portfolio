import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';

import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import DynamicIsland from './components/DynamicIsland';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Lazy-load the heavy 3D scene
const GalaxyScene = lazy(() => import('./components/GalaxyScene'));
// Lazy-load projects (images)
const Projects = lazy(() => import('./components/Projects'));

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const mouse = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);

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
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      scrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Loading screen ────────────────────────── */}
      <AnimatePresence>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {/* ── Custom cursor ─────────────────────────── */}
      <CustomCursor />

      {/* ── Scroll progress bar ───────────────────── */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* ── Film grain overlay ────────────────────── */}
      <div
        aria-hidden
        className="fixed inset-0 z-[9990] pointer-events-none"
        style={{
          opacity: 0.022,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation: 'grain 0.4s steps(1) infinite',
        }}
      />

      {/* ── Galaxy background ─────────────────────── */}
      <Suspense fallback={<div className="fixed inset-0 z-0" style={{ background: '#050508' }} />}>
        <GalaxyScene mouse={mouse} scrollY={scrollY} />
      </Suspense>

      {/* ── Main content ──────────────────────────── */}
      <div className="relative z-10">
        <DynamicIsland />
        <Navbar />
        <main>
          <Hero />
          <Suspense fallback={<div className="h-screen" />}>
            <Projects />
          </Suspense>
          <About />
          <Skills />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>

      {/* ── Back to top ───────────────────────────── */}
      {scrollProgress > 15 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full flex items-center justify-center glass-gold transition-all duration-300 group"
          aria-label="Back to top"
          data-cursor
          style={{ boxShadow: '0 0 24px rgba(0,255,136,0.14)' }}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="#00FF88"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200"
          >
            <path d="M8 13V3M3 8l5-5 5 5" />
          </svg>
        </button>
      )}
    </>
  );
}
