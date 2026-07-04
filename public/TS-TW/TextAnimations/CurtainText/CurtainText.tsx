// TS-TW variant
import { useState, useCallback, useRef, CSSProperties } from "react";

type Direction = "up" | "down" | "left" | "right";

interface CurtainTextProps {
  text?:             string;
  direction?:        Direction;
  baseColor?:        string;
  activeColor?:      string;
  fontClass?:        string;
  fontSize?:         string;
  textClassName?:    string;
  activeClassName?:  string;
  tracking?:         string;
  staggerMs?:        number;
  durationMs?:       number;
  easing?:           string;
  resetOnLeave?:     boolean;
  className?:        string;
  externalTrigger?:  boolean;
}

export default function CurtainText({
  text            = "CURTAIN",
  direction       = "up",
  baseColor       = "#ffffff",
  activeColor     = "#a889c7",
  fontClass       = "font-black",
  fontSize,
  textClassName   = "",
  activeClassName = "",
  tracking        = "tracking-widest",
  staggerMs       = 60,
  durationMs      = 400,
  easing          = "cubic-bezier(.77,0,.18,1)",
  resetOnLeave    = true,
  className       = "",
  externalTrigger,
}: CurtainTextProps) {
  const [triggered, setTriggered] = useState(false);
  const [animKey, setAnimKey]     = useState(0);
  const timerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTriggered = externalTrigger !== undefined ? externalTrigger : triggered;

  const isBarrel  = direction === "right" || direction === "left";
  const barrelDir = direction === "left" ? 1 : -1;

  const exitY  = direction === "up" ? "-100%" : "100%";
  const enterY = direction === "up" ? "100%"  : "-100%";

  const hasTailwindFontSize = /\btext-\S+/.test(textClassName);
  const resolvedFontSize    = hasTailwindFontSize ? undefined : (fontSize ?? "clamp(1.5rem, 6vw, 5rem)");

  const hasGradient     = /\bbg-gradient\S*/.test(textClassName) || /\bfrom-\S+/.test(textClassName);
  const hasAnimGradient = hasGradient && /\banimate-\S+/.test(textClassName);
  const gradientStyle   = hasAnimGradient
    ? { backgroundSize: "200% 200%", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }
    : {};

  const resolvedActiveClass = activeClassName || textClassName;
  const hasActiveGradient   = /\bbg-gradient\S*/.test(resolvedActiveClass) || /\bfrom-\S+/.test(resolvedActiveClass);
  const hasActiveAnim       = hasActiveGradient && /\banimate-\S+/.test(resolvedActiveClass);
  const activeGradientStyle = hasActiveAnim
    ? { backgroundSize: "200% 200%", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }
    : hasActiveGradient
    ? { backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }
    : {};

  const handleEnter = useCallback(() => {
    if (!resetOnLeave) {
      setTriggered(false);
      setAnimKey(k => k + 1);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setTriggered(true), 20);
    } else {
      setTriggered(true);
    }
  }, [resetOnLeave]);

  const handleLeave = useCallback(() => {
    if (resetOnLeave) setTriggered(false);
  }, [resetOnLeave]);

  const getTransitionStyle = (delay: number): CSSProperties => ({
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
    base: (delay: number): CSSProperties => ({
      ...(resolvedFontSize && { fontSize: resolvedFontSize }),
      ...(!hasGradient && { color: baseColor }),
      ...gradientStyle,
      willChange:         "transform",
      backfaceVisibility: "hidden" as const,
      transform:          isBarrel
        ? barrelBaseTransform
        : (isTriggered ? `translateY(${exitY})` : "translateY(0%)"),
      ...(isBarrel && { opacity: isTriggered ? 0 : 1 }),
      ...getTransitionStyle(delay),
    }),
    active: (delay: number): CSSProperties => ({
      ...(resolvedFontSize && { fontSize: resolvedFontSize }),
      ...(!hasActiveGradient && { color: activeColor }),
      ...activeGradientStyle,
      willChange:         "transform",
      backfaceVisibility: "hidden" as const,
      transform:          isBarrel
        ? barrelActiveTransform
        : (isTriggered ? "translateY(0%)" : `translateY(${enterY})`),
      ...(isBarrel && { opacity: isTriggered ? 1 : 0 }),
      ...getTransitionStyle(delay),
    }),
  };

  const classes = `inline-flex flex-wrap select-none cursor-default ${className}`;

  return (
    <span
      key={animKey}
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
            className="relative overflow-hidden leading-none"
            style={{
              ...(isSpace  && { width: "0.3em" }),
              ...(isBarrel && { transformStyle: "preserve-3d" as const }),
            }}
          >
            <span
              className={`block ${fontClass} ${tracking} ${textClassName}`}
              style={style.base(delay)}
            >
              {isSpace ? "\u00A0" : char}
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center ${fontClass} ${tracking} ${resolvedActiveClass}`}
              style={style.active(delay)}
              aria-hidden="true"
            >
              {isSpace ? "\u00A0" : char}
            </span>
          </span>
        );
      })}
    </span>
  );
}