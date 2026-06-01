import { useEffect, useRef, useState } from 'react';

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className=" flex items-center gap-2 px-3 py-1.5 rounded-md border border-(--border-secondary) bg-(--bg-card) text-(--text-muted) text-xs hover:text-(--text-secondary) hover:border-(--border-primary) transition-all duration-150 select-none overflow-visible"
      >
        <span>{value}</span>

        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform duration-200 shrink-0 ${
            open ? 'rotate-180' : ''
          }`}
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50! min-w-30 rounded-md border border-(--border-secondary) bg-(--bg-card) overflow-visible"
        >

          <div className="p-1.5 flex flex-col gap-1.5 ">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors duration-100 ${
                  option === value
                    ? 'text-(--text-primary) bg-(--bg-hover)'
                    : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-hover)'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                    option === value
                      ? 'bg-(--brand)'
                      : 'bg-(--border-secondary)'
                  }`}
                />

                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}