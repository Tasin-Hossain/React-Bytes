import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * SpotlightText
 * Props:
 *  - text        {string}  — display text
 *  - charDelay   {number}  — stagger between each char reveal (default 0.09)
 *  - duration    {number}  — each char full reveal duration (default 0.25)
 *  - repeat      {boolean} — loop the animation (default false)
 *  - dimOpacity  {number}  — base dim opacity before reveal (default 0.08)
 *  - className   {string}  — extra classes on wrapper
 */
export default function SpotlightText({
  text = "SPOTLIGHT",
  charDelay = 0.09,
  duration = 0.25,
  repeat = false,
  dimOpacity = 0.08,
  className = "",
}) {
  const containerRef = useRef(null);
  const tlRef = useRef(null);

  const buildTimeline = () => {
    const container = containerRef.current;
    if (!container) return;
    const spans = container.querySelectorAll(".spot-char");

    if (tlRef.current) tlRef.current.kill();

    // all chars start dim
    gsap.set(spans, { opacity: dimOpacity });

    const tl = gsap.timeline({
      repeat: repeat ? -1 : 0,
      repeatDelay: 1.2,
      onRepeat() {
        gsap.set(spans, { opacity: dimOpacity });
      },
    });

    spans.forEach((s, i) => {
      const t = i * charDelay;
      // bright flash
      tl.to(s, { opacity: 1, ease: "power2.out", duration }, t);
      // slight dim — like beam passing
      tl.to(s, { opacity: 0.7, duration: duration * 0.6 }, t + duration);
      // settle back bright
      tl.to(s, { opacity: 1, duration: duration * 0.8 }, t + duration * 1.6);
    });

    tlRef.current = tl;
  };

  useEffect(() => {
    buildTimeline();
    return () => tlRef.current?.kill();
  }, [text, charDelay, duration, repeat, dimOpacity]);

  const replay = () => buildTimeline();

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Text */}
      <div
        ref={containerRef}
        className="flex flex-wrap items-center justify-center"
      >
        {[...text].map((char, i) => (
          <span
            key={i}
            className="spot-char inline-block text-6xl font-black tracking-tight leading-none select-none"
            style={{
              opacity: dimOpacity,
              minWidth: char === " " ? "0.35em" : undefined,
            }}
          >
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
      </div>

      {/* Replay */}
      <button
        onClick={replay}
        className="px-5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        ▶ Replay
      </button>
    </div>
  );
}
