import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";

/* ── helpers ─────────────────────────────────────────────── */
function interpolateColor(colors, t) {
  if (!colors || colors.length === 0) return "#ffffff";
  if (colors.length === 1) return colors[0];
  const parse = (hex) => {
    const h = hex.replace("#", "");
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  };
  const scaled = t * (colors.length - 1);
  const lo = Math.floor(scaled);
  const hi = Math.min(lo + 1, colors.length - 1);
  const frac = scaled - lo;
  const [r1,g1,b1] = parse(colors[lo]);
  const [r2,g2,b2] = parse(colors[hi]);
  return `rgb(${Math.round(r1+(r2-r1)*frac)},${Math.round(g1+(g2-g1)*frac)},${Math.round(b1+(b2-b1)*frac)})`;
}

const ALIGN_ITEMS    = { left: "items-start",   center: "items-center",  right: "items-end"      };
const TEXT_ALIGN     = { left: "text-left",      center: "text-center",   right: "text-right"     };
const JUSTIFY_CONTENT= { left: "justify-start",  center: "justify-center",right: "justify-end"   };

/* ── useResponsiveFontSize ───────────────────────────────── */
function useResponsiveFontSize(containerRef) {
  const [size, setSize] = useState({ main: "clamp(40px,13vw,85px)", subtitle: "22px", magnetRadius: 120 });

  const compute = useCallback(() => {
    const w = containerRef.current?.offsetWidth ?? window.innerWidth;
    if (w < 360) {
      setSize({ main: "clamp(28px,9vw,40px)", subtitle: "13px", magnetRadius: 60 });
    } else if (w < 480) {
      setSize({ main: "clamp(32px,10vw,52px)", subtitle: "14px", magnetRadius: 70 });
    } else if (w < 640) {
      setSize({ main: "clamp(36px,11vw,64px)", subtitle: "16px", magnetRadius: 85 });
    } else if (w < 768) {
      setSize({ main: "clamp(40px,12vw,72px)", subtitle: "18px", magnetRadius: 100 });
    } else {
      setSize({ main: "clamp(40px,13vw,85px)", subtitle: "22px", magnetRadius: 120 });
    }
  }, [containerRef]);

  useEffect(() => {
    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [compute, containerRef]);

  return size;
}

/* ── MagneticChar ────────────────────────────────────────── */
function MagneticChar({
  char, index, totalChars, fontSize, baseColor, letterSpacing, gap,
  magnetRadius, magnetStrength, attractDuration, returnDuration, hoverColors,
  entranceAnim, entranceStagger, entranceDuration, entranceDelay,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (entranceAnim === "none") { gsap.set(el, { opacity: 1 }); return; }
    const delay = entranceDelay + index * entranceStagger;
    const fromMap = {
      fadeUp:    { y: 60, opacity: 0 },
      scaleIn:   { scale: 0, opacity: 0, rotation: gsap.utils.random(-20, 20) },
      slideLeft: { x: -60, opacity: 0 },
      blur:      { filter: "blur(24px)", opacity: 0, scale: 1.3 },
    };
    const toMap = {
      fadeUp:    { y: 0, opacity: 1, ease: "expo.out" },
      scaleIn:   { scale: 1, opacity: 1, rotation: 0, ease: "back.out(2)" },
      slideLeft: { x: 0, opacity: 1, ease: "expo.out" },
      blur:      { filter: "blur(0px)", opacity: 1, scale: 1, ease: "expo.out" },
    };
    gsap.fromTo(el, fromMap[entranceAnim] ?? fromMap.fadeUp, {
      ...(toMap[entranceAnim] ?? toMap.fadeUp),
      duration: entranceDuration,
      delay,
    });
  }, [entranceAnim, entranceDelay, entranceStagger, entranceDuration, index]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < magnetRadius) {
        const eased = ((magnetRadius - dist) / magnetRadius) ** 2;
        const color = interpolateColor(hoverColors, index / Math.max(totalChars - 1, 1));
        gsap.to(el, { x: dx*eased*magnetStrength, y: dy*eased*magnetStrength, color, duration: attractDuration, ease: "power2.out", overwrite: "auto" });
      } else {
        gsap.to(el, { x: 0, y: 0, color: baseColor, duration: returnDuration, ease: "elastic.out(1,0.4)", overwrite: "auto" });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [index, totalChars, magnetRadius, magnetStrength, attractDuration, returnDuration, hoverColors, baseColor]);

  return (
    <span
      ref={ref}
      className="inline-block select-none will-change-transform"
      style={{ fontSize, color: baseColor, lineHeight: 1, fontFamily: "inherit", letterSpacing, marginRight: gap, opacity: entranceAnim === "none" ? 1 : 0 }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );
}

/* ── MagneticCursor ──────────────────────────────────────── */
function MagneticCursor({ containerRef }) {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current, ring = ringRef.current, container = containerRef?.current;
    if (!dot || !ring || !container) return;
    const onMove  = (e) => {
      const rect = container.getBoundingClientRect();
      gsap.to(dot,  { left: e.clientX-rect.left, top: e.clientY-rect.top, duration: 0.06,  ease: "none" });
      gsap.to(ring, { left: e.clientX-rect.left, top: e.clientY-rect.top, duration: 0.18, ease: "power2.out" });
    };
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.15 });
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.15 });
    container.addEventListener("mousemove",  onMove);
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove",  onMove);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef]);

  const base = "absolute pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 z-[9999] opacity-0 left-[-100px] top-[-100px]";
  return (
    <>
      <div ref={dotRef}  className={`${base} w-1.5 h-1.5 bg-white`} />
      <div ref={ringRef} className={`${base} w-7 h-7 border border-white opacity-40`} />
    </>
  );
}

/* ── MagneticText (default export) ──────────────────────── */
export default function MagneticText({
  text             = "ATTRACT",
  subtitle         = "PULL · PUSH · REPEL",
  fontSize,                          // optional override
  subtitleSize,                      // optional override
  letterSpacing    = "0.05em",
  textColor        = "var(--text-primary)",
  subtitleColor    = "var(--text-muted)",
  hoverColors      = ["#ff6b6b", "#f7c948", "#4ecdc4", "#a78bfa"],
  magnetRadius,                      // optional override
  magnetStrength   = 0.55,
  attractDuration  = 0.25,
  returnDuration   = 0.6,
  entranceAnim     = "fadeUp",
  entranceStagger  = 0.04,
  entranceDuration = 0.7,
  entranceDelay    = 0.1,
  showCursor       = true,
  showSubtitle     = true,
  align            = "center",
  gap              = "0px",
}) {
  const containerRef = useRef(null);
  const responsive   = useResponsiveFontSize(containerRef);

  // prop overrides win, else responsive values
  const resolvedMain     = fontSize      ?? responsive.main;
  const resolvedSub      = subtitleSize  ?? responsive.subtitle;
  const resolvedRadius   = magnetRadius  ?? responsive.magnetRadius;

  const mainChars = [...text];
  const subChars  = [...subtitle];

  const alignItems = ALIGN_ITEMS[align]      ?? "items-center";
  const textAlign  = TEXT_ALIGN[align]       ?? "text-center";
  const justify    = JUSTIFY_CONTENT[align]  ?? "justify-center";

  const sharedCharProps = {
    magnetRadius: resolvedRadius, magnetStrength, attractDuration, returnDuration,
    hoverColors, entranceAnim, entranceStagger, entranceDuration, entranceDelay, gap,
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col ${alignItems} ${textAlign} justify-center w-full h-full px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12`}
      style={{ fontFamily: "'Bebas Neue', sans-serif", cursor: showCursor ? "none" : "default" }}
    >
      {showCursor && <MagneticCursor containerRef={containerRef} />}

      <div className={`relative z-10 flex flex-wrap ${justify}`}>
        {mainChars.map((ch, i) => (
          <MagneticChar
            key={i} char={ch} index={i} totalChars={mainChars.length}
            fontSize={resolvedMain} baseColor={textColor} letterSpacing={letterSpacing}
            {...sharedCharProps}
          />
        ))}
      </div>

      {showSubtitle && (
        <div className={`flex flex-wrap ${justify} mt-2 sm:mt-3 md:mt-4 z-10`}>
          {subChars.map((ch, i) => (
            <MagneticChar
              key={i} char={ch} index={i} totalChars={subChars.length}
              fontSize={resolvedSub} baseColor={subtitleColor} letterSpacing="0.08em"
              {...sharedCharProps}
              entranceDelay={entranceDelay + mainChars.length * entranceStagger + 0.1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
