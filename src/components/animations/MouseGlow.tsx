'use client';
import { motion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function MouseGlow() {
  const [mounted, setMounted] = useState(false);
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  useEffect(() => {
    setMounted(true);
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 250);
      cursorY.set(e.clientY - 250);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-0 h-[500px] w-[500px] rounded-full mix-blend-screen"
      style={{
        translateX: cursorX,
        translateY: cursorY,
        background: 'radial-gradient(circle, rgba(200,255,0,0.06) 0%, transparent 70%)',
      }}
    />
  );
}
