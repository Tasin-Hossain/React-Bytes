import React, { useEffect, useRef } from "react";
import gsap from "gsap";



function splitWithHighlights(text, bits) {
  if (!bits || bits.length === 0) return [{ text, hi: false }];
  let remaining = text;
  const out = [];
  while (remaining.length > 0) {
    let idx = -1, bit = null;
    for (const b of bits) {
      const i = remaining.indexOf(b);
      if (i !== -1 && (idx === -1 || i < idx)) { idx = i; bit = b; }
    }
    if (idx === -1) { out.push({ text: remaining, hi: false }); break; }
    if (idx > 0) out.push({ text: remaining.slice(0, idx), hi: false });
    out.push({ text: bit, hi: true });
    remaining = remaining.slice(idx + bit.length);
  }
  return out;
}

// direction -> { from, to, position } for the background-size wipe
function bgParams(direction) {
  switch (direction) {
    case "right":  return { from: "0% 100%", to: "100% 100%", position: "right center" };
    case "top":    return { from: "100% 0%", to: "100% 100%", position: "center top" };
    case "bottom": return { from: "100% 0%", to: "100% 100%", position: "center bottom" };
    case "left":
    default:       return { from: "0% 100%", to: "100% 100%", position: "left center" };
  }
}

export default function BlurHighlight({
  children,
  as = "p",
  direction = "left",
  highlightedBits = [],
  maskColor = "#7C3AED",
  textColor = "inherit",
  revealDuration = 0.6,
  revealDelay = 0,
  staggerAmount = 0.35,
  viewportOptions = { once: true, amount: 0.6 },
  rootMargin = "0px 0px -100px 0px",
  className = "",
  style = {},
}) {
  const Tag = as;
  const wrapperRef = useRef(null);
  const segments = splitWithHighlights(String(children), highlightedBits);
  const bg = bgParams(direction);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const pills = el.querySelectorAll(".mr-pill");

    const runAnimation = () => {
      gsap.fromTo(
        el,
        { autoAlpha: 0.25, filter: "blur(9px)" },
        { autoAlpha: 1, filter: "blur(0px)", duration: revealDuration + 0.2, ease: "power2.out", delay: revealDelay }
      );
      gsap.fromTo(
        pills,
        { backgroundSize: bg.from },
        {
          backgroundSize: bg.to,
          duration: revealDuration,
          ease: "power3.out",
          delay: revealDelay + revealDuration * 0.3,
          stagger: { amount: staggerAmount },
        }
      );
    };

    const resetAnimation = () => {
      gsap.set(el, { autoAlpha: 0.25, filter: "blur(9px)" });
      gsap.set(pills, { backgroundSize: bg.from });
    };

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runAnimation();
          if (viewportOptions.once !== false) observer.unobserve(el);
        } else if (viewportOptions.once === false) {
          resetAnimation();
        }
      }),
      { rootMargin, threshold: [viewportOptions.amount ?? 0.6] }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  return (
    <Tag ref={wrapperRef} className={`mr-highlight ${className}`} style={{ color: textColor, ...style }}>
      {segments.map((seg, i) =>
        seg.hi ? (
          <span
            className="mr-pill"
            key={i}
            style={{
              backgroundImage: `linear-gradient(${maskColor}, ${maskColor})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: bg.position,
              backgroundSize: bg.from,
            }}
          >
            {seg.text}
          </span>
        ) : (
          <React.Fragment key={i}>{seg.text}</React.Fragment>
        )
      )}
      <style>{`
        .mr-highlight { max-width: 100%; }
        .mr-pill {
          padding: 0.05em 0.3em;
          border-radius: 0.4em;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
        }
      `}</style>
    </Tag>
  );
}