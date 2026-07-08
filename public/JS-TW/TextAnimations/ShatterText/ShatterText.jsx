// JS-TW variant 
import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function ShatterText({
  text = "SHATTER PHYSICS",
  className = "",
  textClassName = "text-6xl sm:text-6xl md:text-6xl lg:text-8xl font-bold",
  color = "#ffffff",
  trigger = "hover",              // "hover" | "click"
  minY = 30,
  maxY = 55,
  minX = -15,
  maxX = 15,
  minRotation = -90,
  maxRotation = 90,
  shatterOpacity = 0.3,
  shatterColor = "#ff2d78",
  resetColor,
  fallDuration = 0.35,
  reassembleDuration = 0.6,
  fallEase = "power2.in",
  reassembleEase = "bounce.out",
  stagger = 0.012,
  reassembleGap = 0.05,
  disabled = false,
}) {
  const containerRef = useRef(null);
  const spansRef = useRef([]);
  const isPlayingRef = useRef(false);
  const idleColor = resetColor || color;

  useEffect(() => {
    spansRef.current = Array.from(
      containerRef.current.querySelectorAll("span")
    );
  }, [text]);

  const shatter = () => {
    if (disabled || isPlayingRef.current) return;
    isPlayingRef.current = true;

    const spans = spansRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        isPlayingRef.current = false;
      },
    });

    // Fall apart: each letter gets random gravity drop, drift, and spin
    spans.forEach((span, i) => {
      tl.to(
        span,
        {
          y: gsap.utils.random(minY, maxY),
          x: gsap.utils.random(minX, maxX),
          rotation: gsap.utils.random(minRotation, maxRotation),
          opacity: shatterOpacity,
          color: shatterColor,
          duration: fallDuration,
          ease: fallEase,
        },
        i * stagger
      );
    });

    // Reassemble with a bounce
    spans.forEach((span) => {
      tl.to(
        span,
        {
          y: 0,
          x: 0,
          rotation: 0,
          opacity: 1,
          color: idleColor,
          duration: reassembleDuration,
          ease: reassembleEase,
        },
        `+=${reassembleGap}`
      );
    });
  };

  const eventProps =
    trigger === "click"
      ? { onClick: shatter }
      : { onMouseEnter: shatter };

  return (
    <h2
      ref={containerRef}
      {...eventProps}
      className={`select-none cursor-pointer flex flex-wrap justify-center px-2 ${textClassName} ${className}`}
    >
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block" style={{ color: idleColor }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h2>
  );
}
