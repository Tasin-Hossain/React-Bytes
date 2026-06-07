import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import useComponentProps from '../../../hooks/useComponentProps';

gsap.registerPlugin(useGSAP);

function interpolateColor(colors, t) {
  if (!colors || colors.length === 0) return '#ffffff';
  if (colors.length === 1) return colors[0];

  const parse = (hex) => {
    const h = hex.replace('#', '');
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  };

  const scaled = t * (colors.length - 1);
  const lo = Math.floor(scaled);
  const hi = Math.min(lo + 1, colors.length - 1);
  const frac = scaled - lo;

  const [r1, g1, b1] = parse(colors[lo]);
  const [r2, g2, b2] = parse(colors[hi]);

  return `rgb(${Math.round(r1 + (r2 - r1) * frac)},${Math.round(g1 + (g2 - g1) * frac)},${Math.round(b1 + (b2 - b1) * frac)})`;
}

/* ── MagneticCursor ── */
function MagneticCursor({ containerRef }) {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    const wrap = containerRef?.current;
    if (!dot || !ring || !wrap) return;

    const onMove = (e) => {
      gsap.to(dot,  { left: e.clientX, top: e.clientY, duration: 0.06, ease: 'none' });
      gsap.to(ring, { left: e.clientX, top: e.clientY, duration: 0.18, ease: 'power2.out' });
    };

    const onEnter = () => {
      gsap.to(dot,  { opacity: 1, duration: 0.15 });
      gsap.to(ring, { opacity: 0.4, duration: 0.15 });
    };
    const onLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.15 });
    };

    window.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseenter', onEnter);
    wrap.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseenter', onEnter);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, [containerRef]);

  const base = {
    position: 'fixed',
    pointerEvents: 'none',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 99999,
    opacity: 0,
  };

  return (
    <>
      <div ref={dotRef}  style={{ ...base, width: 5,  height: 5,  background: 'var(--text-primary)' }} />
      <div ref={ringRef} style={{ ...base, width: 28, height: 28, border: '1px solid var(--text-primary)' }} />
    </>
  );
}

/* ── MagneticChar ── */
function MagneticChar({ char, index, totalChars, props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const delay = props.entranceDelay + index * props.entranceStagger;

    const fromMap = {
      fadeUp:    { y: 60, opacity: 0 },
      scaleIn:   { scale: 0, opacity: 0, rotation: gsap.utils.random(-20, 20) },
      slideLeft: { x: -60, opacity: 0 },
      blur:      { filter: 'blur(24px)', opacity: 0, scale: 1.3 },
      none:      {},
    };
    const toMap = {
      fadeUp:    { y: 0, opacity: 1, ease: 'expo.out' },
      scaleIn:   { scale: 1, opacity: 1, rotation: 0, ease: 'back.out(2)' },
      slideLeft: { x: 0, opacity: 1, ease: 'expo.out' },
      blur:      { filter: 'blur(0px)', opacity: 1, scale: 1, ease: 'expo.out' },
      none:      {},
    };

    const from = fromMap[props.entranceAnim] ?? fromMap.fadeUp;
    const to   = toMap[props.entranceAnim]   ?? toMap.fadeUp;

    if (props.entranceAnim === 'none') {
      gsap.set(el, { opacity: 1 });
      return;
    }

    gsap.fromTo(el, from, { ...to, duration: props.entranceDuration, delay });
  }, [props.entranceAnim, props.entranceDelay, props.entranceStagger, props.entranceDuration, index]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const baseColor = props.baseColor ?? 'var(--text-primary)';

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < props.magnetRadius) {
        const force = (props.magnetRadius - dist) / props.magnetRadius;
        const eased = force * force;
        const color = interpolateColor(props.hoverColors, index / Math.max(totalChars - 1, 1));
        gsap.to(el, {
          x: dx * eased * props.magnetStrength,
          y: dy * eased * props.magnetStrength,
          color,
          duration: props.attractDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to(el, {
          x: 0, y: 0,
          color: baseColor,
          duration: props.returnDuration,
          ease: 'elastic.out(1,0.4)',
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [
    index, totalChars,
    props.magnetRadius, props.magnetStrength,
    props.attractDuration, props.returnDuration,
    props.hoverColors, props.baseColor,
  ]);

  return (
    <span
      ref={ref}
      className="inline-block select-none will-change-transform"
      style={{
        fontSize:      props.fontSize,
        letterSpacing: props.letterSpacing,
        marginRight:   props.gap,
        color:         props.baseColor ?? 'var(--text-primary)',
        lineHeight:    1,
        fontFamily:    'inherit',
        opacity:       props.entranceAnim === 'none' ? 1 : 0,
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  );
}

/* ── MagneticTextPreview ── */
const MagneticTextPreview = () => {
  const { props, animKey } = useComponentProps();
  const containerRef = useRef(null);

  const text      = props.text     ?? 'MAGNETIC';
  const subtitle  = props.subtitle ?? 'PULL · PUSH · REPEL';
  const mainChars = [...text];
  const subChars  = [...subtitle];

  const justifyMap   = { center: 'justify-center', left: 'justify-start', right: 'justify-end' };
  const justifyClass = justifyMap[props.align] ?? 'justify-center';

  return (
    <div
      key={animKey}
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full py-8 gap-4"
      style={{ cursor: props.showCursor ? 'none' : 'default' }}
    >
      {props.showCursor && <MagneticCursor containerRef={containerRef} />}

      {/* Main text */}
      <div className={`flex flex-wrap ${justifyClass}`}>
        {mainChars.map((ch, i) => (
          <MagneticChar
            key={`${animKey}-main-${i}`}
            char={ch}
            index={i}
            totalChars={mainChars.length}
            props={{
              ...props,
              fontSize:  props.fontSize  ?? 'clamp(40px, 13vw, 85px)',
              baseColor: props.textColor ?? 'var(--text-primary)',
            }}
          />
        ))}
      </div>

      {/* Subtitle */}
      {props.showSubtitle && (
        <div className={`flex flex-wrap ${justifyClass}`}>
          {subChars.map((ch, i) => (
            <MagneticChar
              key={`${animKey}-sub-${i}`}
              char={ch}
              index={i}
              totalChars={subChars.length}
              props={{
                ...props,
                fontSize:      props.subtitleSize ?? '22px',
                letterSpacing: '0.08em',
                baseColor:     props.subtitleColor ?? 'var(--text-muted)',
                entranceDelay: (props.entranceDelay ?? 0.1) + mainChars.length * (props.entranceStagger ?? 0.04) + 0.1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MagneticTextPreview;
