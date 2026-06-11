const code = `// JS-CSS variant
import { useState, useCallback, useRef } from "react";

export default function CurtainText({
  text            = "CURTAIN",
  direction       = "up",
  baseColor       = "#ffffff",
  activeColor     = "#a889c7",
  fontWeight      = "900",
  fontSize        = "clamp(1.5rem, 6vw, 5rem)",
  letterSpacing   = "0.1em",
  staggerMs       = 60,
  durationMs      = 400,
  easing          = "cubic-bezier(.77,0,.18,1)",
  resetOnLeave    = true,
  className       = "",
}) {
  const [triggered, setTriggered] = useState(false);
  const [animKey, setAnimKey]     = useState(0);
  const timerRef                  = useRef(null);

  const exitY  = direction === "up" ? "-100%" : "100%";
  const enterY = direction === "up" ? "100%"  : "-100%";

  const handleEnter = useCallback(() => {
    if (!resetOnLeave) {
      setTriggered(false);
      setAnimKey(k => k + 1);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setTriggered(true), 20);
    } else {
      setTriggered(true);
    }
  }, [resetOnLeave]);

  const handleLeave = useCallback(() => {
    if (resetOnLeave) setTriggered(false);
  }, [resetOnLeave]);

  const getTransitionStyle = (delay) => ({
    transitionProperty:       "transform",
    transitionDuration:       \`\${durationMs}ms\`,
    transitionTimingFunction: easing,
    transitionDelay:          \`\${delay}ms\`,
  });

  const style = {
    wrapper: {
      display:    "inline-flex",
      flexWrap:   "wrap",
      userSelect: "none",
      cursor:     "default",
    },
    char: {
      position: "relative",
      overflow: "hidden",
      lineHeight: 1,
    },
    base: (delay) => ({
      display:       "block",
      fontSize,
      fontWeight,
      letterSpacing,
      color:         baseColor,
      willChange:    "transform",
      transform:     triggered ? \`translateY(\${exitY})\` : "translateY(0%)",
      ...getTransitionStyle(delay),
    }),
    active: (delay) => ({
      position:      "absolute",
      inset:         0,
      display:       "flex",
      alignItems:    "center",
      justifyContent:"center",
      fontSize,
      fontWeight,
      letterSpacing,
      color:         activeColor,
      willChange:    "transform",
      transform:     triggered ? "translateY(0%)" : \`translateY(\${enterY})\`,
      ...getTransitionStyle(delay),
    }),
  };

  const classes = \`\${className}\`;

  return (
    <span
      key={animKey}
      style={style.wrapper}
      className={classes}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {text.split("").map((char, i) => {
        const isSpace = char === " ";
        const delay   = i * staggerMs;

        return (
          <span
            key={i}
            style={{
              ...style.char,
              ...(isSpace && { width: "0.3em" }),
            }}
          >
            <span style={style.base(delay)}>
              {isSpace ? "\\u00A0" : char}
            </span>
            <span style={style.active(delay)} aria-hidden="true">
              {isSpace ? "\\u00A0" : char}
            </span>
          </span>
        );
      })}
    </span>
  );
}`;
export default code;
