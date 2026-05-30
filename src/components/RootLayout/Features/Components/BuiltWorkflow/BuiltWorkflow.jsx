import { useState, useEffect } from 'react';

const STACKS = [
  { label: 'JS + CSS',      },
  { label: 'TS + CSS',      },
  { label: 'JS + Tailwind', },
  { label: 'TS + Tailwind', },
];

const BAR_WIDTHS = [
  ['w-20', 'w-16', 'w-20'],
  ['w-20', 'w-14', 'w-16'],
  ['w-22', 'w-12', 'w-16'],
  ['w-18', 'w-20', 'w-14'],
];

export default function BuiltWorkflow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % STACKS.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full h-full mt-5 flex items-center justify-center px-4 py-3">
      <div className="w-full flex flex-col gap-1.5">
        {STACKS.map((stack, i) => {
          const on = i === active;
          return (
            <div
              key={stack.label}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg border
                transition-all duration-300 ease-in-out
                ${on
                  ? 'bg-(--bg-button) border-(--border-button)'
                  : 'bg-transparent border-(--border-secondary)'
                }
              `}
            >
              {/* dot */}
              <div
                className={`
                  w-1.5 h-1.5 rounded-full shrink-0
                  transition-all duration-300
                  ${on ? 'bg-(--bg-white)/70 scale-125' : 'bg-(--bg-white)/15'}
                `}
              />

              {/* label */}
              <span
                className={`
                  text-[11px] font-medium w-20 shrink-0
                  transition-colors duration-300
                  ${on ? 'text-(--text-primary)' : 'text-(--text-muted)'}
                `}
              >
                {stack.label}
              </span>

              {/* skeleton bars */}
              <div className="flex gap-1.5 items-center flex-1">
                {BAR_WIDTHS[i].map((w, j) => (
                  <div
                    key={j}
                    className={`
                      h-1 rounded-full bg-(--bg-white)
                      transition-all duration-300
                      ${w}
                      ${on ? 'opacity-25' : 'opacity-8'}
                    `}
                    style={{ transitionDelay: on ? `${j * 50}ms` : '0ms' }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}