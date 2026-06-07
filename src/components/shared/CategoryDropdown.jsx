import { useRef, useState, useEffect } from 'react';

const CategoryDropdown = ({ value, onChange, options = [] }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onClick);
    return () => document.removeEventListener('pointerdown', onClick);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 h-9 px-3 rounded-md border border-(--border-secondary)
           text-sm text-(--text-muted) hover:text-(--text-primary)
          transition-colors duration-150 cursor-pointer whitespace-nowrap"
      >
        <span className="text-[13px] text-(--text-muted)">{value}</span>
        <svg
          width="14" height="14" viewBox="0 0 16 16" fill="none"
          className={`text-(--text-muted) transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 p-1 top-full mt-1 z-50 w-35 rounded-md border
          border-(--border-secondary) bg-(--bg-card) overflow-hidden">
          {options.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => { onChange(cat); setOpen(false); }}
              className={`w-full text-center py-2 text-sm transition-colors duration-100
                hover:bg-(--bg-white)/5 cursor-pointer rounded-md
                ${cat === value
                  ? 'text-(--brand)'
                  : 'text-(--text-muted)'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;