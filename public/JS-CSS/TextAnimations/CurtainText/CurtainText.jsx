// JS-CSS variant
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
  externalTrigger,
}) {
  const [triggered, setTriggered] = useState(false);
  const [animKey, setAnimKey]     = useState(0);
  const timerRef                  = useRef(null);

  const isTriggered = externalTrigger !== undefined ? externalTrigger : triggered;

  const isBarrel  = direction === "right" || direction === "left";
  const barrelDir = direction === "left" ? 1 : -1;

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
    transitionProperty:       "transform, opacity",
    transitionDuration:       `${durationMs}ms`,
    transitionTimingFunction: easing,
    transitionDelay:          `${delay}ms`,
  });

  const BARREL_Z = "60px";
  const barrelBaseTransform   = isTriggered
    ? `perspective(400px) rotateY(${barrelDir * -90}deg) translateZ(${BARREL_Z})`
    : `perspective(400px) rotateY(0deg) translateZ(0px)`;
  const barrelActiveTransform = isTriggered
    ? `perspective(400px) rotateY(0deg) translateZ(0px)`
    : `perspective(400px) rotateY(${barrelDir * 90}deg) translateZ(${BARREL_Z})`;

  const style = {
    wrapper: {
      display:    "inline-flex",
      flexWrap:   "wrap",
      userSelect: "none",
      cursor:     "default",
    },
    char: (isSpace) => ({
      position:       "relative",
      overflow:       "hidden",
      lineHeight:     1,
      ...(isSpace  && { width: "0.3em" }),
      ...(isBarrel && { transformStyle: "preserve-3d" }),
    }),
    base: (delay) => ({
      display:            "block",
      fontSize,
      fontWeight,
      letterSpacing,
      color:              baseColor,
      willChange:         "transform",
      backfaceVisibility: "hidden",
      transform:          isBarrel
        ? barrelBaseTransform
        : (isTriggered ? `translateY(${exitY})` : "translateY(0%)"),
      ...(isBarrel && { opacity: isTriggered ? 0 : 1 }),
      ...getTransitionStyle(delay),
    }),
    active: (delay) => ({
      position:           "absolute",
      inset:              0,
      display:            "flex",
      alignItems:         "center",
      justifyContent:     "center",
      fontSize,
      fontWeight,
      letterSpacing,
      color:              activeColor,
      willChange:         "transform",
      backfaceVisibility: "hidden",
      transform:          isBarrel
        ? barrelActiveTransform
        : (isTriggered ? "translateY(0%)" : `translateY(${enterY})`),
      ...(isBarrel && { opacity: isTriggered ? 1 : 0 }),
      ...getTransitionStyle(delay),
    }),
  };

  const classes = `${className}`;

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
          <span key={i} style={style.char(isSpace)}>
            <span style={style.base(delay)}>
              {isSpace ? "\u00A0" : char}
            </span>
            <span style={style.active(delay)} aria-hidden="true">
              {isSpace ? "\u00A0" : char}
            </span>
          </span>
        );
      })}
    </span>
  );
}