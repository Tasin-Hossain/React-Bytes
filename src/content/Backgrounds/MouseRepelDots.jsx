import { useEffect, useRef } from 'react';

export default function MouseRepelDots({
  dotCount = 500,
  repelRadius = 80,
  force = 5.5,
  springK = 0.07,
  damping = 0.72,
  dotColor = '#7a5af8',
  dotColorMid = '#d35af8',
  dotColorHot = '#ffffff',
  minDotSize = 1.4,
  maxDotSize = 6,
  className = '',
}) {
  const canvasRef = useRef(null);
  const propsRef = useRef({
    dotCount, repelRadius, force, springK, damping,
    dotColor, dotColorMid, dotColorHot, minDotSize, maxDotSize,
  });
  const remakeRef = useRef(false);
  const prevDotCountRef = useRef(dotCount);

  useEffect(() => {
    if (prevDotCountRef.current !== dotCount) {
      prevDotCountRef.current = dotCount;
      remakeRef.current = true;
    }
    propsRef.current = {
      dotCount, repelRadius, force, springK, damping,
      dotColor, dotColorMid, dotColorHot, minDotSize, maxDotSize,
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    let mouse = { x: -9999, y: -9999 };
    let dots = [];
    let animId;

    function makeDots() {
      const { dotCount } = propsRef.current;
      const COLS = Math.ceil(Math.sqrt(dotCount * (W / H)));
      const ROWS = Math.ceil(dotCount / COLS);
      const gx = W / COLS;
      const gy = H / ROWS;
      dots = [];
      outer: for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          if (dots.length >= dotCount) break outer;
          const ox = gx * i + gx / 2 + (Math.random() - 0.5) * gx * 0.3;
          const oy = gy * j + gy / 2 + (Math.random() - 0.5) * gy * 0.3;
          dots.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0 });
        }
      }
    }

    function draw() {
      if (remakeRef.current) {
        remakeRef.current = false;
        makeDots();
      }

      const {
        repelRadius, force, springK, damping,
        dotColor, dotColorMid, dotColorHot,
        minDotSize, maxDotSize,
      } = propsRef.current;

      ctx.clearRect(0, 0, W, H);

      dots.forEach(d => {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

        if (dist < repelRadius) {
          const f = ((repelRadius - dist) / repelRadius) * force;
          d.vx += (dx / dist) * f;
          d.vy += (dy / dist) * f;
        }

        d.vx += (d.ox - d.x) * springK;
        d.vy += (d.oy - d.y) * springK;
        d.vx *= damping;
        d.vy *= damping;
        d.x += d.vx;
        d.y += d.vy;

        const displaced = Math.sqrt((d.x - d.ox) ** 2 + (d.y - d.oy) ** 2);
        const energy = Math.min(displaced / repelRadius, 1);

        const r = minDotSize + energy * (maxDotSize - minDotSize);
        const alpha = 0.2 + energy * 0.75;
        const color =
          energy > 0.6 ? dotColorHot : energy > 0.25 ? dotColorMid : dotColor;

        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (W / rect.width);
      mouse.y = (e.clientY - rect.top) * (H / rect.height);
    }

    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function onResize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      makeDots();
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    makeDots();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full pointer-events-none ${className}`}
    />
  );
}
