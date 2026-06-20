// TS-CSS variant
import { useRef, useEffect, CSSProperties } from "react";

type ColorStop = string | { stops: [string, string] };
type Shape = "circle" | "square" | "triangle";
type AnimationMode =
  | "off" | "random" | "pulse" | "ripple"
  | "left-to-right" | "right-to-left"
  | "top-to-bottom" | "bottom-to-top"
  | "line-right" | "line-left"
  | "wave-horizontal" | "wave-vertical"
  | "diagonal-tl-br" | "diagonal-br-tl";

const DEFAULT_COLORS: ColorStop[] = [
  "#7a5af8", "#d35af8", "#22c39b", "#f5b942", "#e0497a",
  "#3aa0e8", "#ffffff", "#ff6b6b", "#4ecdc4",
  { stops: ["#7a5af8", "#22c39b"] },
  { stops: ["#d35af8", "#3aa0e8"] },
  { stops: ["#f5b942", "#e0497a"] },
];

const TWO_PI = Math.PI * 2;

function smooth(x: number): number {
  x = Math.max(0, Math.min(1, x));
  return x * x * (3 - 2 * x);
}

const RANDOM_MODE_DAMPING = 0.55;

interface Cell {
  x: number; y: number;
  col: number; row: number;
  shape: Shape;
  color: ColorStop;
  peak: number;
  scale: number;
  seed: number;
  phase: number;
  rotation: number;
}

interface Burst {
  x: number; y: number; radius: number;
}

interface ShapesDotsProps {
  width?:                string | number;
  height?:                string | number;
  className?:             string;
  children?:               React.ReactNode;
  cellSize?:               number;
  influenceRadiusVmin?:    number;
  attackTime?:             number;
  releaseTime?:            number;
  idleScale?:              number;
  minPeakScale?:           number;
  maxPeakScale?:           number;
  burstSpeed?:             number;
  burstThickness?:         number;
  backgroundColor?:        string;
  shapes?:                 Shape[];
  colors?:                 ColorStop[];
  dpr?:                    number;
  opacity?:                number;
  animationMode?:          AnimationMode;
  animationSpeed?:         number;
  overlapGuard?:           number;
  rotationVariance?:       number;
}

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
}: ShapesDotsProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const propsRef = useRef<ShapesDotsProps>({});
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
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0;
    let cells: Cell[] = [];
    let cols = 0, rows = 0;
    let mouse = { x: -99999, y: -99999 };
    let bursts: Burst[] = [];
    let lastT = performance.now();
    let clock = 0;
    let rafId = 0;

    function setSize() {
      const rect = wrap.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, propsRef.current.dpr!);
      canvas.width = W * ratio;
      canvas.height = H * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function pickColor(): ColorStop {
      const pool = propsRef.current.colors!;
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function pickShape(): Shape {
      const pool = propsRef.current.shapes!;
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function getBaseSize(): number {
      const { cellSize } = propsRef.current;
      return cellSize! * 0.28;
    }

    function getHardCapScale(): number {
      const { cellSize, overlapGuard } = propsRef.current;
      const baseSize = getBaseSize();
      const sizeCap = cellSize! * 0.5 * overlapGuard!;
      return sizeCap / baseSize;
    }

    function makeGrid() {
      const { cellSize, idleScale, minPeakScale, maxPeakScale, rotationVariance } = propsRef.current;
      cols = Math.max(1, Math.floor(W / cellSize!));
      rows = Math.max(1, Math.floor(H / cellSize!));
      const padX = (W - (cols - 1) * cellSize!) / 2;
      const padY = (H - (rows - 1) * cellSize!) / 2;

      const hardCapScale = getHardCapScale();

      cells = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const rawPeak = minPeakScale! + Math.random() * (maxPeakScale! - minPeakScale!);
          cells.push({
            x: padX + i * cellSize!,
            y: padY + j * cellSize!,
            col: i,
            row: j,
            shape: pickShape(),
            color: pickColor(),
            peak: Math.min(rawPeak, hardCapScale),
            scale: idleScale!,
            seed: Math.random() * 1000,
            phase: Math.random() * TWO_PI,
            rotation: Math.random() * TWO_PI * rotationVariance!,
          });
        }
      }
    }

    function resolveColor(c: ColorStop, size: number): string | CanvasGradient {
      if (typeof c === "string") return c;
      const grad = ctx.createLinearGradient(0, -size, 0, size);
      grad.addColorStop(0, c.stops[0]);
      grad.addColorStop(1, c.stops[1]);
      return grad;
    }

    function drawShape(shape: Shape, size: number, color: ColorStop) {
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

    function animIntensity(c: Cell, t: number, mode: AnimationMode): number {
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
      } = propsRef.current as Required<ShapesDotsProps>;

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

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (W / rect.width);
      mouse.y = (e.clientY - rect.top) * (H / rect.height);
    }
    function onLeave() {
      mouse.x = -99999;
      mouse.y = -99999;
    }
    function onClick(e: MouseEvent) {
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

  const style = {
    wrapper: { position: "relative" as const, overflow: "hidden", width, height },
    canvas:  { display: "block", width: "100%", height: "100%", cursor: "pointer" } as CSSProperties,
  };

  const classes = `${className}`;

  return (
    <div ref={wrapRef} style={style.wrapper} className={classes}>
      <canvas ref={canvasRef} style={style.canvas} />
      {children}
    </div>
  );
};

export default ShapesDots;