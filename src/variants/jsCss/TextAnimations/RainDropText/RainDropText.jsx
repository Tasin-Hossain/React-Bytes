// JS-CSS variant
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
  fontSize = "clamp(3rem, 8vw, 6rem)",
  fontWeight = "900",
  letterSpacing = "-0.02em",
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

  const style = {
    outer: {
      display:       "flex",
      flexDirection: "column",
      alignItems:    "center",
      gap:           "1.5rem",
      width:         "100%",
    },
    container: {
      display:        "flex",
      flexWrap:       "wrap",
      alignItems:     "flex-end",
      justifyContent: "center",
      overflow:       "hidden",
      padding:        "0 0.5rem",
    },
    char: (char) => ({
      display:       "inline-block",
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight:    1,
      userSelect:    "none",
      color,
      minWidth:      char === " " ? "0.3em" : undefined,
    }),
  };

  const classes = `${className}`;

  return (
    <div style={style.outer} className={classes}>
      <div ref={containerRef} style={style.container}>
        {chars.map((char, i) => (
          <span key={i} className="rain-char" style={style.char(char)}>
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}