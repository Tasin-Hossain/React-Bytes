import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';

const PkgTabs = ({ active, onChange }) => {
  const containerRef = useRef(null);
  const indicatorRef = useRef(null);
  const btnRefs = useRef({});
  const [hovered, setHovered] = useState(null);

  const targetTab = hovered ?? active;

  useLayoutEffect(() => {
    const btn = btnRefs.current[targetTab];
    const container = containerRef.current;
    if (!btn || !container) return;

    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    gsap.to(indicatorRef.current, {
      x: btnRect.left - containerRect.left,
      width: btnRect.width,
      duration: 0.3,
      ease: 'power3.out'
    });
  }, [targetTab]);

  const handleClick = (p) => {
    onChange(p);
    gsap.fromTo(
      btnRefs.current[p],
      { scale: 0.9 },
      { scale: 1, duration: 0.3, ease: 'back.out(3)' }
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseLeave={() => setHovered(null)}
      className="relative inline-flex items-center rounded-md border border-(--border-secondary) bg-(--bg-button) p-1 mb-2"
    >
      {/* sliding indicator — follows hover, falls back to active */}
      <div
        ref={indicatorRef}
        className="absolute top-1 bottom-1 left-0 rounded bg-(--brand)/10 border border-(--brand)/20 pointer-events-none"
      />

      {['pnpm', 'npm', 'yarn', 'bun'].map((p) => (
        <button
          key={p}
          ref={(el) => (btnRefs.current[p] = el)}
          onClick={() => handleClick(p)}
          onMouseEnter={() => setHovered(p)}
          className={`relative z-10 px-3.5 py-1 rounded text-sm font-medium transition-colors cursor-pointer ${
            targetTab === p ? 'text-(--brand)' : 'text-(--text) hover:text-(--text-primary)'
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default PkgTabs;