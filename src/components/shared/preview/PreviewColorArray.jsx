import { useRef, useState, useCallback, useEffect } from 'react';

// ── helpers (same as PreviewColorPickerCustom) ──────────────────────────────
function hsvToHex(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r, g, b;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  const toHex = n => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsv(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let hue = 0;
  if (d > 0) {
    if (max === r)      hue = 60 * (((g - b) / d) % 6);
    else if (max === g) hue = 60 * ((b - r) / d + 2);
    else                hue = 60 * ((r - g) / d + 4);
  }
  if (hue < 0) hue += 360;
  return { h: hue, s: max === 0 ? 0 : d / max, v: max };
}

const SWATCH_PRESETS = [
  '#A855F7','#7C3AED','#6366F1','#3B82F6','#06B6D4','#10B981',
  '#84CC16','#EAB308','#F97316','#EF4444','#EC4899','#F43F5E',
  '#ffffff','#94a3b8','#000000',
];

const MAX_COLORS = 8;

// ── PreviewColorArray ───────────────────────────────────────────────────────
const PreviewColorArray = ({ title = 'hoverColors', colors, onChange }) => {
  // internal copy so we can mutate freely
  const [arr, setArr] = useState(() =>
    Array.isArray(colors) && colors.length ? [...colors] : ['#A855F7', '#3B82F6', '#10B981']
  );
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [pickerOpen, setPickerOpen]   = useState(false);
  const [hsv, setHsv]                 = useState(() => hexToHsv(arr[0]));
  const [hexText, setHexText]         = useState(arr[0]);

  const wrapRef  = useRef(null);
  const areaRef  = useRef(null);
  const hueRef   = useRef(null);

  // sync upward
  useEffect(() => { onChange?.(arr); }, [arr]);   // eslint-disable-line react-hooks/exhaustive-deps

  // close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setPickerOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [pickerOpen]);

  // ── helpers ──
  const commitHsv = useCallback((next, idx = selectedIdx) => {
    const hex = hsvToHex(next.h, next.s, next.v);
    setHsv(next);
    setHexText(hex);
    setArr(prev => {
      const copy = [...prev];
      copy[idx] = hex;
      return copy;
    });
  }, [selectedIdx]);

  const selectSwatch = (i) => {
    setSelectedIdx(i);
    const next = hexToHsv(arr[i]);
    setHsv(next);
    setHexText(hsvToHex(next.h, next.s, next.v));
    setPickerOpen(true);
  };

  const addColor = () => {
    if (arr.length >= MAX_COLORS) return;
    const newColor = '#ffffff';
    const newArr = [...arr, newColor];
    setArr(newArr);
    const newIdx = newArr.length - 1;
    setSelectedIdx(newIdx);
    setHsv(hexToHsv(newColor));
    setHexText(newColor);
    setPickerOpen(true);
  };

  const removeColor = (i, e) => {
    e.stopPropagation();
    const newArr = arr.filter((_, idx) => idx !== i);
    if (newArr.length === 0) { setPickerOpen(false); setArr(['#A855F7']); return; }
    const nextIdx = Math.min(selectedIdx, newArr.length - 1);
    setArr(newArr);
    setSelectedIdx(nextIdx);
    setHsv(hexToHsv(newArr[nextIdx]));
    setHexText(newArr[nextIdx]);
  };

  // ── SV area drag ──
  const dragArea = useCallback(e => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = {
      ...hsv,
      s: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      v: Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height)),
    };
    commitHsv(next);
  }, [hsv, commitHsv]);

  const onAreaDown = useCallback(e => {
    e.preventDefault();
    dragArea(e);
    const onMove = ev => dragArea(ev);
    const onUp   = () => { document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [dragArea]);

  // ── Hue bar drag ──
  const dragHue = useCallback(e => {
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = { ...hsv, h: Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360)) };
    commitHsv(next);
  }, [hsv, commitHsv]);

  const onHueDown = useCallback(e => {
    e.preventDefault();
    dragHue(e);
    const onMove = ev => dragHue(ev);
    const onUp   = () => { document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [dragHue]);

  // ── derived ──
  const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v);
  const hueColor   = hsvToHex(hsv.h, 1, 1);

  return (
    <div ref={wrapRef} className="relative h-9! w-full">

      {/* Trigger row — same pattern as PreviewColorPickerCustom */}
      <button
        type="button"
        onClick={() => setPickerOpen(o => !o)}
        className="w-full h-9! flex items-center justify-between gap-2 bg-(--bg-elevated)
          border border-(--border-secondary) rounded-md px-3 cursor-pointer
          transition-colors duration-150"
      >
        <span className="text-[12px] text-(--text-muted)">{title}</span>

        {/* Mini swatch strip */}
        <span className="flex items-center gap-1">
          {arr.map((c, i) => (
            <span
              key={i}
              className="w-4 h-4 rounded shrink-0"
              style={{ background: c }}
            />
          ))}
        </span>
      </button>

      {/* Dropdown */}
      {pickerOpen && (
        <div
          className="absolute top-[calc(100%+4px)] left-0 right-0 z-50
            border border-(--border-secondary) rounded-md p-3
            shadow-(--shadow-dropdown)"
          style={{ background: 'var(--bg-elevated)' }}
        >

          {/* ── Swatch strip with + button ── */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {arr.map((c, i) => (
              <div
                key={i}
                onClick={() => selectSwatch(i)}
                className={`relative w-7 h-7 rounded-md cursor-pointer transition-transform
                  duration-150 hover:scale-110 group
                  ${i === selectedIdx ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent' : ''}`}
                style={{ background: c }}
              >
                {/* remove ×  */}
                <span
                  onClick={e => removeColor(i, e)}
                  className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full
                    items-center justify-center text-[9px] text-white leading-none cursor-pointer
                    hidden group-hover:flex"
                >
                  ×
                </span>
              </div>
            ))}

            {arr.length < MAX_COLORS && (
              <button
                type="button"
                onClick={addColor}
                className="w-7 h-7 rounded-md border border-dashed border-(--border-secondary)
                  text-(--text-muted) text-lg flex items-center justify-center cursor-pointer
                  transition-colors duration-150 hover:border-(--brand) hover:text-purple-400
                  bg-transparent"
              >
                +
              </button>
            )}
          </div>

          {/* ── SV area ── */}
          <div
            ref={areaRef}
            onPointerDown={onAreaDown}
            className="relative w-full h-36 rounded-lg cursor-crosshair mb-2.5"
            style={{
              background: `linear-gradient(to top, #000, transparent),
                           linear-gradient(to right, #fff, ${hueColor})`,
            }}
          >
            <div
              className="absolute w-3.5 h-3.5 rounded-full border border-(--bg-white) pointer-events-none"
              style={{
                left: `${hsv.s * 100}%`,
                top:  `${(1 - hsv.v) * 100}%`,
                boxShadow: '0 0 4px rgba(0,0,0,.6)',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          {/* ── Hue bar ── */}
          <div
            ref={hueRef}
            onPointerDown={onHueDown}
            className="relative w-full h-3.5 rounded-full cursor-pointer mb-2.5"
            style={{
              background: 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)',
            }}
          >
            <div
              className="absolute w-3.5 h-3.5 rounded-full border border-(--bg-white) pointer-events-none"
              style={{
                left: `${(hsv.h / 360) * 100}%`,
                top: '50%',
                boxShadow: '0 0 4px rgba(0,0,0,.6)',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          {/* ── Hex input row ── */}
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className="w-5 h-5 rounded shrink-0"
              style={{ background: currentHex }}
            />
            <input
              className="flex-1 text-[13px] text-(--text-primary) bg-(--bg-elevated)
                border border-(--border-secondary) rounded px-2 py-0.5 outline-none!
                focus:border-(--bg-secondary) "
              type="text"
              value={hexText}
              onChange={e => {
                setHexText(e.target.value);
                if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                  const next = hexToHsv(e.target.value);
                  commitHsv(next);
                }
              }}
              maxLength={7}
            />
          </div>

          {/* ── Preset swatches ── */}
          <div className="flex flex-wrap gap-1.5">
            {SWATCH_PRESETS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  const next = hexToHsv(c);
                  commitHsv(next);
                  setHexText(c);
                }}
                className="w-5 h-5 rounded cursor-pointer p-0 transition-transform hover:scale-110"
                style={{
                  background: c,
                  border: currentHex.toLowerCase() === c.toLowerCase()
                    ? '2px solid #fff'
                    : '1px solid var(--border-primary)',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewColorArray;