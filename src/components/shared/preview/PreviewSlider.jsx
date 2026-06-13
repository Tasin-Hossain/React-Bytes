import { useCallback, useEffect, useRef, useState } from 'react';

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const stepDecimals = (step) => {
  const s = step.toString();
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
};

const roundToStep = (val, step, min) => {
  const raw = Math.round((val - min) / step) * step + min;
  const decimals = Math.max(stepDecimals(step), stepDecimals(min));
  return Number(raw.toFixed(decimals));
};

const PreviewSlider = ({
  label = '',
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  valueUnit = '',
  isDisabled = false,
  displayValue,
  onChange,
}) => {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoverDevice, setIsHoverDevice] = useState(false);

  const range = max - min;
  const percentage = range > 0 ? ((value - min) / range) * 100 : 0;
  const isActive = isDragging || (isHoverDevice && isHovering);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHoverDevice(mq.matches);
    const handleChange = (e) => setIsHoverDevice(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const computeValue = useCallback(
    (clientX) => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      const raw = min + ratio * range;
      return clamp(roundToStep(raw, step, min), min, max);
    },
    [min, max, step, range, value]
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (isDisabled) return;
      e.preventDefault();
      trackRef.current?.setPointerCapture(e.pointerId);
      setIsDragging(true);
      onChange?.(computeValue(e.clientX));
    },
    [computeValue, onChange, isDisabled]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      onChange?.(computeValue(e.clientX));
    },
    [isDragging, computeValue, onChange]
  );

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  const handleKeyDown = useCallback(
    (e) => {
      if (isDisabled) return;
      let next;
      switch (e.key) {
        case 'ArrowRight': case 'ArrowUp':   next = value + step; break;
        case 'ArrowLeft':  case 'ArrowDown': next = value - step; break;
        case 'Home': next = min; break;
        case 'End':  next = max; break;
        default: return;
      }
      e.preventDefault();
      onChange?.(clamp(roundToStep(next, step, min), min, max));
    },
    [value, step, min, max, onChange, isDisabled]
  );

  const ticks = 9;
  const decimals = stepDecimals(step);
  const formattedValue = displayValue
    ? displayValue(value)
    : `${Number(value.toFixed(decimals))}${valueUnit}`;

  return (
    <div className="relative w-full select-none">
      {/* Track */}
      <div
        ref={trackRef}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={isDisabled ? -1 : 0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onKeyDown={handleKeyDown}
        className={`relative h-9 rounded-lg border border-(--border-secondary) bg-(--bg-elevated)
          overflow-hidden touch-none outline-none cursor-pointer focus-visible:outline-2 focus-visible:outline-(--bg-white)/20
          ${isDisabled ? 'opacity-35 pointer-events-none' : ''}`}
      >
        {/* Fill */}
        <div
          className={`absolute inset-0 right-auto bg-(--bg-white)/6 rounded-md pointer-events-none
            ${isDragging ? '' : 'transition-[width] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]'}`}
          style={{ width: `${percentage}%` }}
        />

        {/* Ticks */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: ticks }, (_, i) => (
            <div
              key={i}
              className="absolute top-1/2 w-px h-2 rounded-full bg-(--bg-white)/10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${((i + 1) / (ticks + 1)) * 100}%` }}
            />
          ))}
        </div>

        {/* Thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -ml-1.5 pointer-events-none z-30
            ${isDragging ? '' : 'transition-[left] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]'}`}
          style={{ left: `${percentage}%` }}
        >
          <div
            className={`w-1.5 h-6.5 rounded-full bg-(--bg-white)/90
              transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.23,1,0.32,1)]
              ${isActive ? 'opacity-90 scale-100' : 'opacity-15 scale-[0.7]'}`}
          />
        </div>

        {/* Label */}
        <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[13px] text-(--text-muted) whitespace-nowrap pointer-events-none z-40">
          {label}
        </span>

        {/* Value */}
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[13px] text-(--text-primary) tabular-nums font-medium pointer-events-none z-40">
          {formattedValue}
        </span>
      </div>
    </div>
  );
};

export default PreviewSlider;
