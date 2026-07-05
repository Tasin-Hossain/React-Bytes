
import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { gsap } from 'gsap';


const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};


const TextPressure = ({
  text        = 'Compressa',
  fontFamily  = 'Roboto Flex',
  fontUrl     = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',

  width    = true,
  weight   = true,
  italic   = true,
  alpha    = false,

  flex     = true,
  stroke   = false,
  scale    = false,

  textColor   = '#FFFFFF',
  strokeColor = '#FF0000',
  strokeWidth = 2,
  className   = '',
  minFontSize = 24,
}) => {
  const containerRef = useRef(null);
  const titleRef     = useRef(null);
  const spansRef     = useRef([]);
  const mouseRef     = useRef({ x: 0, y: 0 });
  const cursorRef    = useRef({ x: 0, y: 0 });

  const [fontSize,    setFontSize]    = useState(minFontSize);
  const [scaleY,      setScaleY]      = useState(1);
  const [lineHeight,  setLineHeight]  = useState(1);

  const chars = text.split('');

  useEffect(() => {
    const onMouseMove = (e) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const onTouchMove = (e) => {
      cursorRef.current.x = e.touches[0].clientX;
      cursorRef.current.y = e.touches[0].clientY;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width: w, height: h } =
        containerRef.current.getBoundingClientRect();
      mouseRef.current.x  = left + w / 2;
      mouseRef.current.y  = top  + h / 2;
      cursorRef.current   = { ...mouseRef.current };
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;
    const { width: cW, height: cH } =
      containerRef.current.getBoundingClientRect();

    const fs = Math.max(cW / (chars.length / 2), minFontSize);
    setFontSize(fs);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current || !scale) return;
      const ratio = cH / titleRef.current.getBoundingClientRect().height;
      setScaleY(ratio);
      setLineHeight(ratio);
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    let tid;
    const debounced = () => { clearTimeout(tid); tid = setTimeout(setSize, 100); };
    debounced();
    window.addEventListener('resize', debounced);
    return () => window.removeEventListener('resize', debounced);
  }, [setSize]);

  useEffect(() => {
    const ticker = gsap.ticker.add(() => {
      mouseRef.current.x = gsap.utils.interpolate(
        mouseRef.current.x, cursorRef.current.x, 1 / 15
      );
      mouseRef.current.y = gsap.utils.interpolate(
        mouseRef.current.y, cursorRef.current.y, 1 / 15
      );

      if (!titleRef.current) return;
      const maxDist = titleRef.current.getBoundingClientRect().width / 2;

      spansRef.current.forEach((span) => {
        if (!span) return;
        const r = span.getBoundingClientRect();
        const d = dist(mouseRef.current, {
          x: r.x + r.width  / 2,
          y: r.y + r.height / 2,
        });

        const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
        const wdth = width  ? Math.floor(getAttr(d, maxDist, 5,   200)) : 100;
        const ital = italic ? getAttr(d, maxDist, 0, 1).toFixed(2)      : 0;
        const opac = alpha  ? getAttr(d, maxDist, 0, 1).toFixed(2)      : 1;

        gsap.set(span, {
          fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${ital}`,
          opacity: opac,
        });
      });
    });

    return () => gsap.ticker.remove(ticker);
  }, [weight, width, italic, alpha]);


  const strokeStyleEl = useMemo(() => {
    if (!stroke) return null;
    return (
      <style>{`
        @import url('${fontUrl}');
        .tp-stroke span::after {
          content: attr(data-char);
          position: absolute;
          inset: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke: ${strokeWidth}px ${strokeColor};
        }
      `}</style>
    );
  }, [fontUrl, stroke, strokeColor, strokeWidth]);

  // ── font import (no stroke) ─────────────────────────────────
  const fontStyleEl = useMemo(() => {
    if (stroke) return null; // already imported above
    return <style>{`@import url('${fontUrl}');`}</style>;
  }, [fontUrl, stroke]);

  return (
    // relative w-full h-full overflow-hidden bg-transparent
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-transparent">
      {strokeStyleEl}
      {fontStyleEl}

      <h1
        ref={titleRef}
        className={[
          // flex justify-between OR just center text
          flex ? 'flex justify-between' : 'flex justify-center',
          // stroke mode adds position:relative to spans via tp-stroke
          stroke ? 'tp-stroke' : '',
          // uppercase text-center
          'uppercase text-center',
          // additional class from consumer
          className,
        ].filter(Boolean).join(' ')}
        style={{
          fontFamily,
          fontSize,
          lineHeight,
          transform:       `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin:     0,
          fontWeight: 100,
          color: stroke ? 'transparent' : textColor,
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => (spansRef.current[i] = el)}
            data-char={char}
            // inline-block so getBoundingClientRect works per-char
            className={[
              'inline-block',
              stroke ? 'relative' : '',  // needed for ::after positioning
            ].filter(Boolean).join(' ')}
            style={{ color: stroke ? textColor : undefined }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
