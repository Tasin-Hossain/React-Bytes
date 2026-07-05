// TS-CSS variant
import { useEffect, useRef, CSSProperties } from "react";
import { gsap } from "gsap";

interface SmokeAwayProps {
  text?:          string;
  smokeY?:        number;
  smokeScale?:    number;
  smokeBlur?:     number;
  returnEase?:    string;
  color?:         string;
  fontSize?:      string;
  fontWeight?:    string | number;
  letterSpacing?: string;
  className?:     string;
}

export default function SmokeAway({
  text = "VANISH",
  smokeY = -20,
  smokeScale = 1.6,
  smokeBlur = 8,
  returnEase = "back.out(2)",
  color = "#d35af8",
  fontSize = "clamp(3.5rem, 8vw, 6rem)",
  fontWeight = "900",
  letterSpacing = "-0.02em",
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

  const style = {
    outer: {
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
    } as CSSProperties,
    container: {
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      flexWrap:       "wrap",
    } as CSSProperties,
    char: (char: string): CSSProperties => ({
      display:       "inline-block",
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight:    1,
      cursor:        "pointer",
      userSelect:    "none",
      color,
      minWidth:      char === " " ? "0.35em" : undefined,
    }),
  };

  const classes = `${className}`;

  return (
    <div style={style.outer} className={classes}>
      <div ref={containerRef} style={style.container}>
        {[...text].map((char, i) => (
          <span
            key={i}
            className="smoke-char"
            style={style.char(char)}
          >
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}