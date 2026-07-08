// JS-TW variant 
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function RainDropText({
  text = "RAIN DROP",
  delay = 0.07,
  duration = 0.9,
  dropHeight = 100,
  ease = "bounce.out",
  color = "#111111",
  repeat = false,
  repeatDelay = 1.2,
  textClassName = "text-5xl sm:text-5xl md:text-6xl lg:text-8xl",
  className = "",
}) {
  const containerRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const spans = container.querySelectorAll(".rain-char");

    if (tlRef.current) tlRef.current.kill();

    gsap.set(spans, { y: -dropHeight, opacity: 0, scaleY: 1.4 });

    const tl = gsap.timeline({ repeat: repeat ? -1 : 0, repeatDelay });

    spans.forEach((span, i) => {
      tl.fromTo(
        span,
        { y: -dropHeight, opacity: 0, scaleY: 1.4 },
        { y: 0, opacity: 1, scaleY: 1, ease, duration },
        i * delay
      );
    });

    tlRef.current = tl;
    return () => tl.kill();
  }, [text, delay, duration, dropHeight, ease, repeat, repeatDelay]);

  const chars = [...text];

  return (
    <div className={`flex flex-col items-center gap-6 w-full ${className}`}>
      <div
        ref={containerRef}
        className="flex flex-wrap items-end justify-center overflow-hidden px-2"
      >
        {chars.map((char, i) => (
          <span
            key={i}
            className={`rain-char inline-block font-black leading-none tracking-tight select-none ${textClassName}`}
            style={{
              display:  "inline-block",
              color,
              minWidth: char === " " ? "0.3em" : undefined,
            }}
          >
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}