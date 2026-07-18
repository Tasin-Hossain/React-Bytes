
import { useRef, useEffect, useState, useMemo } from 'react';

const MAX_SPEED = 800;

export default function CurvedMarquee({
  text = 'Be ✦ Creative ✦ With ✦ React ✦ Bytes ✦',
  font = {
    fontFamily: 'sans-serif',
    fontWeight: 400,
    fontSize: 100,
    lineHeight: '1.5em',
    letterSpacing: '1px',
    textAlign: 'left'
  },
  color = '#FFFFFF',
  direction = 'left',
  baseVelocity = 18,
  curveAmount = -574,
  gap = 1,
  draggable = true,
  dragIntensity = 8,
  fade = true,
  fadePercent = 50,
  style,
  className = ''
}) {
  const measureRef = useRef(null);
  const tspansRef = useRef([]);
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const staticId = useMemo(() => {
    const propsString = `${text}-${curveAmount}-${direction}-${baseVelocity}`;
    let hash = 0;
    for (let i = 0; i < propsString.length; i++) {
      const char = propsString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }, [text, curveAmount, direction, baseVelocity]);

  const pathId = `curve-${staticId}`;
  const fadeGradientId = `fadeGradient-${staticId}`;
  const fadeMaskId = `fadeMask-${staticId}`;
  const pathD = `M-100,400 Q720,${400 + curveAmount} 1540,400`;

  const isDragging = useRef(false);
  const dragVelocity = useRef(0);
  const effectiveVelocity = (baseVelocity / 100) * MAX_SPEED;
  const actualBaseVelocity = direction === 'left' ? -effectiveVelocity : effectiveVelocity;
  const dragFactor = dragIntensity * 0.1;

  const gapPx = (gap + 1) * 10;

  const processedText = useMemo(() => text.trim(), [text]);

  const spacing = textWidth + gapPx;

  useEffect(() => {
    if (measureRef.current) {
      setTextWidth(measureRef.current.getComputedTextLength());
    }
  }, [text, font, color, direction, baseVelocity, curveAmount, gap, draggable, dragIntensity, fade, fadePercent]);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [curveAmount]);

  const calculatedRepeats = spacing > 0 ? Math.ceil(pathLength / spacing) + 2 : 0;
  const ready = pathLength > 0 && spacing > 0;

  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    let last = performance.now();
    const tick = now => {
      const delta = now - last;
      last = now;
      const spans = tspansRef.current;
      if (spans.length > 0) {
        const maxX = (spans.length - 1) * spacing;
        if (isDragging.current) {
          for (const tspan of spans) {
            if (!tspan) continue;
            let x = parseFloat(tspan.getAttribute('x') || '0');
            x += dragVelocity.current;
            if (x < -spacing) x = maxX;
            if (x > maxX) x = -spacing;
            tspan.setAttribute('x', x.toString());
          }
          dragVelocity.current *= 0.9;
          if (Math.abs(dragVelocity.current) < 0.01) {
            dragVelocity.current = 0;
          }
        } else {
          let moveBy = actualBaseVelocity * (delta / 1e3);
          moveBy += dragVelocity.current;
          if (Math.abs(dragVelocity.current) > 0.01) {
            dragVelocity.current *= 0.96;
          } else {
            dragVelocity.current = 0;
          }
          for (const tspan of spans) {
            if (!tspan) continue;
            let x = parseFloat(tspan.getAttribute('x') || '0');
            x += moveBy;
            if (x < -spacing) x = maxX;
            if (x > maxX) x = -spacing;
            tspan.setAttribute('x', x.toString());
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, spacing, actualBaseVelocity]);

  const lastPointerPosition = useRef({ x: 0, y: 0 });

  const handlePointerDown = e => {
    if (!draggable) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
    isDragging.current = true;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
    dragVelocity.current = 0;
  };
  const handlePointerMove = e => {
    if (!draggable) return;
    if (!isDragging.current) return;
    const currentPosition = { x: e.clientX, y: e.clientY };
    const deltaX = currentPosition.x - lastPointerPosition.current.x;
    dragVelocity.current = deltaX * dragFactor;
    lastPointerPosition.current = currentPosition;
  };
  const handlePointerUp = e => {
    if (!draggable) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grab';
    isDragging.current = false;
  };

  // eslint-disable-next-line react-hooks/refs
  const cursorStyle = draggable ? (isDragging.current ? 'grabbing' : 'grab') : 'default';

  const fadeStart = `${fadePercent}%`;
  const fadeEnd = `${100 - fadePercent}%`;

  return (
    <div
      className={`w-full h-full  flex items-center justify-center ${className}`}
      style={{ visibility: ready ? 'visible' : 'hidden', ...style }}
    >
      <svg
        viewBox="0 0 1440 800"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none w-full block overflow-visible"
        style={{
          aspectRatio: '1440 / 800',
          fill: color,
          fontFamily: font.fontFamily,
          fontSize: font.fontSize,
          letterSpacing: font.letterSpacing,
          lineHeight: font.lineHeight
        }}
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          className="invisible opacity-0 pointer-events-none"
          style={{ cursor: cursorStyle }}
        >
          {processedText}
        </text>
        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
          {fade && (
            <>
              <linearGradient id={fadeGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset={fadeStart} stopColor="white" stopOpacity="1" />
                <stop offset={fadeEnd} stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <mask id={fadeMaskId}>
                <rect width="100%" height="100%" fill={`url(#${fadeGradientId})`} />
              </mask>
            </>
          )}
        </defs>
        {ready && (
          <text
            fontWeight={font.fontWeight}
            xmlSpace="preserve"
            mask={fade ? `url(#${fadeMaskId})` : undefined}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <textPath href={`#${pathId}`} xmlSpace="preserve">
              {Array.from({ length: calculatedRepeats }).map((_, i) => (
                <tspan
                  key={i}
                  x={i * spacing}
                  ref={el => {
                    if (el) tspansRef.current[i] = el;
                  }}
                >
                  {processedText}
                </tspan>
              ))}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
}