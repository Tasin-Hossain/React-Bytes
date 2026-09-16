import { useRef, useState, useEffect } from 'react';
import FlagIcon from '../ui/flag-icon';

// options can be plain strings (e.g. sort labels — no flag) or
// { label, code } objects (e.g. country names with an ISO flag code).
// Normalizing here means every caller can stay simple.
const normalizeOption = opt => (typeof opt === 'string' ? { label: opt, code: null } : opt);

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

  const normalized = options.map(normalizeOption);
  const selected = normalized.find(o => o.label === value);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 h-9 px-3 rounded-md border bg-(--bg-button) border-(--border-secondary)
           text-sm text-(--text-muted) hover:text-(--text-primary)
          transition-colors duration-150 cursor-pointer whitespace-nowrap"
      >
        {selected?.code && (
          <FlagIcon code={selected.code} className="h-3 w-4.5 shrink-0 rounded-xs object-cover" />
        )}
        <span className="text-[13px] text-(--text-muted)">{value}</span>
        <svg
          width="14" height="14" viewBox="0 0 16 16" fill="none"
          className={`text-(--text-muted) transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 p-1 top-full mt-1 z-50 w-40 rounded-md border
          border-(--border-secondary) bg-(--bg-card) overflow-hidden">
          {normalized.map(opt => (
            <button
              key={opt.label}
              type="button"
              onClick={() => { onChange(opt.label); setOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors duration-100
                hover:bg-(--bg-white)/5 cursor-pointer
                ${opt.label === value
                  ? 'text-(--brand)'
                  : 'text-(--text-muted)'
                }`}
            >
              {opt.code && (
                <FlagIcon code={opt.code} className="h-3 w-4.5 shrink-0 rounded-xs object-cover" />
              )}
              <span className="truncate">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;