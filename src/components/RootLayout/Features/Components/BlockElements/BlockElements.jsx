import { useEffect, useState, useRef } from 'react';

const SECTIONS = [
  { id: 'nav',    delay: 0 },
  { id: 'hero',   delay: 180 },
  { id: 'cards',  delay: 420 },
  { id: 'footer', delay: 720 },
];

const CARD_WIDTHS = ['w-2/3', 'w-1/2', 'w-3/4'];

export default function BlockElements() {
  const [visible, setVisible] = useState(new Set());
  const timersRef = useRef([]);

  const clear = () => timersRef.current.forEach(clearTimeout);

  const run = () => {
    clear();
    setVisible(new Set());
    const t = [];
    SECTIONS.forEach(({ id, delay }) => {
      t.push(setTimeout(() => setVisible(v => new Set([...v, id])), delay));
    });
    t.push(setTimeout(() => setVisible(new Set()), 2800));
    t.push(setTimeout(run, 3400));
    timersRef.current = t;
  };

  useEffect(() => { run(); return clear; }, []);

  const show = id => visible.has(id);

  return (
    // ── outer: fill the h-45 slot, clip anything beyond ──
    <div className="w-full h-full mt-5 overflow-hidden flex items-center justify-center px-4 py-3">

      {/* ── Browser window — fixed height so it never overflows ── */}
      <div className="w-full  h-full bg-(--bg) rounded-md border border-(--border-secondary) flex flex-col ">

        {/* Tab bar */}
        <div
          style={{
            transition: 'opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.16,1,0.3,1)',
            opacity: show('nav') ? 1 : 0,
            transform: show('nav') ? 'translateY(0)' : 'translateY(-5px)',
          }}
          className="flex-none flex items-center gap-2 px-2.5 h-6 border-b border-(--border-secondary) shrink-0"
        >
          <div className="w-2 h-2 rounded-full bg-(--bg-white)/15" />
          <div className="flex-1 h-2.5 rounded bg-(--bg-white)/6 border border-(--border-secondary)" />
          <div className="flex gap-1 items-center">
            <div className="w-4 h-1 rounded-full bg-(--bg-white)/10" />
            <div className="w-4 h-1 rounded-full bg-(--bg-white)/10" />
            <div className="w-5 h-2.5 rounded bg-(--bg-white)/10 border border-(--border-secondary)" />
          </div>
        </div>

        {/* Page body */}
        <div className="flex-1 flex flex-col gap-1.5 p-2 min-h-0">

          {/* Hero */}
          <div
            style={{
              transition: 'opacity 480ms cubic-bezier(0.16,1,0.3,1), transform 480ms cubic-bezier(0.16,1,0.3,1)',
              opacity: show('hero') ? 1 : 0,
              transform: show('hero') ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.99)',
            }}
            className="flex-none flex flex-col items-center justify-center gap-1.5 py-2.5 rounded bg-(--bg-white)/4 border border-(--border-secondary)"
          >
            <div className="w-24 h-1.5 rounded-full bg-(--bg-white)/[0.07] overflow-hidden">
              <div className="h-full rounded-full bg-(--bg-white)/30 build-bar-1" />
            </div>
            <div className="w-16 h-1 rounded-full bg-(--bg-white)/[0.07] overflow-hidden">
              <div className="h-full rounded-full bg-(--bg-white)/15 build-bar-2" />
            </div>
            <div className="flex gap-1.5 mt-0.5">
              <div className="w-9 h-2.5 rounded-full bg-(--bg-white)/8 overflow-hidden border border-(--border-secondary)">
                <div className="h-full rounded-full bg-(--bg-white)/10 build-btn" />
              </div>
              <div className="w-6 h-2.5 rounded-full bg-(--bg-white)/5 border border-(--border-secondary)" />
            </div>
          </div>

          {/* Cards */}
          <div className="flex gap-1.5 flex-1 min-h-0">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  transition: `opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 420ms cubic-bezier(0.16,1,0.3,1)`,
                  transitionDelay: show('cards') ? `${i * 70}ms` : '0ms',
                  opacity: show('cards') ? 1 : 0,
                  transform: show('cards') ? 'translateY(0)' : 'translateY(8px)',
                }}
                className="flex-1 rounded bg-(--bg-white)/4 border border-(--border-secondary) flex flex-col justify-end p-1.5 gap-1"
              >
                <div className={`h-1 rounded-full bg-(--bg-white)/12 ${CARD_WIDTHS[i]}`} />
                <div className="w-1/3 h-1 rounded-full bg-(--bg-white)/7" />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              transition: 'opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.16,1,0.3,1)',
              opacity: show('footer') ? 1 : 0,
              transform: show('footer') ? 'translateY(0)' : 'translateY(4px)',
            }}
            className="flex-none flex items-center justify-between px-2 h-4 rounded bg-(--bg-white)/4 border border-(--border-secondary) shrink-0"
          >
            <div className="w-5 h-1 rounded-full bg-(--bg-white)/10" />
            <div className="flex gap-1">
              {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-(--bg-white)/15" />)}
            </div>
            <div className="w-4 h-1 rounded-full bg-(--bg-white)/10" />
          </div>

        </div>
      </div>
    </div>
  );
}