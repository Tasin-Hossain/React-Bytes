const code = `
import { useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./MagneticText.css"; // see companion CSS below

/* ── helpers ─────────────────────────────────────────────── */
function interpolateColor(colors, t) {
  if (!colors || colors.length === 0) return "#ffffff";
  if (colors.length === 1) return colors[0];

  const parse = (hex) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  };

  const scaled = t * (colors.length - 1);
  const lo = Math.floor(scaled);
  const hi = Math.min(lo + 1, colors.length - 1);
  const frac = scaled - lo;
  const [r1, g1, b1] = parse(colors[lo]);
  const [r2, g2, b2] = parse(colors[hi]);
  return \`rgb(\${Math.round(r1 + (r2 - r1) * frac)},\${Math.round(
    g1 + (g2 - g1) * frac
  )},\${Math.round(b1 + (b2 - b1) * frac)})\`;
}

/* ── MagneticChar ────────────────────────────────────────── */
function MagneticChar({
  char,
  index,
  totalChars,
  fontSize,
  baseColor,
  letterSpacing,
  gap,
  magnetRadius,
  magnetStrength,
  attractDuration,
  returnDuration,
  hoverColors,
  entranceAnim,
  entranceStagger,
  entranceDuration,
  entranceDelay,
}) {
  const ref = useRef(null);

  /* entrance animation */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (entranceAnim === "none") {
      gsap.set(el, { opacity: 1 });
      return;
    }
    const delay = entranceDelay + index * entranceStagger;
    const fromMap = {
      fadeUp: { y: 60, opacity: 0 },
      scaleIn: { scale: 0, opacity: 0, rotation: gsap.utils.random(-20, 20) },
      slideLeft: { x: -60, opacity: 0 },
      blur: { filter: "blur(24px)", opacity: 0, scale: 1.3 },
    };
    const toMap = {
      fadeUp: { y: 0, opacity: 1, ease: "expo.out" },
      scaleIn: { scale: 1, opacity: 1, rotation: 0, ease: "back.out(2)" },
      slideLeft: { x: 0, opacity: 1, ease: "expo.out" },
      blur: { filter: "blur(0px)", opacity: 1, scale: 1, ease: "expo.out" },
    };
    gsap.fromTo(
      el,
      fromMap[entranceAnim] ?? fromMap.fadeUp,
      {
        ...(toMap[entranceAnim] ?? toMap.fadeUp),
        duration: entranceDuration,
        delay,
      }
    );
  }, [
    entranceAnim,
    entranceDelay,
    entranceStagger,
    entranceDuration,
    index,
  ]);

  /* magnetic mouse tracking */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < magnetRadius) {
        const eased = ((magnetRadius - dist) / magnetRadius) ** 2;
        const color = interpolateColor(
          hoverColors,
          index / Math.max(totalChars - 1, 1)
        );
        gsap.to(el, {
          x: dx * eased * magnetStrength,
          y: dy * eased * magnetStrength,
          color,
          duration: attractDuration,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(el, {
          x: 0,
          y: 0,
          color: baseColor,
          duration: returnDuration,
          ease: "elastic.out(1,0.4)",
          overwrite: "auto",
        });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [
    index,
    totalChars,
    magnetRadius,
    magnetStrength,
    attractDuration,
    returnDuration,
    hoverColors,
    baseColor,
  ]);

  return (
    <span
      ref={ref}
      className={styles.char}
      style={{
        fontSize,
        color: baseColor,
        letterSpacing,
        marginRight: gap,
        opacity: entranceAnim === "none" ? 1 : 0,
      }}
    >
      {char === " " ? "\\u00A0" : char}
    </span>
  );
}

/* ── MagneticCursor ──────────────────────────────────────── */
function MagneticCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const onMove = (e) => {
      gsap.to(dot, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.06,
        ease: "none",
      });
      gsap.to(ring, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.18,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.cursorDot} />
      <div ref={ringRef} className={styles.cursorRing} />
    </>
  );
}

/* ── MagneticText (default export) ──────────────────────── */
export default function MagneticText({
  // text
  text = "ATTRACT",
  subtitle = "PULL · PUSH · REPEL",
  // typography
  fontSize = "clamp(40px, 13vw, 85px)",
  subtitleSize = "22px",
  letterSpacing = "0.05em",
  // colors
  textColor = "var(--text-primary)",
  subtitleColor = "var(--text-muted)",
  hoverColors = ["#ff6b6b", "#f7c948", "#4ecdc4", "#a78bfa"],
  // animation
  magnetRadius = 120,
  magnetStrength = 0.55,
  attractDuration = 0.25,
  returnDuration = 0.6,
  entranceAnim = "fadeUp",
  entranceStagger = 0.04,
  entranceDuration = 0.7,
  entranceDelay = 0.1,
  // visibility
  showCursor = true,
  showSubtitle = true,
  // layout
  align = "center",
  gap = "0px",
}) {
  const mainChars = [...text];
  const subChars = [...subtitle];

  const alignStyle = {
    left: { alignItems: "flex-start", textAlign: "left" },
    center: { alignItems: "center", textAlign: "center" },
    right: { alignItems: "flex-end", textAlign: "right" },
  }[align] ?? { alignItems: "center", textAlign: "center" };

  const justifyContent =
    { left: "flex-start", center: "center", right: "flex-end" }[align] ??
    "center";

  const sharedCharProps = {
    magnetRadius,
    magnetStrength,
    attractDuration,
    returnDuration,
    hoverColors,
    entranceAnim,
    entranceStagger,
    entranceDuration,
    entranceDelay,
    gap,
  };

  return (
    <div
      className={styles.wrapper}
      style={{ cursor: showCursor ? "none" : "default", ...alignStyle }}
    >
      {showCursor && <MagneticCursor />}

      {/* main text */}
      <div className={styles.line} style={{ justifyContent }}>
        {mainChars.map((ch, i) => (
          <MagneticChar
            key={i}
            char={ch}
            index={i}
            totalChars={mainChars.length}
            fontSize={fontSize}
            baseColor={textColor}
            letterSpacing={letterSpacing}
            {...sharedCharProps}
          />
        ))}
      </div>

      {/* subtitle */}
      {showSubtitle && (
        <div className={\`\${styles.line} \${styles.subtitle}\`} style={{ justifyContent }}>
          {subChars.map((ch, i) => (
            <MagneticChar
              key={i}
              char={ch}
              index={i}
              totalChars={subChars.length}
              fontSize={subtitleSize}
              baseColor={subtitleColor}
              letterSpacing="0.08em"
              {...sharedCharProps}
              entranceDelay={
                entranceDelay + mainChars.length * entranceStagger + 0.1
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
`;
export default code;
