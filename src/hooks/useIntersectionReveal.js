import { useEffect, useRef } from 'react';

/**
 * Lightweight scroll reveals — Intersection Observer + CSS transitions.
 * Replaces GSAP ScrollTrigger (no scroll listeners, no MutationObserver on body).
 */
export default function useIntersectionReveal(enabled = true) {
  const observerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-reveal], [data-reveal-stagger], [data-reveal-child]').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return undefined;
    }

    const reveal = (el) => {
      el.classList.add('is-revealed');
      if (el.hasAttribute('data-reveal-stagger')) {
        el.querySelectorAll('[data-reveal-child]').forEach((child) => {
          child.classList.add('is-revealed');
        });
      }
      observerRef.current?.unobserve(el);
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
    );

    const scan = () => {
      document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach((el) => {
        if (!el.classList.contains('is-revealed')) {
          observerRef.current.observe(el);
        }
      });
    };

    scan();

    const main = document.getElementById('main');
    const mo = main
      ? new MutationObserver(() => scan())
      : null;
    mo?.observe(main, { childList: true, subtree: true });

    return () => {
      observerRef.current?.disconnect();
      mo?.disconnect();
    };
  }, [enabled]);
}
