// JS-TW variant
import { useEffect, useRef, useCallback } from "react";

const DEFAULTS = {
  direction:        "right",
  gridSize:         52,
  squareSize:       0.57,
  fadeStart:        0.65,
  fadeEnd:          1.0,
  falloff:          1.25,
  minBrightness:    0.55,
  twinkleSpeed:     1.4,
  twinkleStrength:  0.94,
  intensity:        1.0,
  opacity:          1.0,
  squareColor:      "#BB29FF",
  backgroundColor:  "transparent",
  dpr:              1.5,
};

function hex2rgb(h) {
  const c = h.replace("#", "");
  return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)];
}

function useBlinkingSquares(canvasRef, cfg) {
  const squaresRef = useRef([]);
  const rafRef      = useRef(null);
  const cfgRef      = useRef(cfg);
  // eslint-disable-next-line react-hooks/refs
  cfgRef.current    = cfg;

  const build = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { direction, gridSize, fadeStart, fadeEnd, falloff, minBrightness } = cfgRef.current;
    const W = canvas._cssW || canvas.offsetWidth  || 800;
    const H = canvas._cssH || canvas.offsetHeight || 450;
    const cellSize = gridSize;
    const cols = Math.ceil(W / cellSize) + 1;
    const rows = Math.ceil(H / cellSize) + 1;
    const squares = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const nx = cols > 1 ? c / (cols - 1) : 0;
        const ny = rows > 1 ? r / (rows - 1) : 0;
        const t = direction === "right" ? nx : direction === "left" ? 1-nx : direction === "bottom" ? ny : 1-ny;
        let d = (t - fadeStart) / Math.max(fadeEnd - fadeStart, 0.001);
        d = Math.pow(Math.max(0, Math.min(1, d)), falloff);
        if (Math.random() > d) continue;
        squares.push({ x: c*cellSize, y: r*cellSize, size: cellSize, brightness: minBrightness + Math.random()*(1-minBrightness), phase: Math.random()*Math.PI*2 });
      }
    }
    squaresRef.current = squares;
  }, [canvasRef]);

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

    applySize();
    const ro = new ResizeObserver(applySize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [canvasRef, build]);

  useEffect(() => { build(); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cfg.direction, cfg.gridSize, cfg.squareSize, cfg.fadeStart, cfg.fadeEnd, cfg.falloff, cfg.minBrightness]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    function draw(ts) {
      rafRef.current = requestAnimationFrame(draw);
      const c = cfgRef.current;
      const t = ts * 0.001;
      const [sr, sg, sb] = hex2rgb(c.squareColor);
      const W = canvas._cssW || canvas.offsetWidth  || 800;
      const H = canvas._cssH || canvas.offsetHeight || 450;

      ctx.clearRect(0, 0, W, H);
      if (c.backgroundColor && c.backgroundColor !== "transparent") {
        ctx.fillStyle = c.backgroundColor;
        ctx.fillRect(0, 0, W, H);
      }

      const cellSize = c.gridSize;
      const sz     = cellSize * c.squareSize;
      const offset = (cellSize - sz) / 2;

      for (const s of squaresRef.current) {
        const osc     = Math.sin(s.phase + t * c.twinkleSpeed * Math.PI * 2);
        const twinkle = 1 - c.twinkleStrength * (0.5 - osc * 0.5);
        const a = Math.min(1, s.brightness * twinkle * c.intensity * c.opacity);
        ctx.fillStyle = `rgba(${sr},${sg},${sb},${a.toFixed(3)})`;
        ctx.fillRect(s.x + offset, s.y + offset, sz, sz);
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [canvasRef]);
}

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

  const classes = `relative overflow-hidden ${className}`;

  return (
    <div className={classes} style={style}>
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}