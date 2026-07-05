// JS-CSS variant
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function glowShadow(hexColor, intensity) {
  if (!hexColor || intensity <= 0) return 'none';
  return `0 0 ${8 * intensity}px ${hexColor}, 0 0 ${20 * intensity}px ${hexColor}, 0 0 ${40 * intensity}px ${hexColor}`;
}

export default function NeonFlicker({
  text = 'NEON',
  color = '#00f5ff',
  glow,
  glowSoft,
  dim,
  minGlow = 0,
  maxGlow = 1,
  charDelay = 0.18,
  repeat = false,
  fontSize = '64px',
  fontWeight = '900',
  letterSpacing = '0.08em',
  className = ''
}) {
  const containerRef = useRef(null);
  const tlRef = useRef(null);

  const glowColor     = glow     ?? color;
  const glowSoftColor = glowSoft ?? color;
  const dimColor      = dim      ?? color;

  const min = Math.max(0, Math.min(minGlow, maxGlow));
  const max = Math.max(min, maxGlow);

  useEffect(() => {
    const buildTimeline = () => {
      const container = containerRef.current;
      if (!container) return;
      const spans = container.querySelectorAll('.neon-char');

      if (tlRef.current) tlRef.current.kill();

      const shadowMax = glowShadow(glowColor, max);
      const shadowMid = glowShadow(glowSoftColor, (min + max) / 2);
      const shadowMin = glowShadow(dimColor, min);
      const opMin     = Math.max(0.05, 0.08 + min * 0.1);
      const opMax     = Math.min(1, 0.6 + max * 0.4);

      gsap.set(spans, { opacity: opMin, color: dimColor, textShadow: shadowMin });

      const tl = gsap.timeline({ repeat: repeat ? -1 : 0, repeatDelay: 1.5 });

      spans.forEach((span, i) => {
        const t = i * charDelay;
        tl.to(span, { opacity: opMax, color, textShadow: shadowMax, duration: 0.05 }, t);
        tl.to(span, { opacity: opMin, textShadow: shadowMin, duration: 0.05 }, t + 0.08);
        tl.to(span, { opacity: opMax, textShadow: shadowMax, duration: 0.04 }, t + 0.13);
        tl.to(span, { opacity: opMin + (opMax - opMin) * 0.3, textShadow: shadowMid, duration: 0.07 }, t + 0.19);
        tl.to(span, { opacity: opMax, color, textShadow: shadowMax, duration: 0.1 }, t + 0.28);
      });

      tlRef.current = tl;
    };

    buildTimeline();
    return () => tlRef.current?.kill();
  }, [text, color, glow, glowSoft, dim, minGlow, maxGlow, charDelay, repeat, glowColor, max, glowSoftColor, min, dimColor]);

  const chars = [...text];

  const style = {
    outer: {
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      gap:            '2rem',
    },
    container: {
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      flexWrap:        'wrap',
      gap:             0,
    },
    char: (char) => ({
      display:       'inline-block',
      fontSize,
      fontWeight,
      letterSpacing,
      textTransform: 'uppercase',
      userSelect:    'none',
      fontFamily:    "'Arial Black', sans-serif",
      color:         dimColor,
      minWidth:      char === ' ' ? '0.4em' : undefined,
    }),
  };

  const classes = `${className}`;

  return (
    <div style={style.outer} className={classes}>
      <div ref={containerRef} style={style.container}>
        {chars.map((char, i) => (
          <span
            key={i}
            className="neon-char"
            style={style.char(char)}
          >
            {char === ' ' ? '\u00a0' : char}
          </span>
        ))}
      </div>
    </div>
  );
}