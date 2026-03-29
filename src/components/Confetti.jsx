import { useEffect, useRef } from 'react';

const COLORS = ['#8b5cf6','#06b6d4','#22c55e','#f59e0b','#f43f5e','#e879f9','#fbbf24'];

export default function Confetti({ active }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${1.5 + Math.random() * 2}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      container.appendChild(piece);
    }

    const timer = setTimeout(() => { container.innerHTML = ''; }, 3500);
    return () => clearTimeout(timer);
  }, [active]);

  return <div className="confetti-container" ref={containerRef} />;
}
