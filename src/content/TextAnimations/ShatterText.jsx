import  { useRef, useEffect } from "react";
import gsap from "gsap";

/**
 * ShatterText
 * Hover-triggered "shatter physics" text animation.
 * Letters fall apart with gravity + random rotation, then bounce back into place.
 *
 * Install first:
 *   npm install gsap
 *
 * Usage:
 *   <ShatterText text="SHATTER PHYSICS" />
 */
export default function ShatterText({
  text = "SHATTER PHYSICS",
  className = "",
}) {
  const containerRef = useRef(null);
  const spansRef = useRef([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    spansRef.current = Array.from(
      containerRef.current.querySelectorAll("span")
    );
  }, [text]);

  const handleEnter = () => {
    if (isPlayingRef.current) return;
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
          y: gsap.utils.random(30, 55),
          x: gsap.utils.random(-15, 15),
          rotation: gsap.utils.random(-90, 90),
          opacity: 0.3,
          color: "#ff2d78",
          duration: 0.35,
          ease: "power2.in",
        },
        i * 0.012
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
          color: "currentColor",
          duration: 0.6,
          ease: "bounce.out",
        },
        "+=0.05"
      );
    });
  };

  return (
    <h2
      ref={containerRef}
      onMouseEnter={handleEnter}
      className={
        "select-none cursor-pointer text-4xl md:text-5xl font-bold text-white " +
        className
      }
    >
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h2>
  );
}

/* ----------------------------------------------------------------------
   Demo page wrapper (optional) — drop this in App.jsx to preview it
   standalone with Tailwind's dark background.
---------------------------------------------------------------------- */
export function ShatterTextDemo() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12">
        <ShatterText text="SHATTER PHYSICS" />
      </div>
    </div>
  );
}
