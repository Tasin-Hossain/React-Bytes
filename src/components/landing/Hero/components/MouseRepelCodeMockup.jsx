import { useRef, useState, useEffect } from 'react';
import { MOUSE_REPEL_PARAM_META } from '../constants/mouseRepelConfig';

const audioCtx = typeof window !== 'undefined'
  ? new (window.AudioContext || window.webkitAudioContext)()
  : null;

function playTick(up = true) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = up ? 880 : 660;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.08);
  } catch { /* empty */ }
}

function fmt(value, meta) {
  if (meta.type === 'color') return value;
  if (meta.decimals !== undefined) return Number(value).toFixed(meta.decimals);
  return String(value);
}

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}


function ColorSwatch({ value, onChange }) {
  const inputRef = useRef(null);
  const safeValue = value && value !== 'transparent' ? value : '#000000';

  return (
    <span
      className="inline-flex items-center gap-1 md:gap-1.5 cursor-pointer select-none"
      onClick={() => inputRef.current?.click()}
    >
      <span
        className="inline-block w-2.5 h-2.5 md:w-3 md:h-3 rounded-md md:rounded-md border border-(--border-secondary) shrink-0"
        style={{ background: safeValue }}
      />
      <span className="text-[#e879f9] text-[11px] md:text-sm">"{value ?? 'null'}"</span>
      <input
        ref={inputRef} type="color" value={safeValue}
        onChange={e => onChange(e.target.value)}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        tabIndex={-1}
      />
    </span>
  );
}

function ScrollableValue({ meta, value, onChange }) {
  const spanRef = useRef(null);
  const [active, setActive] = useState(false);
  const stateRef = useRef({ value, onChange, meta });
  useEffect(() => { stateRef.current = { value, onChange, meta }; });

  const touchRef = useRef({ startY: 0, startVal: 0, dragging: false });

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    function handleWheel(e) {
      e.preventDefault(); e.stopPropagation();
      const { value, onChange, meta } = stateRef.current;
      const dir = e.deltaY < 0 ? 1 : -1;
      const next = clamp(parseFloat((value + dir * meta.scrollStep).toFixed(10)), meta.min, meta.max);
      if (next !== value) { playTick(dir === 1); onChange(next); }
    }
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  function onTouchStart(e) {
    touchRef.current = { startY: e.touches[0].clientY, startVal: stateRef.current.value, dragging: true };
    setActive(true);
  }
  function onTouchMove(e) {
    if (!touchRef.current.dragging) return;
    e.preventDefault();
    const { startY, startVal } = touchRef.current;
    const { meta, onChange } = stateRef.current;
    const steps = Math.round((startY - e.touches[0].clientY) / 8);
    const next = clamp(parseFloat((startVal + steps * meta.scrollStep).toFixed(10)), meta.min, meta.max);
    if (next !== stateRef.current.value) { playTick(next > stateRef.current.value); onChange(next); }
  }
  function onTouchEnd() { touchRef.current.dragging = false; setActive(false); }

  function step(dir) {
    const { value, onChange, meta } = stateRef.current;
    const next = clamp(parseFloat((value + dir * meta.scrollStep).toFixed(10)), meta.min, meta.max);
    if (next !== value) { playTick(dir === 1); onChange(next); }
  }

  return (
    <span className="inline-flex items-center gap-0.5">
      <button
        onPointerDown={e => { e.preventDefault(); step(-1); }}
        className="inline-flex w-5 h-5 md:w-4 md:h-4 items-center justify-center rounded bg-(--bg-button) cursor-pointer text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-white)/10 text-[10px] md:text-xs leading-none select-none transition-colors"
        tabIndex={-1}
      >−</button>

      <span
        ref={spanRef}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`
          inline-block cursor-ns-resize select-none rounded px-1 transition-colors duration-150 touch-none
          ${active ? 'bg-(--bg-white)/10 outline outline-[#7a5af8]/60' : ''}
        `}
        title="Scroll or drag to change"
      >
        <span className="text-[#7dd3fc] text-[11px] md:text-sm">{fmt(value, meta)}</span>
      </span>

      <button
        onPointerDown={e => { e.preventDefault(); step(1); }}
        className="inline-flex w-5 h-5 md:w-4 md:h-4 items-center justify-center rounded bg-(--bg-button) cursor-pointer text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-white)/10 text-[10px] md:text-xs leading-none select-none transition-colors"
        tabIndex={-1}
      >+</button>
    </span>
  );
}

function PropLine({ meta, value, onChange }) {
  return (
    <div className="flex items-center gap-1 leading-6 md:leading-7 flex-wrap">
      <span className="pl-3 md:pl-8 text-[#93c5fd] text-[10px] md:text-sm">{meta.label}</span>
      <span className="text-(--text-muted) text-[10px] md:text-sm">=</span>

      {meta.type === 'color' ? (
        <ColorSwatch value={value} onChange={onChange} />

      ) : meta.type === 'boolean' ? (
        <span className="text-(--text-muted) inline-flex items-center gap-0.5 text-[10px] md:text-sm">
          {'{ '}
          <span
            onClick={() => onChange(!value)}
            className="text-[#7dd3fc] cursor-pointer px-1 rounded hover:bg-(--bg-white)/10 transition-colors select-none"
            title="Click to toggle"
          >
            {String(value)}
          </span>
          {' }'}
        </span>

      ) : meta.type === 'select' ? (
        <span className="text-(--text-muted) inline-flex items-center gap-0.5 text-[10px] md:text-sm">
          {'{ '}
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="text-[#e879f9] bg-(--bg) border-none outline-none cursor-pointer font-mono text-[10px] md:text-sm max-w-[100px] md:max-w-none"
          >
            {meta.options.map(opt => (
              <option key={opt} value={opt} style={{ background: 'var(--bg)' }}>
                "{opt}"
              </option>
            ))}
          </select>
          {' }'}
        </span>

      ) : (
        <span className="text-(--text-muted) inline-flex items-center gap-0.5 text-[10px] md:text-sm">
          {'{ '}
          <ScrollableValue meta={meta} value={value} onChange={onChange} />
          {' }'}
        </span>
      )}
    </div>
  );
}

export default function MouseRepelCodeMockup({ params, onParamChange, embedded = false }) {
  return (
    <>
      <div
      className={`
        w-full rounded-md border border-(--border-secondary)
        bg-(--bg) overflow-hidden 
        ${embedded ? '' : 'mt-8 md:mt-14 max-w-full md:max-w-xl mx-auto px-2 md:px-0'}
      `}
      style={embedded ? {} : { animation: 'fadeUp 0.7s 0.4s ease both', opacity: 0 }}
    >
      {/* Window chrome */}
      <div className="flex items-center h-10 gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-3 border-b border-(--border-secondary) bg-(--bg-white)/2">
        <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#ff5f57] shrink-0" />
        <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#febc2e] shrink-0" />
        <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#28c840] shrink-0" />
        <span className="ml-2 md:ml-3 text-[9px] md:text-xs text-(--text-muted) truncate">MouseRepelDots.jsx</span>
      </div>



      {/* Code body */}
      <div className="code-scroll px-2 md:px-4 py-3 md:py-4 font-mono text-(--text-primary) leading-6 md:leading-7 overflow-auto" style={{ minHeight: '200px', maxHeight: '400px' }}>
        <div className="text-[9px] md:text-sm">
          <span className="text-[#c084fc]">import</span>
          <span className="text-(--text-muted)"> {'{ '}</span>
          <span className="text-[#86efac]">MouseRepelDots</span>
          <span className="text-(--text-muted)">{' }'}</span>
          <span className="text-[#c084fc]"> from</span>
          <span className="text-[#fbbf24]"> '@components/MouseRepelDots'</span>
          <span className="text-(--text-muted)">;</span>
        </div>

        <div className="mt-2 md:mt-3 text-[9px] md:text-sm">
          <div>
            <span className="text-[#c084fc]">function </span>
            <span className="text-[#86efac]">App</span>
            <span className="text-(--text-muted)">() {'{'}</span>
          </div>
          <div className="pl-3 md:pl-4">
            <span className="text-[#c084fc]">return </span>
            <span className="text-(--text-muted)">(</span>
          </div>
          <div className="pl-3 md:pl-8">
            <span className="text-[#f87171]">{'<'}</span>
            <span className="text-[#86efac]">MouseRepelDots</span>
          </div>

          {MOUSE_REPEL_PARAM_META.map(meta => (
            <PropLine
              key={meta.key}
              meta={meta}
              value={params[meta.key]}
              onChange={val => onParamChange(meta.key, val)}
            />
          ))}

          <div className="pl-3 md:pl-8">
            <span className="text-[#f87171]">/{'>'}</span>
          </div>
          <div className="pl-3 md:pl-4">
            <span className="text-(--text-muted)">)</span>
          </div>
          <div>
            <span className="text-(--text-muted)">{'}'}</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
