import { useState, useCallback, useRef } from "react";

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
  externalTrigger
}) {
  const [triggered, setTriggered] = useState(false);
  const [animKey, setAnimKey]     = useState(0);
  const timerRef                  = useRef(null);

  const isTriggered = externalTrigger !== undefined ? externalTrigger : triggered;

  const isBarrel = direction === "right" || direction === "left";
  const barrelDir = direction === "left" ? 1 : -1; // left flips the rotation sign

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
  // right: base exits left (-90deg), active enters from right (90deg)
  // left:  base exits right (90deg),  active enters from left (-90deg)
  const barrelBaseTransform   = isTriggered
    ? `perspective(400px) rotateY(${barrelDir * -90}deg) translateZ(${BARREL_Z})`
    : `perspective(400px) rotateY(0deg) translateZ(0px)`;
  const barrelActiveTransform = isTriggered
    ? `perspective(400px) rotateY(0deg) translateZ(0px)`
    : `perspective(400px) rotateY(${barrelDir * 90}deg) translateZ(${BARREL_Z})`;

  return (
    <span
      key={animKey}
      className={`inline-flex flex-wrap select-none cursor-default ${className}`}
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
              width:          isSpace ? "0.3em" : undefined,
              transformStyle: isBarrel ? "preserve-3d" : undefined,
            }}
          >
            {/* base layer */}
            <span
              className={`block ${fontClass} ${tracking} ${textClassName}`}
              style={{
                ...(resolvedFontSize && { fontSize: resolvedFontSize }),
                ...(!hasGradient && { color: baseColor }),
                ...gradientStyle,
                ...getTransitionStyle(delay),
                transform:          isBarrel ? barrelBaseTransform  : (isTriggered ? `translateY(${exitY})` : "translateY(0%)"),
                opacity:            isBarrel ? (isTriggered ? 0 : 1) : undefined,
                willChange:         "transform",
                backfaceVisibility: "hidden",
              }}
            >
              {isSpace ? "\u00A0" : char}
            </span>

            {/* active layer */}
            <span
              className={`absolute inset-0 flex items-center justify-center ${fontClass} ${tracking} ${resolvedActiveClass}`}
              style={{
                ...(resolvedFontSize && { fontSize: resolvedFontSize }),
                ...(!hasActiveGradient && { color: activeColor }),
                ...activeGradientStyle,
                ...getTransitionStyle(delay),
                transform:          isBarrel ? barrelActiveTransform : (isTriggered ? "translateY(0%)" : `translateY(${enterY})`),
                opacity:            isBarrel ? (isTriggered ? 1 : 0) : undefined,
                willChange:         "transform",
                backfaceVisibility: "hidden",
              }}
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