import { useEffect, useState } from 'react';

const BLOCKS = [
  { id: 'nav', h: 'h-6', w: 'w-full', delay: 0 },
  { id: 'hero', h: 'h-14', w: 'w-full', delay: 150 },
  { id: 'cards', h: null, w: 'w-full', delay: 560, isRow: true },
  { id: 'footer', h: 'h-6', w: 'w-full', delay: 750 }
];

const CARD_COLORS = ['bg-(--bg-button)', 'bg-(--bg-button)', 'bg-(--bg-button)'];

export default function BlockElements() {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const timers = BLOCKS.map(b =>
      setTimeout(() => {
        setVisible(v => [...v, b.id]);
      }, b.delay)
    );

    // restart loop
    const loop = setTimeout(() => {
      setVisible([]);
      // small gap then re-trigger
    }, 2800);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(loop);
    };
  }, [visible.length === 0 ? 0 : null]);

  // restart when all shown — wait a beat then reset
  useEffect(() => {
    if (visible.length === BLOCKS.length) {
      const t = setTimeout(() => setVisible([]), 1800);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const show = id => visible.includes(id);

  return (
    <div className="w-full h-full flex items-center justify-center px-4 pt-4 ">
      <div className="w-full flex flex-col gap-2">
        {/* Nav */}
        <div
          className={`
            ${BLOCKS[0].h} w-full rounded-[5px]
            bg-(--bg-button) border border-(--border-button)
            flex items-center px-3 gap-2
            transition-all duration-300 ease-out
            ${show('nav') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
          `}
        >
          <div className="w-8 h-1 rounded-full bg-(--text-primary)/10" />
          <div className="flex-1" />
          <div className="w-4 h-1.5 rounded-full bg-(--text-primary)/10" />
          <div className="w-4 h-1.5 rounded-full bg-(--text-primary)/10" />
          <div className="w-4 h-1.5 rounded-full bg-(--text-primary)/10" />
          <div className="w-6 h-3 rounded-md bg-(--text-primary)/10 border border-(--border-button)" />
        </div>

        {/* Hero */}
        <div
          className={`
            ${BLOCKS[1].h} w-full rounded-md
            bg-(--bg-button) border border-(--border-button)
            flex flex-col items-center justify-center gap-1.5
            transition-all duration-300 ease-out
            ${show('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}
        >
          <div className="w-3/5 h-2 rounded-full bg-(--text-primary)/15" />
          <div className="w-2/5 h-1.5 rounded-full bg-(--text-primary)/10" />
        </div>

        {/* Cards row */}
        <div
          className={`
          w-full grid grid-cols-3 gap-2
          transition-all duration-500 ease-out
          ${show('cards') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
        >
          {CARD_COLORS.map((bg, i) => (
            <div
              key={i}
              className={`
                h-10 rounded-[5px]  border border-(--border-button)
                flex flex-col justify-end p-1.5 gap-1
                ${bg}
                transition-all duration-300 ease-out
                ${show('cards') ? 'opacity-100' : 'opacity-0'}
              `}
              style={{ transitionDelay: show('cards') ? `${i * 60}ms` : '0ms' }}
            >
              <div className="w-3/4 h-1 rounded-full bg-(--text-primary)/10" />
              <div className="w-1/2 h-1 rounded-full bg-(--text-primary)/10" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className={`
          h-5 w-full rounded-[5px]
          bg-(--bg-button) border border-(--border-button)
          flex items-center justify-between px-3
          transition-all duration-300 ease-out
          ${show('footer') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
        `}
        >
          <div className="w-8 h-1 rounded-full bg-(--text-primary)/10" />
          <div className="flex gap-1.5">
            <div className="w-4 h-1 rounded-full bg-(--text-primary)/10" />
            <div className="w-4 h-1 rounded-full bg-(--text-primary)/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
