'use client';
import { useEffect, useRef, useState } from 'react';

export function FadeIn({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-50px', threshold: 0 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up': return 'translate3d(0, 30px, 0)';
      case 'down': return 'translate3d(0, -30px, 0)';
      case 'left': return 'translate3d(30px, 0, 0)';
      case 'right': return 'translate3d(-30px, 0, 0)';
      default: return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.7s cubic-bezier(0.21, 0.47, 0.32, 0.98), transform 0.7s cubic-bezier(0.21, 0.47, 0.32, 0.98)`,
        transitionDelay: `${delay}s`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({ children, className = '', delay = 0.1 }: { children: React.ReactNode, className?: string, delay?: number }) {
  // Stagger container implementation without framer-motion
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-50px', threshold: 0 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? 'stagger-visible' : ''}`}
      style={{ '--stagger-delay': `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function StaggerItem({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`stagger-item ${className}`}>
      {children}
    </div>
  );
}
