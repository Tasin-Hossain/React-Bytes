import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';

/* ---------- Inline icons ---------- */
const JsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <rect width="24" height="24" rx="4" fill="#F7DF1E" />
    <path
      d="M12.5 17.4c.3.6.8 1 1.6 1 .9 0 1.4-.5 1.4-1.2 0-.8-.5-1.1-1.5-1.5l-.5-.2c-1.5-.6-2.5-1.4-2.5-3 0-1.5 1.1-2.6 2.9-2.6 1.3 0 2.2.4 2.8 1.6l-1.6 1c-.3-.6-.7-.8-1.2-.8-.6 0-.9.3-.9.8 0 .5.3.8 1.2 1.2l.5.2c1.7.7 2.7 1.5 2.7 3.1 0 1.8-1.4 2.8-3.3 2.8-1.9 0-3-.9-3.6-2z"
      fill="#000"
    />
    <path
      d="M7.5 17.4c.3.5.6.9 1.2.9.6 0 1-.2 1-1.2v-6.1h2.1v6.2c0 1.9-1.1 2.8-2.7 2.8-1.5 0-2.3-.7-2.7-1.7z"
      fill="#000"
    />
  </svg>
);

const TsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <rect width="24" height="24" rx="4" fill="#3178C6" />
    <path
      d="M12.9 12.4H10v1.6h1.7v6h1.9v-6h1.7v-1.6zM17.3 12.2c-1.5 0-2.4.8-2.4 2 0 1.1.7 1.6 1.9 2.1.8.3 1.1.5 1.1.9 0 .4-.3.6-.9.6-.6 0-1.1-.3-1.5-.7l-1 1.2c.6.7 1.5 1.1 2.5 1.1 1.6 0 2.6-.8 2.6-2.1 0-1.1-.6-1.6-1.9-2.1-.8-.3-1.1-.5-1.1-.9 0-.3.3-.5.7-.5.5 0 .9.2 1.3.6l1-1.1c-.5-.6-1.3-1.1-2.3-1.1z"
      fill="#fff"
    />
  </svg>
);

const CssIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path d="M3 2l1.7 18.5L12 22l7.3-1.5L21 2H3z" fill="#1572B6" />
    <path d="M12 20.3l5.9-1.2 1.4-15.4H12v16.6z" fill="#33A9DC" />
    <path
      d="M12 10.3H8.6l-.2-2.4H12V5.7H6l.6 6.8H12v-2.2zM12 15.9l-2.5-.7-.2-1.8H7.1l.3 3.3 4.6 1.3v-2.1z"
      fill="#fff"
    />
    <path
      d="M12 10.3v2.2h3.1l-.3 3.2-2.8.7v2.1l4.6-1.3.5-6.9H12zM12 5.7v2.2h5.7l.2-2.2H12z"
      fill="#EBEBEB"
    />
  </svg>
);

const TailwindIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path
      d="M12 6.4c-2.6 0-4.2 1.3-4.8 3.8.9-1.3 2-1.8 3.3-1.5.7.2 1.2.7 1.8 1.3.9 1 2 2.1 4.3 2.1 2.6 0 4.2-1.3 4.8-3.8-.9 1.3-2 1.8-3.3 1.5-.7-.2-1.2-.7-1.8-1.3-.9-1-2-2.1-4.3-2.1zM7.2 12c-2.6 0-4.2 1.3-4.8 3.8.9-1.3 2-1.8 3.3-1.5.7.2 1.2.7 1.8 1.3.9 1 2 2.1 4.3 2.1 2.6 0 4.2-1.3 4.8-3.8-.9 1.3-2 1.8-3.3 1.5-.7-.2-1.2-.7-1.8-1.3-.9-1-2-2.1-4.3-2.1z"
      fill="#38BDF8"
    />
  </svg>
);

/* ---------- Config ---------- */
const LANG_OPTIONS = [
  { value: 'js', label: 'JS', icon: JsIcon },
  { value: 'ts', label: 'TS', icon: TsIcon }
];

const STYLE_OPTIONS = [
  { value: 'css', label: 'CSS', icon: CssIcon },
  { value: 'tailwind', label: 'TW', icon: TailwindIcon }
];

/* ---------- Reusable sliding pill group ---------- */
const PillGroup = ({ options, active, onChange }) => {
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

  const handleClick = (v) => {
    onChange(v);
    gsap.fromTo(
      btnRefs.current[v],
      { scale: 0.9 },
      { scale: 1, duration: 0.3, ease: 'back.out(3)' }
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseLeave={() => setHovered(null)}
      className="relative inline-flex items-center rounded-md border border-(--border-secondary) bg-(--bg-card) p-1"
    >
      <div
        ref={indicatorRef}
        className="absolute top-1 bottom-1 left-0 rounded bg-(--bg-button) border border-(--border-button) pointer-events-none"
      />

      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          ref={(el) => (btnRefs.current[value] = el)}
          onClick={() => handleClick(value)}
          onMouseEnter={() => setHovered(value)}
          className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1 rounded text-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
            targetTab === value ? 'text-(--text-primary)' : 'text-(--text-muted)'
          }`}
        >
          <Icon />
          {label}
        </button>
      ))}
    </div>
  );
};

/* ---------- VariantSwitcher ---------- */
const VariantSwitcher = ({ langTab, setLangTab, styleTab, setStyleTab }) => {
  const normalizedLang = langTab === 'ts' || langTab === 'typescript' ? 'ts' : 'js';
  const normalizedStyle = styleTab === 'tw' || styleTab === 'tailwind' ? 'tailwind' : 'css';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <PillGroup options={LANG_OPTIONS} active={normalizedLang} onChange={setLangTab} />
      <PillGroup options={STYLE_OPTIONS} active={normalizedStyle} onChange={setStyleTab} />
    </div>
  );
};

export default VariantSwitcher;