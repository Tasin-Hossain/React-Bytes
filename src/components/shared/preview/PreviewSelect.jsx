import { useRef, useState, useEffect, useMemo } from 'react';

const PreviewSelect = ({
  label = '',
  options = [],
  value = '',
  isDisabled = false,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Support both string[] and { value, label }[]
  const normalizedOptions = useMemo(
    () =>
      options.map((o) =>
        typeof o === 'string' ? { value: o, label: o } : o
      ),
    [options]
  );

  const labelMap = useMemo(
    () =>
      normalizedOptions.reduce((map, opt) => {
        map[opt.value] = opt.label;
        return map;
      }, {}),
    [normalizedOptions]
  );

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onClick);
    return () => document.removeEventListener('pointerdown', onClick);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        onClick={() => !isDisabled && setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 bg-(--bg-elevated)
          border border-(--border-secondary) rounded-md px-3 py-2 cursor-pointer transition-colors duration-150
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-[12px] text-(--text-muted) truncate ">{label}</span>
        <span className="flex items-center gap-1.5">
          <span className="text-[13px] text-(--text-primary) truncate ">
            {labelMap[value] || value}
          </span>
          <svg
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            className={`text-(--text-muted) transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-md border
          border-(--bg-white)/10 bg-(--bg-elevated) overflow-hidden">
          {normalizedOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange?.(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-[13px] transition-colors duration-100
                hover:bg-(--bg-white)/5 cursor-pointer
                ${opt.value === value
                  ? 'text-(--brand) bg-(--brand)/10'
                  : 'text-(--text-muted)'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewSelect;
