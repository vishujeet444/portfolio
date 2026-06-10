import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS, scrollToSection } from '../lib/constants';
import useActiveSection from '../hooks/useActiveSection';
import useMagnetic from '../hooks/useMagnetic';
import MagneticButton from './MagneticButton';
import BrandLogo from './BrandLogo';
import { useResponsive } from '../context/ResponsiveProvider';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(NAV_LINKS.map((l) => l.id));
  const hireRef = useMagnetic(0.2);
  const { isMobile, isTablet } = useResponsive();
  const compressed = scrolled;
  const showDock = !isMobile;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const handleNav = (e, href) => {
    e.preventDefault();
    scrollToSection(href);
    setMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="site-header fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-3 md:py-4 pointer-events-none"
    >
      <div className="site-header__inner w-full flex items-center justify-between pointer-events-auto">
        <a
          href="#hero"
          onClick={(e) => handleNav(e, '#hero')}
          className="flex items-center gap-3 group shrink-0"
          aria-label="Vishwajeet Kumar — Home"
        >
          <BrandLogo variant="nav" className="group-hover:opacity-100 opacity-90 transition-opacity duration-300" />
        </a>

        {showDock && (
          <nav
            aria-label="Primary"
            className={`hidden lg:flex items-center gap-1 px-3 py-2 dock-vision ${compressed ? 'dock-vision-compressed' : ''} ${isTablet ? '!rounded-2xl' : ''}`}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                aria-current={active === link.id ? 'page' : undefined}
                className={`dock-link ${active === link.id ? 'dock-link-active' : ''}`}
              >
                {link.label}
                {active === link.id && <span className="dock-indicator" />}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 shrink-0">
          <div ref={hireRef} className="hidden md:block">
            <MagneticButton
              variant="primary"
              href="#contact"
              onClick={(e) => handleNav(e, '#contact')}
              className="!py-2.5 !px-6 !text-[0.68rem]"
            >
              Hire Me
            </MagneticButton>
          </div>

          <button
            type="button"
            className="lg:hidden flex flex-col gap-[5px] p-2 pointer-events-auto"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="block w-6 h-px bg-white/50 transition-all duration-300" style={{ transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <span className="block w-4 h-px bg-white/35 transition-all duration-300" style={{ opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-6 h-px bg-white/50 transition-all duration-300" style={{ transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="nav-overlay-backdrop pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden
            />
            <motion.nav
              id="mobile-nav"
              className="nav-overlay-panel pointer-events-auto"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobile"
            >
              <div className="nav-overlay-links">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    aria-current={active === link.id ? 'page' : undefined}
                    className="nav-overlay-link"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
              <div className="nav-overlay-footer">
                <MagneticButton variant="primary" href="#contact" onClick={(e) => handleNav(e, '#contact')} className="w-full">
                  Hire Me
                </MagneticButton>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
