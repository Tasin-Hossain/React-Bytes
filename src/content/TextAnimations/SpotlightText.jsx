import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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
}) {
  const containerRef = useRef(null);
  const tlRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const buildTimeline = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const spans = container.querySelectorAll('.spot-char');

    if (tlRef.current) tlRef.current.kill();

    // all chars start dim, at base color
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
      // bright flash — fade in and shift to spotlight color
      tl.to(s, { opacity: 1, color: spotColor, ease, duration }, t);
      // slight dim — like beam passing
      tl.to(s, { opacity: 0.7, duration: duration * 0.6 }, t + duration);
      // settle back — bright opacity, fade color back to base
      tl.to(s, { opacity: 1, color: baseColor, duration: duration * 0.8 }, t + duration * 1.6);
    });

    tlRef.current = tl;
  });

  useEffect(() => {
    buildTimeline();
    return () => tlRef.current?.kill();
  }, [text, charDelay, duration, repeat, dimOpacity, baseColor, spotColor, ease, buildTimeline]);

  return (
    <div>
      {/* Text */}
      <div ref={containerRef} className="flex flex-wrap items-center">
        {[...text].map((char, i) => (
          <span
            key={i}
            className={`${className} spot-char inline-block text-6xl sm:text-6xl md:text-6xl lg:text-8xl  font-black tracking-tight leading-none`}
            style={{
              opacity: dimOpacity,
              color: baseColor,
              minWidth: char === ' ' ? '0.35em' : undefined
            }}
          >
            {char === ' ' ? '\u00a0' : char}
          </span>
        ))}
      </div>
    </div>
  );
}
