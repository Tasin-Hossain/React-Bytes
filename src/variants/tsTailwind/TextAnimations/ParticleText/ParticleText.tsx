import { useEffect, useRef } from "react";

interface MouseControls {
  enabled?: boolean;
  radius?: number;
  strength?: number;
}

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  char: string;
}

type ParticleShape = "square" | "circle" | "ascii";

interface ParticleTextProps {
  text?: string;
  colors?: string[];
  particleSize?: number;
  particleGap?: number;
  mouseControls?: MouseControls;
  fontSize?: number;
  autoFit?: boolean;
  backgroundColor?: string;
  friction?: number;
  ease?: number;
  className?: string;
  shape?: ParticleShape;
  asciiChars?: string;
}

export default function ParticleText({
  text = "brilliant.",
  colors = ["#40ffaa", "#40aaff", "#ff40aa", "#aa40ff"],
  particleSize = 2,
  particleGap = 2,
  mouseControls = { enabled: true, radius: 150, strength: 5 },
  fontSize = 200,
  autoFit = true,
  backgroundColor = "transparent",
  friction = 0.75,
  ease = 0.05,
  className = "",
  shape = "ascii",
  asciiChars = "bytes",
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number | undefined>(undefined);
  const dprRef = useRef(1);

  const mc = {
    enabled: mouseControls?.enabled ?? true,
    radius: mouseControls?.radius ?? 150,
    strength: mouseControls?.strength ?? 5,
  };

  // Rebuild the particle field whenever text / sizing props change.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const build = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const octx = off.getContext("2d") as CanvasRenderingContext2D;

      let size = fontSize;
      if (autoFit) {
        octx.font = `700 ${size}px "Helvetica Neue", Arial, sans-serif`;
        let w = octx.measureText(text).width;
        const maxW = width * 0.9;
        if (w > maxW && w > 0) size = Math.max(8, size * (maxW / w));
        if (size > height * 0.8) size = height * 0.8;
      }

      octx.clearRect(0, 0, width, height);
      octx.fillStyle = "#fff";
      octx.font = `700 ${size}px "Helvetica Neue", Arial, sans-serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(text, width / 2, height / 2);

      const { data } = octx.getImageData(0, 0, width, height);
      const step = Math.max(1, particleSize + particleGap);
      const particles: Particle[] = [];

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4 + 3;
          if (data[idx] > 128) {
            particles.push({
              baseX: x,
              baseY: y,
              x: Math.random() * width,
              y: Math.random() * height,
              vx: 0,
              vy: 0,
              color: colors[Math.floor(Math.random() * colors.length)] || "#40ffaa",
              char: asciiChars[Math.floor(Math.random() * asciiChars.length)] || "0",
            });
          }
        }
      }
      particlesRef.current = particles;
    };

    build();

    const ro = new ResizeObserver(build);
    ro.observe(container);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, fontSize, autoFit, particleSize, particleGap, JSON.stringify(colors), asciiChars]);

  // Animation loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const tick = () => {
      const dpr = dprRef.current;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (backgroundColor === "transparent") {
        ctx.clearRect(0, 0, w, h);
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      if (shape === "ascii") {
        ctx.font = `${Math.max(6, particleSize * 5)}px "Courier New", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mc.enabled) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mc.radius && dist > 0.001) {
            const force = ((mc.radius - dist) / mc.radius) * mc.strength;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx += (p.baseX - p.x) * ease;
        p.vy += (p.baseY - p.y) * ease;

        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;

        if (shape === "square") {
          const s = particleSize;
          ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
        } else if (shape === "ascii") {
          ctx.fillText(p.char, p.x, p.y);
        } else {
          // default: circle
          ctx.beginPath();
          ctx.arc(p.x, p.y, particleSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current as number);
  }, [friction, ease, particleSize, backgroundColor, mc.enabled, mc.radius, mc.strength, shape]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const handleMouseLeave = () => {
    mouseRef.current = { x: -9999, y: -9999 };
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const t = e.touches[0];
    if (!t) return;
    const rect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        className="block w-full h-full"
      />
    </div>
  );
}