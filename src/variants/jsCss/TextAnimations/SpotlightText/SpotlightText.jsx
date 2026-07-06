// JS-CSS variant
import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function SpotlightText({
  text = "SPOTLIGHT",
  charDelay = 0.09,
  duration = 0.25,
  repeat = false,
  dimOpacity = 0.08,
  baseColor = "#8a8a86",
  spotColor = "#e24b4a",
  ease = "power2.out",
  fontSize = "clamp(3.5rem, 8vw, 6rem)",
  fontWeight = "900",
  letterSpacing = "-0.02em",
  className = "",
}) {
  const containerRef = useRef(null);
  const tlRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const buildTimeline = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const spans = container.querySelectorAll(".spot-char");

    if (tlRef.current) tlRef.current.kill();

    gsap.set(spans, { opacity: dimOpacity, color: baseColor });

    const tl = gsap.timeline({
      repeat: repeat ? -1 : 0,
      repeatDelay: 1.2,
      onRepeat() {
        gsap.set(spans, { opacity: dimOpacity, color: baseColor });
      },
    });

    spans.forEach((s, i) => {
      const t = i * charDelay;
      tl.to(s, { opacity: 1, color: spotColor, ease, duration }, t);
      tl.to(s, { opacity: 0.7, duration: duration * 0.6 }, t + duration);
      tl.to(s, { opacity: 1, color: baseColor, duration: duration * 0.8 }, t + duration * 1.6);
    });

    tlRef.current = tl;
  });

  useEffect(() => {
    buildTimeline();
    return () => tlRef.current?.kill();
  }, [text, charDelay, duration, repeat, dimOpacity, baseColor, spotColor, ease, buildTimeline]);

  const style = {
    outer: {
      display:       "flex",
      flexDirection: "column",
      alignItems:    "center",
      gap:           "1.5rem",
    },
    container: {
      display:        "flex",
      flexWrap:       "wrap",
      alignItems:     "center",
      justifyContent: "center",
    },
    char: (char) => ({
      display:       "inline-block",
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight:    1,
      userSelect:    "none",
      opacity:       dimOpacity,
      color:         baseColor,
      minWidth:      char === " " ? "0.35em" : undefined,
    }),
  };

  const classes = `${className}`;

  return (
    <div style={style.outer} className={classes}>
      <div ref={containerRef} style={style.container}>
        {[...text].map((char, i) => (
          <span key={i} className="spot-char" style={style.char(char)}>
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}