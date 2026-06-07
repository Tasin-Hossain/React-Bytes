const code = `
import { useRef, useEffect, FC, CSSProperties } from "react";
import gsap from "gsap";
import styles from "./MagneticText.css";

/* ── types ───────────────────────────────────────────────── */
type EntranceAnim = "fadeUp" | "scaleIn" | "slideLeft" | "blur" | "none";
type Align = "left" | "center" | "right";

interface MagneticCharProps {
  char: string;
  index: number;
  totalChars: number;
  fontSize: string;
  baseColor: string;
  letterSpacing: string;
  gap: string;
  magnetRadius: number;
  magnetStrength: number;
  attractDuration: number;
  returnDuration: number;
  hoverColors: string[];
  entranceAnim: EntranceAnim;
  entranceStagger: number;
  entranceDuration: number;
  entranceDelay: number;
}

export interface MagneticTextProps {
  /** Main display text */
  text?: string;
  /** Subtitle below main text */
  subtitle?: string;
  /** CSS font-size value (supports clamp) */
  fontSize?: string;
  /** CSS font-size for subtitle */
  subtitleSize?: string;
  /** CSS letter-spacing */
  letterSpacing?: string;
  /** Base color of main text */
  textColor?: string;
  /** Base color of subtitle text */
  subtitleColor?: string;
  /** Gradient stop colors on hover */
  hoverColors?: string[];
  /** Magnet pull radius in px */
  magnetRadius?: number;
  /** Magnet pull strength (0–1) */
  magnetStrength?: number;
  /** GSAP attract tween duration */
  attractDuration?: number;
  /** GSAP return tween duration */
  returnDuration?: number;
  /** Entrance animation type */
  entranceAnim?: EntranceAnim;
  /** Per-character stagger in seconds */
  entranceStagger?: number;
  /** Entrance tween duration */
  entranceDuration?: number;
  /** Initial entrance delay */
  entranceDelay?: number;
  /** Show custom cursor */
  showCursor?: boolean;
  /** Show subtitle row */
  showSubtitle?: boolean;
  /** Text alignment */
  align?: Align;
  /** Gap between characters */
  gap?: string;
}

/* ── helpers ─────────────────────────────────────────────── */
function interpolateColor(colors: string[], t: number): string {
  if (!colors || colors.length === 0) return "#ffffff";
  if (colors.length === 1) return colors[0];

  const parse = (hex: string): [number, number, number] => {
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
const MagneticChar: FC<MagneticCharProps> = ({
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
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  /* entrance animation */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (entranceAnim === "none") {
      gsap.set(el, { opacity: 1 });
      return;
    }
    const delay = entranceDelay + index * entranceStagger;

    type GsapVars = gsap.TweenVars;
    const fromMap: Record<string, GsapVars> = {
      fadeUp: { y: 60, opacity: 0 },
      scaleIn: { scale: 0, opacity: 0, rotation: gsap.utils.random(-20, 20) },
      slideLeft: { x: -60, opacity: 0 },
      blur: { filter: "blur(24px)", opacity: 0, scale: 1.3 },
    };
    const toMap: Record<string, GsapVars> = {
      fadeUp: { y: 0, opacity: 1, ease: "expo.out" },
      scaleIn: { scale: 1, opacity: 1, rotation: 0, ease: "back.out(2)" },
      slideLeft: { x: 0, opacity: 1, ease: "expo.out" },
      blur: { filter: "blur(0px)", opacity: 1, scale: 1, ease: "expo.out" },
    };

    gsap.fromTo(el, fromMap[entranceAnim] ?? fromMap.fadeUp, {
      ...(toMap[entranceAnim] ?? toMap.fadeUp),
      duration: entranceDuration,
      delay,
    });
  }, [entranceAnim, entranceDelay, entranceStagger, entranceDuration, index]);

  /* magnetic mouse tracking */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
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

  const charStyle: CSSProperties = {
    fontSize,
    color: baseColor,
    letterSpacing,
    marginRight: gap,
    opacity: entranceAnim === "none" ? 1 : 0,
  };

  return (
    <span ref={ref} className={styles.char} style={charStyle}>
      {char === " " ? "\\u00A0" : char}
    </span>
  );
};

/* ── MagneticCursor ──────────────────────────────────────── */
const MagneticCursor: FC = () => {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const onMove = (e: MouseEvent) => {
      gsap.to(dot,  { left: e.clientX, top: e.clientY, duration: 0.06,  ease: "none" });
      gsap.to(ring, { left: e.clientX, top: e.clientY, duration: 0.18, ease: "power2.out" });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={dotRef}  className={styles.cursorDot}  />
      <div ref={ringRef} className={styles.cursorRing} />
    </>
  );
};

/* ── MagneticText (default export) ──────────────────────── */
const MagneticText: FC<MagneticTextProps> = ({
  text             = "ATTRACT",
  subtitle         = "PULL · PUSH · REPEL",
  fontSize         = "clamp(40px, 13vw, 85px)",
  subtitleSize     = "22px",
  letterSpacing    = "0.05em",
  textColor        = "var(--text-primary)",
  subtitleColor    = "var(--text-muted)",
  hoverColors      = ["#ff6b6b", "#f7c948", "#4ecdc4", "#a78bfa"],
  magnetRadius     = 120,
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
}) => {
  const mainChars = [...text];
  const subChars  = [...subtitle];

  const alignStyleMap: Record<Align, CSSProperties> = {
    left:   { alignItems: "flex-start", textAlign: "left" },
    center: { alignItems: "center",     textAlign: "center" },
    right:  { alignItems: "flex-end",   textAlign: "right" },
  };
  const justifyMap: Record<Align, CSSProperties["justifyContent"]> = {
    left: "flex-start", center: "center", right: "flex-end",
  };

  const alignStyle    = alignStyleMap[align]  ?? alignStyleMap.center;
  const justifyContent = justifyMap[align]    ?? "center";

  const sharedCharProps = {
    magnetRadius, magnetStrength, attractDuration, returnDuration,
    hoverColors, entranceAnim, entranceStagger, entranceDuration,
    entranceDelay, gap,
  };

  return (
    <div
      className={styles.wrapper}
      style={{ cursor: showCursor ? "none" : "default", ...alignStyle }}
    >
      {showCursor && <MagneticCursor />}

      <div className={styles.line} style={{ justifyContent }}>
        {mainChars.map((ch, i) => (
          <MagneticChar
            key={i} char={ch} index={i} totalChars={mainChars.length}
            fontSize={fontSize} baseColor={textColor} letterSpacing={letterSpacing}
            {...sharedCharProps}
          />
        ))}
      </div>

      {showSubtitle && (
        <div className={\`\${styles.line} \${styles.subtitle}\`} style={{ justifyContent }}>
          {subChars.map((ch, i) => (
            <MagneticChar
              key={i} char={ch} index={i} totalChars={subChars.length}
              fontSize={subtitleSize} baseColor={subtitleColor} letterSpacing="0.08em"
              {...sharedCharProps}
              entranceDelay={entranceDelay + mainChars.length * entranceStagger + 0.1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MagneticText;
`;
export default code;
