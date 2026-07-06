// TS-TW variant
import { useCallback, useEffect, useRef, CSSProperties } from 'react';
import { gsap } from 'gsap';

interface SpotlightTextProps {
  text?: string;
  charDelay?: number;
  duration?: number;
  repeat?: boolean;
  dimOpacity?: number;
  baseColor?: string;
  spotColor?: string;
  ease?: string;
  className?: string;
}

export default function SpotlightText({
  text = 'SPOTLIGHT',
  charDelay = 0.09,
  duration = 0.25,
  repeat = false,
  dimOpacity = 0.08,
  baseColor = '#8a8a86',
  spotColor = '#e24b4a',
  ease = 'power2.out',
  className = ''
}: SpotlightTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const buildTimeline = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const spans = container.querySelectorAll('.spot-char');

    if (tlRef.current) tlRef.current.kill();

    gsap.set(spans, { opacity: dimOpacity, color: baseColor });

    const tl = gsap.timeline({
      repeat: repeat ? -1 : 0,
      repeatDelay: 1.2,
      onRepeat() {
        gsap.set(spans, { opacity: dimOpacity, color: baseColor });
      }
    });

    spans.forEach((s, i) => {
      const t = i * charDelay;
      tl.to(s, { opacity: 1, color: spotColor, ease, duration }, t);
      tl.to(s, { opacity: 0.7, duration: duration * 0.6 }, t + duration);
      tl.to(s, { opacity: 1, color: baseColor, duration: duration * 0.8 }, t + duration * 1.6);
    });

    tlRef.current = tl;
  }, [charDelay, duration, repeat, dimOpacity, baseColor, spotColor, ease]);

  useEffect(() => {
    buildTimeline();
    return () => {
      tlRef.current?.kill();
    };
  }, [text, charDelay, duration, repeat, dimOpacity, baseColor, spotColor, ease, buildTimeline]);

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <div ref={containerRef} className="flex flex-wrap items-center justify-center">
        {[...text].map((char, i) => (
          <span
            key={i}
            className="spot-char inline-block text-6xl sm:text-6xl md:text-6xl lg:text-8xl font-black tracking-tight leading-none select-none"
            style={
              {
                opacity: dimOpacity,
                color: baseColor,
                minWidth: char === ' ' ? '0.35em' : undefined
              } as CSSProperties
            }
          >
            {char === ' ' ? '\u00a0' : char}
          </span>
        ))}
      </div>
    </div>
  );
}
