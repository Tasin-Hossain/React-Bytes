import { useRef, useState, useEffect } from 'react';
import { MOUSE_REPEL_PARAM_META } from '../constants/mouseRepelConfig';

// ── Audio 
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
  } catch {}
}

function fmt(value, meta) {
  if (meta.type === 'color') return value;
  if (meta.decimals !== undefined) return Number(value).toFixed(meta.decimals);
  return String(value);
}

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

// ── Mini Live Preview (mobile only) 
function MiniPreview({ params }) {
  const canvasRef = useRef(null);
  const propsRef = useRef(params);

  useEffect(() => { propsRef.current = params; });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const COUNT = 100;
    const COLS = Math.ceil(Math.sqrt(COUNT * W / H));
    const ROWS = Math.ceil(COUNT / COLS);
    const gx = W / COLS, gy = H / ROWS;
    const dots = [];
    outer: for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        if (dots.length >= COUNT) break outer;
        const ox = gx * i + gx / 2 + (Math.random() - 0.5) * gx * 0.3;
        const oy = gy * j + gy / 2 + (Math.random() - 0.5) * gy * 0.3;
        dots.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0 });
      }
    }

    let mouse = { x: -9999, y: -9999 };
    let animId;

    function draw() {
      const { repelRadius, force, springK, damping, dotColor, dotColorMid, dotColorHot, minDotSize, maxDotSize } = propsRef.current;
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        const dx = d.x - mouse.x, dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        if (dist < repelRadius) {
          const f = ((repelRadius - dist) / repelRadius) * force;
          d.vx += (dx / dist) * f; d.vy += (dy / dist) * f;
        }
        d.vx += (d.ox - d.x) * springK; d.vy += (d.oy - d.y) * springK;
        d.vx *= damping; d.vy *= damping;
        d.x += d.vx; d.y += d.vy;
        const displaced = Math.sqrt((d.x - d.ox) ** 2 + (d.y - d.oy) ** 2);
        const energy = Math.min(displaced / repelRadius, 1);
        const r = minDotSize + energy * (maxDotSize - minDotSize);
        const alpha = 0.2 + energy * 0.75;
        const color = energy > 0.6 ? dotColorHot : energy > 0.25 ? dotColorMid : dotColor;
        ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.globalAlpha = alpha; ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.x = (clientX - rect.left) * (W / rect.width);
      mouse.y = (clientY - rect.top) * (H / rect.height);
    }
    function onLeave() { mouse.x = -9999; mouse.y = -9999; }

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('touchmove', onMove, { passive: true });
    canvas.addEventListener('touchend', onLeave);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('touchend', onLeave);
    };
  }, []);

  return (
    <div className="sm:hidden px-4 pt-4">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-(--border-secondary)"
        style={{ height: 120, background: 'var(--bg)', cursor: 'crosshair', touchAction: 'none' }}
      />
      <p className="text-[10px] text-(--text-muted) font-mono mt-1.5">
        ☝ touch to preview repel effect
      </p>
    </div>
  );
}

// ── ColorSwatch 
function ColorSwatch({ value, onChange }) {
  const inputRef = useRef(null);
  return (
    <span
      className="inline-flex items-center gap-1.5 cursor-pointer select-none"
      onClick={() => inputRef.current?.click()}
    >
      <span
        className="inline-block w-3 h-3 rounded-[3px] border border-(--border-secondary) shrink-0"
        style={{ background: value }}
      />
      <span className="text-[#e879f9]">"{value}"</span>
      <input
        ref={inputRef} type="color" value={value}
        onChange={e => onChange(e.target.value)}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        tabIndex={-1}
      />
    </span>
  );
}

// ── ScrollableValue 
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
      {/* Desktop ±  */}
      <button
        onPointerDown={e => { e.preventDefault(); step(-1); }}
        className="hidden bg-(--bg-button) cursor-pointer sm:inline-flex w-4 h-4 items-center justify-center rounded text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-white)/10 text-xs leading-none select-none transition-colors"
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
          inline-block  cursor-ns-resize select-none rounded px-0.75 transition-colors duration-150 touch-none
          ${active ? 'bg-(--bg-white)/10 outline outline-[#7a5af8]/60' : ''}
        `}
        title="Scroll or drag to change"
      >
        <span className="text-[#7dd3fc]">{fmt(value, meta)}</span>
      </span>

      <button
        onPointerDown={e => { e.preventDefault(); step(1); }}
        className="hidden bg-(--bg-button) cursor-pointer sm:inline-flex w-4 h-4 items-center justify-center rounded text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-white)/10 text-xs leading-none select-none transition-colors"
        tabIndex={-1}
      >+</button>

      {/* Mobile ± */}
      <button
        onPointerDown={e => { e.preventDefault(); step(-1); }}
        className="sm:hidden inline-flex w-6 h-6 items-center justify-center rounded-md bg-(--bg-white)/6 text-(--text-muted) active:bg-(--bg-white)/20 text-sm select-none"
        tabIndex={-1}
      >−</button>
      <button
        onPointerDown={e => { e.preventDefault(); step(1); }}
        className="sm:hidden inline-flex w-6 h-6 items-center justify-center rounded-md bg-(--bg-white)/6 text-(--text-muted) active:bg-(--bg-white)/20 text-sm select-none"
        tabIndex={-1}
      >+</button>
    </span>
  );
}

// ── PropLine 
function PropLine({ meta, value, onChange }) {
  return (
    <div className="flex items-center gap-1 leading-7">
      <span className="pl-8 text-[#93c5fd]">{meta.label}</span>
      <span className="text-(--text-muted)">=</span>
      {meta.type === 'color' ? (
        <ColorSwatch value={value} onChange={onChange} />
      ) : (
        <span className="text-(--text-muted) inline-flex items-center gap-0.5">
          {'{ '}
          <ScrollableValue meta={meta} value={value} onChange={onChange} />
          {' }'}
        </span>
      )}
    </div>
  );
}

// ── Main
export default function MouseRepelCodeMockup({ params, onParamChange, embedded = false }) {
  return (
    <div
      className={`
        w-full rounded-xl border border-(--border-secondary)
        bg-(--bg) overflow-hidden shadow-2xl
        ${embedded ? '' : 'mt-14 max-w-xl mx-auto'}
      `}
      style={embedded ? {} : { animation: 'fadeUp 0.7s 0.4s ease both', opacity: 0 }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-(--border-secondary) bg-(--bg-white)/2">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-(--text-muted) ">MouseRepelDots.jsx</span>
      </div>

      {/* Mini preview — mobile only */}
      {embedded && <MiniPreview params={params} />}

      {/* Code body */}
      <div className="px-4 py-4 font-mono text-sm text-(--text-primary) leading-7 overflow-x-auto">
        {/* import line */}
        <div>
          <span className="text-[#c084fc]">import</span>
          <span className="text-(--text-muted)"> {'{ '}</span>
          <span className="text-[#86efac]">MouseRepelDots</span>
          <span className="text-(--text-muted)">{' }'}</span>
          <span className="text-[#c084fc]"> from</span>
          <span className="text-[#fbbf24]"> '@components/MouseRepelDots'</span>
          <span className="text-(--text-muted)">;</span>
        </div>

        <div className="mt-3">
          <div>
            <span className="text-[#c084fc]">function </span>
            <span className="text-[#86efac]">App</span>
            <span className="text-(--text-muted)">() {'{'}</span>
          </div>
          <div className="pl-4">
            <span className="text-[#c084fc]">return </span>
            <span className="text-(--text-muted)">(</span>
          </div>
          <div className="pl-8">
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

          <div className="pl-8">
            <span className="text-[#f87171]">/{'>'}</span>
          </div>
          <div className="pl-4">
            <span className="text-(--text-muted)">)</span>
          </div>
          <div>
            <span className="text-(--text-muted)">{'}'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
