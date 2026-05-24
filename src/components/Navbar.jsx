import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', href: '#hero', id: 'hero' },
  { label: 'Works', href: '#works', id: 'works' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observers = [];
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.25, rootMargin: '-60px 0px -40% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNav = (e, href, id) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
    setMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
    >
      {/* HELIOS Logo */}
      <a
        href="#hero"
        onClick={(e) => handleNav(e, '#hero', 'hero')}
        className="flex items-center gap-3 group"
      >
        <div className="relative w-9 h-9">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(0,255,136,0.3)',
              transition: 'border-color 0.4s',
            }}
          />
          <div
            className="absolute inset-1.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,229,255,0.1))' }}
          />
          <motion.div
            className="absolute inset-[7px] rounded-full"
            style={{ background: '#00FF88' }}
            animate={{ boxShadow: ['0 0 4px rgba(0,255,136,0.4)', '0 0 16px rgba(0,255,136,0.8)', '0 0 4px rgba(0,255,136,0.4)'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span
          className="font-mono text-sm font-semibold tracking-[0.25em] uppercase transition-colors duration-300"
          style={{ color: 'rgba(255,255,255,0.65)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#00FF88'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
        >
          VK
        </span>
      </a>

      {/* Desktop pill nav */}
      <nav
        className={`hidden md:flex items-center gap-0.5 px-5 py-2.5 rounded-full transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
        style={scrolled ? {
          background: 'rgba(5,10,8,0.88)',
          border: '1px solid rgba(0,255,136,0.08)',
        } : {}}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => handleNav(e, link.href, link.id)}
            className="relative px-4 py-1.5 font-mono text-[0.7rem] tracking-[0.12em] uppercase rounded-full transition-all duration-300"
            style={{
              color: active === link.id ? '#00FF88' : 'rgba(255,255,255,0.4)',
              background: active === link.id ? 'rgba(0,255,136,0.07)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (active !== link.id) e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
            }}
            onMouseLeave={(e) => {
              if (active !== link.id) e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
            }}
          >
            {link.label}
            {active === link.id && (
              <motion.span
                layoutId="nav-dot"
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ background: '#00FF88', boxShadow: '0 0 8px #00FF88' }}
              />
            )}
          </a>
        ))}
      </nav>

      {/* Hire CTA */}
      <a
        href="#contact"
        onClick={(e) => handleNav(e, '#contact', 'contact')}
        className="hidden md:flex items-center gap-2 btn-cinematic btn-cinematic-primary text-[0.7rem] py-2 px-5"
        data-cursor
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: '#00FF88', boxShadow: '0 0 6px rgba(0,255,136,0.8)' }}
        />
        Hire Me
      </a>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-[5px] p-2 group"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className="block w-6 h-px transition-all duration-300"
          style={{
            background: 'rgba(0,255,136,0.7)',
            transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
          }}
        />
        <span
          className="block w-4 h-px transition-all duration-300"
          style={{
            background: 'rgba(0,255,136,0.5)',
            opacity: menuOpen ? 0 : 1,
          }}
        />
        <span
          className="block w-6 h-px transition-all duration-300"
          style={{
            background: 'rgba(0,255,136,0.7)',
            transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
          }}
        />
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-4 right-4 mt-2 rounded-2xl overflow-hidden md:hidden"
            style={{
              background: 'rgba(5,10,8,0.97)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(0,255,136,0.1)',
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNav(e, link.href, link.id)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between px-6 py-4 font-mono text-xs tracking-widest uppercase transition-colors duration-200"
                style={{
                  color: active === link.id ? '#00FF88' : 'rgba(255,255,255,0.45)',
                  borderBottom: '1px solid rgba(0,255,136,0.04)',
                }}
              >
                {link.label}
                {active === link.id && (
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: '#00FF88', boxShadow: '0 0 6px #00FF88' }}
                  />
                )}
              </motion.a>
            ))}
            <div className="p-4">
              <a
                href="#contact"
                onClick={(e) => handleNav(e, '#contact', 'contact')}
                className="btn-cinematic btn-cinematic-primary w-full text-center text-xs py-3"
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
