// TS-TW variant
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Transition } from 'motion/react';

type TrailStyle = 'fade' | 'float' | 'scatter' | 'shrink' | 'spin';

interface TrailPoint {
  id:    number;
  x:     number;
  y:     number;
  angle: number;
  ch:    string;
  col:   string;
  sz:    number;
  rx?:   number;
  ry?:   number;
  rr?:   number;
}

interface CursorTrailProps {
  children:              React.ReactNode;
  trailText?:            string;
  color?:                string;
  colors?:               string[];
  style?:                TrailStyle;
  spacing?:              number;
  minSize?:              number;
  maxSize?:              number;
  exitDuration?:         number;
  removalInterval?:      number;
  maxPoints?:            number;
  followMouseDirection?: boolean;
  randomFloat?:          boolean;
  className?:            string;
}

const CursorTrail = ({
  children,
  trailText        = '✦',
  color            = '#ffffff',
  colors,
  style            = 'fade',
  spacing          = 50,
  minSize          = 20,
  maxSize          = 48,
  exitDuration     = 0.4,
  removalInterval  = 30,
  maxPoints        = 12,
  followMouseDirection = false,
  randomFloat      = true,
  className        = '',
}: CursorTrailProps) => {
  const [trail, setTrail]   = useState<TrailPoint[]>([]);
  const containerRef        = useRef<HTMLDivElement>(null);
  const lastMoveTime        = useRef(Date.now());
  const idCounter           = useRef(0);
  const trailChars          = [...trailText];
  const palette             = colors ?? [color];

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect   = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTrail(prev => {
      const next    = [...prev];
      const rnd     = () => randomFloat ? { rx: Math.random() * 10 - 5, ry: Math.random() * 10 - 5, rr: Math.random() * 20 - 10 } : {};
      const getSize = () => randomFloat ? minSize + Math.random() * (maxSize - minSize) : (minSize + maxSize) / 2;

      if (next.length === 0) {
        const idx = idCounter.current++;
        next.push({ id: idx, x: mouseX, y: mouseY, angle: 0, ch: trailChars[idx % trailChars.length], col: palette[idx % palette.length], sz: getSize(), ...rnd() });
      } else {
        const last = next[next.length - 1];
        const dx   = mouseX - last.x;
        const dy   = mouseY - last.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= spacing) {
          const angle = followMouseDirection ? (Math.atan2(dy, dx) * 180) / Math.PI : 0;
          const steps = Math.floor(dist / spacing);
          for (let i = 1; i <= steps; i++) {
            const t   = (spacing * i) / dist;
            const idx = idCounter.current++;
            next.push({ id: idx, x: last.x + dx * t, y: last.y + dy * t, angle, ch: trailChars[idx % trailChars.length], col: palette[idx % palette.length], sz: getSize(), ...rnd() });
          }
        }
      }
      return next.length > maxPoints ? next.slice(next.length - maxPoints) : next;
    });

    lastMoveTime.current = Date.now();
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      if (Date.now() - lastMoveTime.current > 100) setTrail(p => (p.length > 0 ? p.slice(1) : p));
    }, removalInterval);
    return () => clearInterval(iv);
  }, [removalInterval]);

  const getAnimate = (item: TrailPoint) => {
    const base = { opacity: 1, scale: 1 };
    if (style === 'float')   return { ...base, y: -40 };
    if (style === 'scatter') return { ...base, x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 80 };
    if (randomFloat)         return { ...base, x: [0, item.rx ?? 0, 0], y: [0, item.ry ?? 0, 0], rotate: [item.angle, item.angle + (item.rr ?? 0), item.angle] };
    return { ...base, rotate: item.angle };
  };

  const getExit = (item: TrailPoint) => {
    if (style === 'shrink') return { opacity: 0, scale: 0 };
    if (style === 'spin')   return { opacity: 0, rotate: item.angle + 180 };
    return { opacity: 0, scale: 0 };
  };

  const getTransition = (): Transition => {
    const base = {
      opacity: { duration: exitDuration, ease: 'easeOut' as const },
      scale:   { duration: exitDuration * 0.5 },
    };
    if (randomFloat && style === 'fade') return {
      ...base,
      x:      { duration: 2, ease: 'easeInOut' as const, repeat: Infinity, repeatType: 'mirror' as const },
      y:      { duration: 2, ease: 'easeInOut' as const, repeat: Infinity, repeatType: 'mirror' as const },
      rotate: { duration: 2, ease: 'easeInOut' as const, repeat: Infinity, repeatType: 'mirror' as const },
    };
    return base;
  };

  const particleStyle = (item: TrailPoint): React.CSSProperties => ({
    left:     item.x,
    top:      item.y,
    fontSize: item.sz,
    color:    item.col,
  });

  const classes = `relative isolate ${className}`;

  return (
    <div ref={containerRef} className={classes}>
      <div className="relative z-10">{children}</div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence>
          {trail.map(item => (
            <motion.span
              key={item.id}
              initial={{ opacity: 0, scale: 0.5, rotate: item.angle }}
              animate={getAnimate(item)}
              exit={getExit(item)}
              transition={getTransition()}
              className="absolute -translate-x-1/2 -translate-y-1/2 font-black leading-none select-none whitespace-nowrap"
              style={particleStyle(item)}
            >
              {item.ch}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CursorTrail;