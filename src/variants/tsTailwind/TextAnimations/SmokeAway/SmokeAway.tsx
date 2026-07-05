// TS-TW variant
import { useEffect, useRef, CSSProperties } from "react";
import { gsap } from "gsap";

interface SmokeAwayProps {
  text?:       string;
  smokeY?:     number;
  smokeScale?: number;
  smokeBlur?:  number;
  returnEase?: string;
  color?:      string;
  className?:  string;
}

export default function SmokeAway({
  text = "VANISH",
  smokeY = -20,
  smokeScale = 1.6,
  smokeBlur = 8,
  returnEase = "back.out(2)",
  color = "#d35af8",
  className = "",
}: SmokeAwayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const spans = container.querySelectorAll(".smoke-char");
    const handlers: { s: Element; onEnter: () => void; onLeave: () => void }[] = [];

    spans.forEach((s) => {
      const onEnter = () => {
        gsap.to(s, {
          y: smokeY,
          opacity: 0,
          scale: smokeScale,
          filter: `blur(${smokeBlur}px)`,
          duration: 0.4,
          ease: "power3.out",
        });
      };
      const onLeave = () => {
        gsap.to(s, {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.5,
          ease: returnEase,
        });
      };
      s.addEventListener("mouseenter", onEnter);
      s.addEventListener("mouseleave", onLeave);
      handlers.push({ s, onEnter, onLeave });
    });

    return () => {
      handlers.forEach(({ s, onEnter, onLeave }) => {
        s.removeEventListener("mouseenter", onEnter);
        s.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [text, smokeY, smokeScale, smokeBlur, returnEase]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        ref={containerRef}
        className="flex items-center justify-center flex-wrap"
      >
        {[...text].map((char, i) => (
          <span
            key={i}
            className="smoke-char inline-block text-6xl sm:text-6xl md:text-6xl lg:text-8xl font-black tracking-tight leading-none cursor-pointer select-none"
            style={{
              color,
              minWidth: char === " " ? "0.35em" : undefined,
            } as CSSProperties}
          >
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}