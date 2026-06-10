import { useEffect, useRef } from 'react';

function findInteractive(node) {
  if (!(node instanceof Element)) return null;
  return node.closest('a, button, [data-cursor]');
}

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return undefined;

    document.body.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    let ringX = 0;
    let ringY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let raf = 0;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      raf = requestAnimationFrame(animate);
    };

    const onEnterLink = () => {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    };

    const onLeaveLink = () => {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    };

    const onPointerOver = (e) => {
      if (findInteractive(e.target)) onEnterLink();
    };

    const onPointerOut = (e) => {
      const from = findInteractive(e.target);
      if (!from) return;
      const related = findInteractive(e.relatedTarget);
      if (!related) onLeaveLink();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onPointerOver, { passive: true });
    document.addEventListener('mouseout', onPointerOut, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onPointerOver);
      document.removeEventListener('mouseout', onPointerOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hidden md:block" aria-hidden>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </div>
  );
}
