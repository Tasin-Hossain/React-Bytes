// TS-CSS variant
import { useEffect, useRef, useCallback, CSSProperties } from 'react';
import { gsap } from 'gsap';

type AnimateBy = 'letter' | 'word';
type StaggerFrom = number | 'center' | 'start' | 'end' | 'edges' | 'random' | [number, number];

interface BlurTextProps {
  text?: string;
  animateBy?: AnimateBy;
  from?: StaggerFrom;
  scale?: number;
  blur?: number;
  yOffset?: number;
  duration?: number;
  charDelay?: number;
  wordDelay?: number;
  repeat?: boolean;
  color?: string;
  gradient?: string;
  fontSize?: string;
  fontWeight?: string | number;
  letterSpacing?: string;
  className?: string;
}

export default function BlurText({
  text = 'IMPACT',
  animateBy = 'letter',
  from = 'center',
  scale = 4,
  blur = 8,
  yOffset = 0,
  duration = 0.8,
  charDelay = 0.06,
  wordDelay = 0.15,
  repeat = false,
  color = '#ffffff',
  gradient = '',
  fontSize = '64px',
  fontWeight = '900',
  letterSpacing = '-0.02em',
  className = ''
}: BlurTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const gradientStyle: CSSProperties = gradient
    ? {
        backgroundImage: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }
    : { color };

  const words = animateBy === 'word' ? text.split(/\s+/).filter(Boolean) : [];
  const chars = animateBy === 'letter' ? [...text] : [];

  const buildTimeline = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const selector = animateBy === 'word' ? '.explode-word' : '.explode-char';
    const els = container.querySelectorAll(selector);
    if (!els.length) return;

    if (tlRef.current) tlRef.current.kill();

    gsap.set(els, {
      scaleX: scale,
      scaleY: scale,
      opacity: 0,
      filter: `blur(${blur}px)`,
      y: yOffset,
      transformOrigin: '50% 50%'
    });

    const staggerDelay = animateBy === 'word' ? wordDelay : charDelay;

    const tl = gsap.timeline({
      repeat: repeat ? -1 : 0,
      repeatDelay: 1.0,
      onRepeat() {
        gsap.set(els, {
          scaleX: scale,
          scaleY: scale,
          opacity: 0,
          filter: `blur(${blur}px)`,
          y: yOffset
        });
      }
    });

    tl.to(els, {
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      stagger: { each: staggerDelay, from },
      ease: 'expo.out',
      duration
    });

    tlRef.current = tl;
  }, [animateBy, from, scale, blur, yOffset, duration, charDelay, wordDelay, repeat]);

  useEffect(() => {
    buildTimeline();
    return () => {
      tlRef.current?.kill();
    };
  }, [buildTimeline]);

  const style = {
    outer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem'
    } as CSSProperties,
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center'
    } as CSSProperties,
    item: {
      display: 'inline-block',
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight: 1,
      userSelect: 'none'
    } as CSSProperties
  };

  const classes = `${className}`;

  return (
    <div style={style.outer} className={classes}>
      <div ref={containerRef} style={style.container}>
        {animateBy === 'word'
          ? words.map((word, i) => (
              <span key={i} className="explode-word" style={{ opacity: 0, ...style.item, ...gradientStyle }}>
                {word}
                {i < words.length - 1 && (
                  <span style={{ display: 'inline-block', minWidth: '0.35em' }}>{'\u00A0'}</span>
                )}
              </span>
            ))
          : chars.map((char, i) => (
              <span
                key={i}
                className="explode-char"
                style={{
                  opacity: 0,
                  minWidth: char === ' ' ? '0.35em' : undefined,
                  ...style.item,
                  ...gradientStyle
                }}
              >
                {char === ' ' ? '\u00a0' : char}
              </span>
            ))}
      </div>
    </div>
  );
}
