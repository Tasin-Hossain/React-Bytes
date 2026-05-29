import { useEffect, useRef } from 'react';

function fmt(v) {
  return Number.isInteger(v) ? String(v) : parseFloat(v.toFixed(4)).toString();
}

export default function OrbitDragNumber({ value, min, max, step, onChange }) {
  const ref = useRef(null);
  const startY = useRef(0);
  const startVal = useRef(0);

  function clamp(v) {
    return parseFloat(Math.max(min, Math.min(max, Math.round(v / step) * step)).toFixed(5));
  }

  useEffect(() => {
    const el = ref.current;
    const onWheel = e => {
      e.preventDefault();
      onChange(clamp(value + (e.deltaY < 0 ? 1 : -1) * step));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [value]);

  function onMouseDown(e) {
    startY.current = e.clientY;
    startVal.current = value;

    const onMove = mv => onChange(clamp(startVal.current + ((startY.current - mv.clientY) / 80) * (max - min)));

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    e.preventDefault();
  }

  return (
    <span
      ref={ref}
      onMouseDown={onMouseDown}
      className="text-orange-400 cursor-ns-resize select-none"
      style={{
        borderBottom: '1px dashed rgba(251,146,60,0.4)',
        fontFamily: "'Fira Code', 'DM Mono', monospace"
      }}
    >
      {fmt(value)}
    </span>
  );
}
