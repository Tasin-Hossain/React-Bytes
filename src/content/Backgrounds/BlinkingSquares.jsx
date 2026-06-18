import { useEffect, useRef, useCallback } from "react";

// ─── Default config ────────────────────────────────────────────────────────────
const DEFAULTS = {
  direction:        "right",   // "right" | "left" | "top" | "bottom"
  gridSize:         52,        // 8 – 200  (cell size in px — stays fixed regardless of screen size)
  squareSize:       0.57,      // 0.05 – 0.98
  fadeStart:        0.65,      // 0 – 1
  fadeEnd:          1.0,       // 0 – 1  (must be > fadeStart)
  falloff:          1.25,      // 0.3 – 6
  minBrightness:    0.55,      // 0 – 1
  twinkleSpeed:     1.4,       // 0 – 4  (cycles/sec)
  twinkleStrength:  0.94,      // 0 – 1
  intensity:        1.0,       // 0 – 2
  opacity:          1.0,       // 0 – 1
  squareColor:      "#BB29FF",
  backgroundColor:  "transparent",
  dpr:              1.5,       // 1 – 3
};

// ─── hex → [r, g, b] ──────────────────────────────────────────────────────────
function hex2rgb(h) {
  const c = h.replace("#", "");
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ];
}

// ─── Core hook ────────────────────────────────────────────────────────────────
function useBlinkingSquares(canvasRef, cfg) {
  const squaresRef = useRef([]);
  const rafRef     = useRef(null);
  const cfgRef     = useRef(cfg);
  // eslint-disable-next-line react-hooks/refs
  cfgRef.current   = cfg;

  // ── build grid ──────────────────────────────────────────────────────────────
  const build = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const {
      direction, gridSize, fadeStart, fadeEnd, falloff, minBrightness,
    } = cfgRef.current;

    const W        = canvas._cssW || canvas.offsetWidth  || 800;
    const H        = canvas._cssH || canvas.offsetHeight || 450;

    // gridSize = fixed cell size in CSS pixels — squares stay same physical size on all screens
    const cellSize = gridSize;
    const cols     = Math.ceil(W / cellSize) + 1;
    const rows     = Math.ceil(H / cellSize) + 1;

    const squares = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const nx = cols > 1 ? c / (cols - 1) : 0; // 0→1 left→right
        const ny = rows > 1 ? r / (rows - 1) : 0; // 0→1 top→bottom

        // t = progress along the fade direction (0 = sparse end, 1 = dense end)
        const t =
          direction === "right"  ? nx :
          direction === "left"   ? 1 - nx :
          direction === "bottom" ? ny : 1 - ny;

        // remap to [fadeStart, fadeEnd] window
        let d = (t - fadeStart) / Math.max(fadeEnd - fadeStart, 0.001);
        d = Math.pow(Math.max(0, Math.min(1, d)), falloff);

        if (Math.random() > d) continue;

        squares.push({
          x:          c * cellSize,
          y:          r * cellSize,
          size:       cellSize,
          // per-cell fixed brightness in [minBrightness, 1]
          brightness: minBrightness + Math.random() * (1 - minBrightness),
          // independent twinkle phase per cell
          phase:      Math.random() * Math.PI * 2,
        });
      }
    }

    squaresRef.current = squares;
  }, [canvasRef]);

  // ── DPR-aware resize ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function applySize() {
      const ratio = Math.min(window.devicePixelRatio || 1, cfgRef.current.dpr);
      const w = canvas.offsetWidth  || 800;
      const h = canvas.offsetHeight || 450;
      canvas.width  = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      canvas._cssW  = w;
      canvas._cssH  = h;
      const ctx = canvas.getContext("2d", { alpha: true });
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      build();
    }

    // fire immediately on mount so canvas has size before first paint
    applySize();

    const ro = new ResizeObserver(applySize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [canvasRef, build]);

  // ── rebuild when grid/fade props change ─────────────────────────────────────
  useEffect(() => { build(); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      cfg.direction, cfg.gridSize, cfg.squareSize,
      cfg.fadeStart, cfg.fadeEnd, cfg.falloff, cfg.minBrightness,
    ]);

  // ── render loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    function draw(ts) {
      rafRef.current = requestAnimationFrame(draw);
      const c  = cfgRef.current;
      const t  = ts * 0.001; // seconds
      const [sr, sg, sb] = hex2rgb(c.squareColor);
      const W  = canvas._cssW || canvas.offsetWidth  || 800;
      const H  = canvas._cssH || canvas.offsetHeight || 450;

      // background
      ctx.clearRect(0, 0, W, H);
      if (c.backgroundColor && c.backgroundColor !== "transparent") {
        ctx.fillStyle = c.backgroundColor;
        ctx.fillRect(0, 0, W, H);
      }

      const cellSize = c.gridSize;
      const sz       = cellSize * c.squareSize;
      const offset   = (cellSize - sz) / 2;

      for (const s of squaresRef.current) {
        // twinkle: sine oscillation scaled by twinkleStrength
        const osc     = Math.sin(s.phase + t * c.twinkleSpeed * Math.PI * 2);
        const twinkle = 1 - c.twinkleStrength * (0.5 - osc * 0.5);
        // final alpha = per-cell brightness × twinkle × intensity × opacity
        const a = Math.min(1, s.brightness * twinkle * c.intensity * c.opacity);

        ctx.fillStyle = `rgba(${sr},${sg},${sb},${a.toFixed(3)})`;
        ctx.fillRect(s.x + offset, s.y + offset, sz, sz);
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [canvasRef]);
}

// ─── BlinkingSquares component ────────────────────────────────────────────────
export default function BlinkingSquares({
  direction       = DEFAULTS.direction,
  gridSize        = DEFAULTS.gridSize,
  squareSize      = DEFAULTS.squareSize,
  fadeStart       = DEFAULTS.fadeStart,
  fadeEnd         = DEFAULTS.fadeEnd,
  falloff         = DEFAULTS.falloff,
  minBrightness   = DEFAULTS.minBrightness,
  twinkleSpeed    = DEFAULTS.twinkleSpeed,
  twinkleStrength = DEFAULTS.twinkleStrength,
  intensity       = DEFAULTS.intensity,
  opacity         = DEFAULTS.opacity,
  squareColor     = DEFAULTS.squareColor,
  backgroundColor = DEFAULTS.backgroundColor,
  dpr             = DEFAULTS.dpr,
  className       = "",
  style           = {},
  children,
}) {
  const canvasRef = useRef(null);
  useBlinkingSquares(canvasRef, {
    direction, gridSize, squareSize, fadeStart, fadeEnd,
    falloff, minBrightness, twinkleSpeed, twinkleStrength,
    intensity, opacity, squareColor, backgroundColor, dpr,
  });

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
