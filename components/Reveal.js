'use client';
import { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, className = '', style, delay = 0, id }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setActive(true); obs.disconnect(); }
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div id={id} ref={ref} className={`reveal ${active ? 'active' : ''} ${className}`}
         style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}
