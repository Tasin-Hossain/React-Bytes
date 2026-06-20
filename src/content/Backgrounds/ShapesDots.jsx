import { useRef, useEffect } from "react";

const DEFAULT_COLORS = [
  "#7a5af8", "#d35af8", "#22c39b", "#f5b942", "#e0497a",
  "#3aa0e8", "#ffffff", "#ff6b6b", "#4ecdc4",
  { stops: ["#7a5af8", "#22c39b"] },
  { stops: ["#d35af8", "#3aa0e8"] },
  { stops: ["#f5b942", "#e0497a"] },
];

const TWO_PI = Math.PI * 2;

function smooth(x) {
  x = Math.max(0, Math.min(1, x));
  return x * x * (3 - 2 * x);
}

const RANDOM_MODE_DAMPING = 0.55;

const ShapesDots = ({
  width = "100%",
  height = "100%",
  className = "",
  children,

  cellSize = 40,
  influenceRadiusVmin = 30,
  attackTime = 0.5,
  releaseTime = 0.6,
  idleScale = 0.09,
  minPeakScale = 1,
  maxPeakScale = 3,

  burstSpeed = 1200,
  burstThickness = 180,

  backgroundColor = "#080808",
  shapes = ["circle", "triangle", "square"],
  colors = DEFAULT_COLORS,

  dpr = 2,
  opacity = 1,

  animationMode = "off",
  animationSpeed = 1,

  overlapGuard = 0.86,
  rotationVariance = 1,
}) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  const propsRef = useRef({});
  // eslint-disable-next-line react-hooks/refs
  propsRef.current = {
    cellSize, influenceRadiusVmin, attackTime, releaseTime,
    idleScale, minPeakScale, maxPeakScale,
    burstSpeed, burstThickness,
    backgroundColor, shapes, colors,
    dpr, opacity,
    animationMode, animationSpeed, overlapGuard,
    rotationVariance,
  };

  const rebuildRef = useRef(false);
  const prevLayout = useRef({
    cellSize,
    shapes: JSON.stringify(shapes),
    colors: JSON.stringify(colors),
    minPeakScale,
    maxPeakScale,
    rotationVariance,
    overlapGuard,
  });

  useEffect(() => {
    const sig = {
      cellSize,
      shapes: JSON.stringify(shapes),
      colors: JSON.stringify(colors),
      minPeakScale,
      maxPeakScale,
      rotationVariance,
      overlapGuard,
    };
    if (
      sig.cellSize !== prevLayout.current.cellSize ||
      sig.shapes !== prevLayout.current.shapes ||
      sig.colors !== prevLayout.current.colors ||
      sig.minPeakScale !== prevLayout.current.minPeakScale ||
      sig.maxPeakScale !== prevLayout.current.maxPeakScale ||
      sig.rotationVariance !== prevLayout.current.rotationVariance ||
      sig.overlapGuard !== prevLayout.current.overlapGuard
    ) {
      prevLayout.current = sig;
      rebuildRef.current = true;
    }
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let W = 0, H = 0;
    let cells = [];
    let cols = 0, rows = 0;
    let mouse = { x: -99999, y: -99999 };
    let bursts = [];
    let lastT = performance.now();
    let clock = 0;
    let rafId = null;

    function setSize() {
      const rect = wrap.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, propsRef.current.dpr);
      canvas.width = W * ratio;
      canvas.height = H * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function pickColor() {
      const pool = propsRef.current.colors;
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function pickShape() {
      const pool = propsRef.current.shapes;
      return pool[Math.floor(Math.random() * pool.length)];
    }

    // Fixed reference size for a cell's shape, independent of maxPeakScale.
    // This is what keeps the idle size (and the "unit" that scale multiplies)
    // stable no matter what maxPeakScale is set to.
    function getBaseSize() {
      const { cellSize } = propsRef.current;
      return cellSize * 0.28;
    }

    // The largest scale factor a shape can ever reach before it would
    // breach the overlap guard against neighboring cells.
    function getHardCapScale() {
      const { cellSize, overlapGuard } = propsRef.current;
      const baseSize = getBaseSize();
      const sizeCap = cellSize * 0.5 * overlapGuard;
      return sizeCap / baseSize;
    }

    function makeGrid() {
      const { cellSize, idleScale, minPeakScale, maxPeakScale, rotationVariance } = propsRef.current;
      cols = Math.max(1, Math.floor(W / cellSize));
      rows = Math.max(1, Math.floor(H / cellSize));
      const padX = (W - (cols - 1) * cellSize) / 2;
      const padY = (H - (rows - 1) * cellSize) / 2;

      const hardCapScale = getHardCapScale();

      cells = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const rawPeak = minPeakScale + Math.random() * (maxPeakScale - minPeakScale);
          cells.push({
            x: padX + i * cellSize,
            y: padY + j * cellSize,
            col: i,
            row: j,
            shape: pickShape(),
            color: pickColor(),
            // Clamp the peak itself (per-cell) instead of shrinking the
            // shared base size for every cell. This is the key fix:
            // raising maxPeakScale no longer changes idle/base size.
            peak: Math.min(rawPeak, hardCapScale),
            scale: idleScale,
            seed: Math.random() * 1000,
            phase: Math.random() * TWO_PI,
            rotation: Math.random() * TWO_PI * rotationVariance,
          });
        }
      }
    }

    function resolveColor(c, size) {
      if (typeof c === "string") return c;
      const grad = ctx.createLinearGradient(0, -size, 0, size);
      grad.addColorStop(0, c.stops[0]);
      grad.addColorStop(1, c.stops[1]);
      return grad;
    }

    function drawShape(shape, size, color) {
      ctx.save();
      ctx.fillStyle = resolveColor(color, size);
      if (shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, TWO_PI);
        ctx.fill();
      } else if (shape === "square") {
        ctx.fillRect(-size, -size, size * 2, size * 2);
      } else if (shape === "triangle") {
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.87, size * 0.5);
        ctx.lineTo(-size * 0.87, size * 0.5);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    function animIntensity(c, t, mode) {
      if (mode === "off") return 0;
      switch (mode) {
        case "random": {
          const cycle = Math.sin(t * 0.6 + c.phase) * 0.5 + 0.5;
          const burst = Math.sin(t * 2.3 + c.seed) * 0.5 + 0.5;
          const combined = cycle * burst;
          const threshold = 0.82;
          const v = combined < threshold ? 0 : smooth((combined - threshold) / (1 - threshold));
          return v * RANDOM_MODE_DAMPING;
        }
        case "pulse": {
          const v = (Math.sin(t * TWO_PI * 0.5) + 1) / 2;
          const threshold = 0.75;
          return v > threshold ? smooth((v - threshold) / (1 - threshold)) : 0;
        }
        case "ripple": {
          const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
          const dx = c.col - cx, dy = c.row - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.sqrt(cx * cx + cy * cy) || 1;
          const ringPos = dist / maxDist;
          const period = 3;
          const phase = (t % period) / period;
          const width = 0.12;
          const diff = Math.abs(ringPos - phase);
          return diff < width ? smooth(1 - diff / width) : 0;
        }
        case "left-to-right":
        case "right-to-left": {
          const pos = mode === "left-to-right"
            ? c.col / Math.max(cols - 1, 1)
            : 1 - c.col / Math.max(cols - 1, 1);
          const width = 0.12;
          const phase = (t % (1 + width)) - width / 2;
          const dist = Math.abs(pos - phase);
          return dist < width ? smooth(1 - dist / width) : 0;
        }
        case "top-to-bottom":
        case "bottom-to-top": {
          const pos = mode === "top-to-bottom"
            ? c.row / Math.max(rows - 1, 1)
            : 1 - c.row / Math.max(rows - 1, 1);
          const width = 0.12;
          const phase = (t % (1 + width)) - width / 2;
          const dist = Math.abs(pos - phase);
          return dist < width ? smooth(1 - dist / width) : 0;
        }
        case "line-right":
        case "line-left": {
          const pos = mode === "line-right"
            ? c.col / Math.max(cols - 1, 1)
            : 1 - c.col / Math.max(cols - 1, 1);
          const width = 0.06;
          const phase = (t % (1 + width)) - width / 2;
          const dist = Math.abs(pos - phase);
          return dist < width ? smooth(1 - dist / width) : 0;
        }
        case "wave-horizontal": {
          const phase = (c.col / Math.max(cols - 1, 1)) * Math.PI * 3 + t * TWO_PI;
          const v = (Math.sin(phase) + 1) / 2;
          return v > 0.72 ? smooth((v - 0.72) / 0.28) : 0;
        }
        case "wave-vertical": {
          const phase = (c.row / Math.max(rows - 1, 1)) * Math.PI * 3 + t * TWO_PI;
          const v = (Math.sin(phase) + 1) / 2;
          return v > 0.72 ? smooth((v - 0.72) / 0.28) : 0;
        }
        case "diagonal-tl-br":
        case "diagonal-br-tl": {
          let pos = ((c.col / Math.max(cols - 1, 1)) + (c.row / Math.max(rows - 1, 1))) / 2;
          if (mode === "diagonal-br-tl") pos = 1 - pos;
          const width = 0.1;
          const phase = (t % (1 + width)) - width / 2;
          const dist = Math.abs(pos - phase);
          return dist < width ? smooth(1 - dist / width) : 0;
        }
        default:
          return 0;
      }
    }

    function draw() {
      rafId = requestAnimationFrame(draw);

      if (rebuildRef.current) {
        rebuildRef.current = false;
        makeGrid();
      }

      const {
        influenceRadiusVmin, attackTime, releaseTime,
        idleScale, burstSpeed, burstThickness,
        backgroundColor, opacity, animationMode, animationSpeed, overlapGuard, cellSize,
      } = propsRef.current;

      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      clock += dt * animationSpeed;

      ctx.clearRect(0, 0, W, H);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, W, H);
      }

      const vmin = Math.min(W, H);
      const influenceR = vmin * (influenceRadiusVmin / 100);

      for (let i = bursts.length - 1; i >= 0; i--) {
        bursts[i].radius += burstSpeed * dt;
        if (bursts[i].radius - burstThickness > Math.max(W, H) * 1.5) {
          bursts.splice(i, 1);
        }
      }

      ctx.globalAlpha = opacity;

      // Fixed base size: no longer derived from maxPeakScale, so the
      // idle/resting size of every shape stays constant regardless of
      // what maxPeakScale is set to. sizeCap remains only as a safety
      // clamp (peaks are already pre-clamped per-cell in makeGrid).
      const baseSize = cellSize * 0.28;
      const sizeCap = cellSize * 0.5 * overlapGuard;

      for (const c of cells) {
        const dx = c.x - mouse.x, dy = c.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let target = idleScale;
        if (dist < influenceR) {
          const f = 1 - dist / influenceR;
          target = Math.max(target, idleScale + (c.peak - idleScale) * f);
        }

        for (const b of bursts) {
          const bdx = c.x - b.x, bdy = c.y - b.y;
          const bdist = Math.sqrt(bdx * bdx + bdy * bdy);
          const ringDist = Math.abs(bdist - b.radius);
          if (ringDist < burstThickness / 2) {
            const f = 1 - ringDist / (burstThickness / 2);
            target = Math.max(target, idleScale + (c.peak - idleScale) * f);
          }
        }

        const animF = animIntensity(c, clock, animationMode);
        if (animF > 0) {
          target = Math.max(target, idleScale + (c.peak - idleScale) * animF);
        }

        const tau = target > c.scale ? attackTime : releaseTime;
        const alpha = 1 - Math.exp(-dt / Math.max(tau, 0.001));
        c.scale += (target - c.scale) * alpha;

        const size = Math.min(baseSize * c.scale, sizeCap);

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        drawShape(c.shape, size, c.color);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (W / rect.width);
      mouse.y = (e.clientY - rect.top) * (H / rect.height);
    }
    function onLeave() {
      mouse.x = -99999;
      mouse.y = -99999;
    }
    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (W / rect.width);
      const y = (e.clientY - rect.top) * (H / rect.height);
      bursts.push({ x, y, radius: 0 });
    }
    function onResize() {
      setSize();
      makeGrid();
    }

    setSize();
    makeGrid();
    rafId = requestAnimationFrame(draw);

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" style={{ cursor: "pointer" }} />
      {children}
    </div>
  );
};

export default ShapesDots;
