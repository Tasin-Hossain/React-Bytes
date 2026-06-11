const code = `// TS-CSS variant
import { useRef, useEffect, useState, useCallback, CSSProperties, RefObject } from 'react';
import gsap from 'gsap';

/* ── helpers ─────────────────────────────────────────────── */
function interpolateColor(colors: string[], t: number): string {
  if (!colors || colors.length === 0) return '#ffffff';
  if (colors.length === 1) return colors[0];
  const parse = (hex: string): [number, number, number] => {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };
  const scaled = t * (colors.length - 1);
  const lo = Math.floor(scaled);
  const hi = Math.min(lo + 1, colors.length - 1);
  const frac = scaled - lo;
  const [r1, g1, b1] = parse(colors[lo]);
  const [r2, g2, b2] = parse(colors[hi]);
  return \`rgb(\${Math.round(r1 + (r2 - r1) * frac)},\${Math.round(g1 + (g2 - g1) * frac)},\${Math.round(b1 + (b2 - b1) * frac)})\`;
}

type Align = 'left' | 'center' | 'right';
type EntranceAnim = 'fadeUp' | 'scaleIn' | 'slideLeft' | 'blur' | 'none';

/* ── useResponsiveFontSize ───────────────────────────────── */
function useResponsiveFontSize(containerRef: RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ main: 'clamp(40px,13vw,85px)', subtitle: '22px', magnetRadius: 120 });

  const compute = useCallback(() => {
    const w = containerRef.current?.offsetWidth ?? window.innerWidth;
    if (w < 360) setSize({ main: 'clamp(28px,9vw,40px)', subtitle: '13px', magnetRadius: 60 });
    else if (w < 480) setSize({ main: 'clamp(32px,10vw,52px)', subtitle: '14px', magnetRadius: 70 });
    else if (w < 640) setSize({ main: 'clamp(36px,11vw,64px)', subtitle: '16px', magnetRadius: 85 });
    else if (w < 768) setSize({ main: 'clamp(40px,12vw,72px)', subtitle: '18px', magnetRadius: 100 });
    else setSize({ main: 'clamp(40px,13vw,85px)', subtitle: '22px', magnetRadius: 120 });
  }, [containerRef]);

  useEffect(() => {
    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [compute, containerRef]);

  return size;
}

/* ── MagneticChar ────────────────────────────────────────── */
interface MagneticCharProps {
  char: string;
  index: number;
  totalChars: number;
  fontSize: string;
  baseColor: string;
  letterSpacing: string;
  gap: string;
  magnetRadius: number;
  magnetStrength: number;
  attractDuration: number;
  returnDuration: number;
  hoverColors: string[];
  entranceAnim: EntranceAnim;
  entranceStagger: number;
  entranceDuration: number;
  entranceDelay: number;
}

function MagneticChar({
  char,
  index,
  totalChars,
  fontSize,
  baseColor,
  letterSpacing,
  gap,
  magnetRadius,
  magnetStrength,
  attractDuration,
  returnDuration,
  hoverColors,
  entranceAnim,
  entranceStagger,
  entranceDuration,
  entranceDelay
}: MagneticCharProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (entranceAnim === 'none') {
      gsap.set(el, { opacity: 1 });
      return;
    }
    const delay = entranceDelay + index * entranceStagger;
    const fromMap = {
      fadeUp: { y: 60, opacity: 0 },
      scaleIn: { scale: 0, opacity: 0, rotation: gsap.utils.random(-20, 20) },
      slideLeft: { x: -60, opacity: 0 },
      blur: { filter: 'blur(24px)', opacity: 0, scale: 1.3 }
    };
    const toMap = {
      fadeUp: { y: 0, opacity: 1, ease: 'expo.out' },
      scaleIn: { scale: 1, opacity: 1, rotation: 0, ease: 'back.out(2)' },
      slideLeft: { x: 0, opacity: 1, ease: 'expo.out' },
      blur: { filter: 'blur(0px)', opacity: 1, scale: 1, ease: 'expo.out' }
    };
    gsap.fromTo(el, fromMap[entranceAnim] ?? fromMap.fadeUp, {
      ...(toMap[entranceAnim] ?? toMap.fadeUp),
      duration: entranceDuration,
      delay
    });
  }, [entranceAnim, entranceDelay, entranceStagger, entranceDuration, index]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < magnetRadius) {
        const eased = ((magnetRadius - dist) / magnetRadius) ** 2;
        const color = interpolateColor(hoverColors, index / Math.max(totalChars - 1, 1));
        gsap.to(el, {
          x: dx * eased * magnetStrength,
          y: dy * eased * magnetStrength,
          color,
          duration: attractDuration,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        gsap.to(el, {
          x: 0,
          y: 0,
          color: baseColor,
          duration: returnDuration,
          ease: 'elastic.out(1,0.4)',
          overwrite: 'auto'
        });
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [index, totalChars, magnetRadius, magnetStrength, attractDuration, returnDuration, hoverColors, baseColor]);

  const style: CSSProperties = {
    display: 'inline-block',
    userSelect: 'none',
    willChange: 'transform',
    lineHeight: 1,
    fontSize,
    color: baseColor,
    fontFamily: 'inherit',
    letterSpacing,
    marginRight: gap,
    opacity: entranceAnim === 'none' ? 1 : 0
  };

  const classes = '';

  return (
    <span ref={ref} style={style} className={classes}>
      {char === ' ' ? '\\u00A0' : char}
    </span>
  );
}

/* ── MagneticCursor ──────────────────────────────────────── */
function MagneticCursor({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current,
      ring = ringRef.current,
      container = containerRef?.current;
    if (!dot || !ring || !container) return;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      gsap.to(dot, { left: e.clientX - rect.left, top: e.clientY - rect.top, duration: 0.06, ease: 'none' });
      gsap.to(ring, { left: e.clientX - rect.left, top: e.clientY - rect.top, duration: 0.18, ease: 'power2.out' });
    };
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.15 });
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.15 });
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);
    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [containerRef]);

  const dotStyle: CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    opacity: 0,
    width: '6px',
    height: '6px',
    backgroundColor: '#ffffff',
    left: '-100px',
    top: '-100px'
  };

  const ringStyle: CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    opacity: 0,
    width: '28px',
    height: '28px',
    border: '1px solid rgba(255,255,255,0.4)',
    left: '-100px',
    top: '-100px'
  };

  return (
    <>
      <div ref={dotRef} style={dotStyle} />
      <div ref={ringRef} style={ringStyle} />
    </>
  );
}

/* ── MagneticText ────────────────────────────────────────── */
interface MagneticTextProps {
  text?: string;
  subtitle?: string;
  fontSize?: string;
  subtitleSize?: string;
  letterSpacing?: string;
  textColor?: string;
  subtitleColor?: string;
  hoverColors?: string[];
  magnetRadius?: number;
  magnetStrength?: number;
  attractDuration?: number;
  returnDuration?: number;
  entranceAnim?: EntranceAnim;
  entranceStagger?: number;
  entranceDuration?: number;
  entranceDelay?: number;
  showCursor?: boolean;
  showSubtitle?: boolean;
  align?: Align;
  gap?: string;
  className?: string;
}

export default function MagneticText({
  text = 'ATTRACT',
  subtitle = 'PULL · PUSH · REPEL',
  fontSize,
  subtitleSize,
  letterSpacing = '0.05em',
  textColor = '#ffffff',
  subtitleColor = '#ffffff',
  hoverColors = ['#ff6b6b', '#f7c948', '#4ecdc4', '#a78bfa'],
  magnetRadius,
  magnetStrength = 0.55,
  attractDuration = 0.25,
  returnDuration = 0.6,
  entranceAnim = 'fadeUp',
  entranceStagger = 0.04,
  entranceDuration = 0.7,
  entranceDelay = 0.1,
  showCursor = true,
  showSubtitle = true,
  align = 'center',
  gap = '0px',
  className = ''
}: MagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const responsive = useResponsiveFontSize(containerRef);

  const resolvedMain = fontSize ?? responsive.main;
  const resolvedSub = subtitleSize ?? responsive.subtitle;
  const resolvedRadius = magnetRadius ?? responsive.magnetRadius;

  const mainChars = [...text];
  const subChars = [...subtitle];

  const alignMap: Record<Align, { alignItems: string; textAlign: string; justifyContent: string }> = {
    left: { alignItems: 'flex-start', textAlign: 'left', justifyContent: 'flex-start' },
    center: { alignItems: 'center', textAlign: 'center', justifyContent: 'center' },
    right: { alignItems: 'flex-end', textAlign: 'right', justifyContent: 'flex-end' }
  };
  const { alignItems, textAlign, justifyContent } = alignMap[align] ?? alignMap.center;

  const style = {
    wrapper: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems,
      textAlign,
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      padding: '2rem 1rem',
      fontFamily: "'Bebas Neue', sans-serif",
      cursor: showCursor ? 'none' : 'default'
    } as CSSProperties,
    row: {
      position: 'relative',
      zIndex: 10,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent
    } as CSSProperties,
    subRow: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent,
      marginTop: '0.75rem',
      zIndex: 10
    } as CSSProperties
  };

  const classes = \`\${className}\`;

  const sharedCharProps = {
    magnetRadius: resolvedRadius,
    magnetStrength,
    attractDuration,
    returnDuration,
    hoverColors,
    entranceAnim,
    entranceStagger,
    entranceDuration,
    entranceDelay,
    gap
  };

  return (
    <div ref={containerRef} style={style.wrapper} className={classes}>
      {showCursor && <MagneticCursor containerRef={containerRef} />}

      <div style={style.row}>
        {mainChars.map((ch, i) => (
          <MagneticChar
            key={i}
            char={ch}
            index={i}
            totalChars={mainChars.length}
            fontSize={resolvedMain}
            baseColor={textColor}
            letterSpacing={letterSpacing}
            {...sharedCharProps}
          />
        ))}
      </div>

      {showSubtitle && (
        <div style={style.subRow}>
          {subChars.map((ch, i) => (
            <MagneticChar
              key={i}
              char={ch}
              index={i}
              totalChars={subChars.length}
              fontSize={resolvedSub}
              baseColor={subtitleColor}
              letterSpacing="0.08em"
              {...sharedCharProps}
              entranceDelay={entranceDelay + mainChars.length * entranceStagger + 0.1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
`;
export default code;
