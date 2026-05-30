import { useEffect, useRef } from 'react';

export default function AuroraBg({
  hue1 = 250,
  hue2 = 300,
  speed = 1,
  intensity = 0.8,
  waveCount = 4,
  height = '100%',
}) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Wave configs — generated from props
    const makeWaves = () =>
      Array.from({ length: waveCount }, (_, i) => ({
        y:         0.2 + (i / waveCount) * 0.55,
        amplitude: (0.08 + Math.random() * 0.1) * intensity,
        freq:      0.6 + Math.random() * 0.8,
        phase:     Math.random() * Math.PI * 2,
        speed:     (0.3 + Math.random() * 0.4) * speed,
        hue:       hue1 + ((hue2 - hue1) * i) / Math.max(waveCount - 1, 1),
        opacity:   0.18 + Math.random() * 0.22,
      }));

    let waves = makeWaves();
    let t = 0;

    const draw = () => {
      const { width, height: h } = canvas;
      ctx.clearRect(0, 0, width, h);

      waves.forEach(w => {
        const yBase = w.y * h;
        const amp   = w.amplitude * h;

        // Build gradient path
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, h);

        for (let x = 0; x <= width; x += 4) {
          const y =
            yBase +
            Math.sin((x / width) * Math.PI * w.freq + w.phase + t * w.speed) * amp +
            Math.sin((x / width) * Math.PI * w.freq * 2 + t * w.speed * 0.7) * amp * 0.4;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, yBase - amp, 0, yBase + amp * 2);
        grad.addColorStop(0, `hsla(${w.hue}, 85%, 65%, ${w.opacity})`);
        grad.addColorStop(0.5, `hsla(${w.hue + 30}, 90%, 60%, ${w.opacity * 0.6})`);
        grad.addColorStop(1, `hsla(${w.hue + 60}, 80%, 55%, 0)`);

        ctx.fillStyle = grad;
        ctx.filter = 'blur(32px)';
        ctx.fill();
        ctx.restore();
      });

      // Subtle star dots
      ctx.save();
      ctx.filter = 'none';
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137.5) % 1) * width;   // pseudo-random but stable
        const sy = ((i * 97.3)  % 1) * h * 0.7;
        const r  = 0.6 + (i % 3) * 0.4;
        const a  = 0.2 + Math.sin(t * 0.5 + i) * 0.15;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      }
      ctx.restore();

      t += 0.008;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [hue1, hue2, speed, intensity, waveCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height, display: 'block' }}
    />
  );
}