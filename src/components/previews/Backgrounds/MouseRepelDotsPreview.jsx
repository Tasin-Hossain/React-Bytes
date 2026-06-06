import { useEffect, useRef } from 'react';
import useComponentProps from '../../../hooks/useComponentProps';

const MouseRepelDotsPreview = () => {
  const { props, animKey } = useComponentProps();
  const canvasRef = useRef(null);
  const propsRef = useRef(props);

  useEffect(() => {
    propsRef.current = props;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0;
    let mouse = { x: -9999, y: -9999 };
    let dots = [];
    let animId;

    function makeDots() {
      if (W === 0 || H === 0) return;
      const { dotCount } = propsRef.current;
      const area = W * H;
      const baseArea = 800 * 450;
      const scaledCount = Math.round(dotCount * (area / baseArea));
      const cols = Math.round(Math.sqrt(scaledCount * (W / H)));
      const rows = Math.ceil(scaledCount / cols);
      const cellW = W / cols;
      const cellH = H / rows;
      dots = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const ox = cellW * (i + 0.5) + (Math.random() - 0.5) * cellW * 0.3;
          const oy = cellH * (j + 0.5) + (Math.random() - 0.5) * cellH * 0.3;
          dots.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0 });
        }
      }
    }

    function draw() {
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
        const alpha = 0.55 + energy * 0.45;
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

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      W = width;
      H = height;
      canvas.width = W;
      canvas.height = H;
      makeDots();
    });
    ro.observe(canvas);

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [animKey]);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
      />
    </div>
  );
};

export default MouseRepelDotsPreview;