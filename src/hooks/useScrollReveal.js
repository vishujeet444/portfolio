import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useScrollReveal(enabled = true) {
  const observerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const registered = new Set();
    let debounce = 0;

    const ctx = gsap.context(() => {
      const revealElement = (el) => {
        if (registered.has(el)) return;
        registered.add(el);
        gsap.fromTo(
          el,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      };

      const revealStagger = (container) => {
        if (registered.has(container)) return;
        const children = container.querySelectorAll('[data-reveal-child]');
        if (!children.length) return;
        registered.add(container);
        gsap.fromTo(
          children,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      };

      const scanAndReveal = () => {
        document.querySelectorAll('[data-reveal]').forEach(revealElement);
        document.querySelectorAll('[data-reveal-stagger]').forEach(revealStagger);
        ScrollTrigger.refresh();
      };

      scanAndReveal();

      observerRef.current = new MutationObserver((mutations) => {
        const hasNew = mutations.some((m) => m.addedNodes.length > 0);
        if (!hasNew) return;
        clearTimeout(debounce);
        debounce = window.setTimeout(scanAndReveal, 80);
      });

      observerRef.current.observe(document.body, { childList: true, subtree: true });
    });

    return () => {
      clearTimeout(debounce);
      observerRef.current?.disconnect();
      registered.clear();
      ctx.revert();
    };
  }, [enabled]);
}
