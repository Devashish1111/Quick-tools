'use client';
import { useEffect, useRef } from 'react';

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const cursor = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });

    let rafId: number;
    const tick = () => {
      const dx = cursor.current.x - current.current.x;
      const dy = cursor.current.y - current.current.y;
      current.current.x += dx * 0.1;
      current.current.y += dy * 0.1;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${current.current.x - 250}px, ${current.current.y - 250}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed left-0 top-0 z-0 h-[500px] w-[500px] rounded-full mix-blend-screen"
      style={{
        transform: 'translate3d(-500px, -500px, 0)',
        willChange: 'transform',
        background: 'radial-gradient(circle, rgba(200,255,0,0.06) 0%, transparent 70%)',
      }}
    />
  );
}
