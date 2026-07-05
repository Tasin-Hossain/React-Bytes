import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * RainDropText
 * Props:
 *  - text       {string}  — display text
 *  - delay      {number}  — per-char stagger delay in seconds (default 0.07)
 *  - duration   {number}  — each char animation duration (default 0.9)
 *  - repeat     {boolean} — loop the animation (default false)
 *  - className  {string}  — extra classes for the wrapper
 */
export default function RainDropText({
  text = "RAIN DROP",
  delay = 0.07,
  duration = 0.9,
  repeat = false,
  className = "",
}) {
  const containerRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const spans = container.querySelectorAll(".rain-char");

    // kill previous timeline
    if (tlRef.current) tlRef.current.kill();

    gsap.set(spans, { y: -120, opacity: 0, scaleY: 1.4 });

    const tl = gsap.timeline({
      repeat: repeat ? -1 : 0,
      repeatDelay: 1.2,
    });

    spans.forEach((span, i) => {
      tl.fromTo(
        span,
        { y: -120, opacity: 0, scaleY: 1.4 },
        {
          y: 0,
          opacity: 1,
          scaleY: 1,
          ease: "bounce.out",
          duration,
        },
        i * delay
      );
    });

    tlRef.current = tl;

    return () => tl.kill();
  }, [text, delay, duration, repeat]);

  const play = () => {
    if (tlRef.current) {
      tlRef.current.restart();
    }
  };

  const chars = [...text];

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Text stage */}
      <div
        ref={containerRef}
        className="flex items-end justify-center overflow-hidden"
      >
        {chars.map((char, i) => (
          <span
            key={i}
            className="rain-char inline-block text-6xl font-black leading-none tracking-tight select-none"
            style={{
              display: "inline-block",
              minWidth: char === " " ? "0.5em" : undefined,
            }}
          >
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
      </div>

      {/* Replay button */}
      <button
        onClick={play}
        className="px-5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        ▶ Replay
      </button>
    </div>
  );
}
