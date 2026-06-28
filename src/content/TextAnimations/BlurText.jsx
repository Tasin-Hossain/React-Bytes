import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

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
  fontSize = 'text-6xl',
  className = ''
}) {
  const containerRef = useRef(null);
  const tlRef = useRef(null);

  const gradientStyle = gradient
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
    return () => tlRef.current?.kill();
  }, [buildTimeline]);

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <div
        ref={containerRef}
        className="flex flex-wrap  items-center justify-center"
      >
        {animateBy === 'word'
          ? words.map((word, i) => (
              <span
                key={i}
                className={`explode-word inline-block font-black tracking-tight leading-none select-none ${fontSize}`}
                style={{ opacity: 0, ...gradientStyle }}
              >
                {word}
                {i < words.length - 1 && (
                  <span style={{ display: 'inline-block', minWidth: '0.35em' }}>{'\u00A0'}</span>
                )}
              </span>
            ))
          : chars.map((char, i) => (
              <span
                key={i}
                className={`explode-char inline-block font-black tracking-tight leading-none select-none ${fontSize}`}
                style={{
                  opacity: 0,
                  minWidth: char === ' ' ? '0.35em' : undefined,
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
