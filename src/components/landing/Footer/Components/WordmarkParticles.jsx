import { useEffect, useRef } from 'react';

const COLORS = ['#7a5af8', '#a855f7'];

export const WordmarkParticles = () => {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const particles = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const textEl = textRef.current;
    if (!canvas || !wrap || !textEl) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    const resize = () => {
      width = wrap.offsetWidth;
      height = wrap.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnParticle = () => {
      const padding = width * 0.15;
      const x = padding + Math.random() * (width - padding * 2);
      const y = height * (0.1 + Math.random() * 0.7);
      particles.current.push({
        x,
        y,
        r: Math.random() * 2 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.2 + 0.4),
        alpha: 1,
        decay: Math.random() * 0.012 + 0.006
      });
    };

    const spawnInterval = setInterval(spawnParticle, 80);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.current = particles.current.filter(p => p.alpha > 0);
      particles.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
      });
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(spawnInterval);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="app-container relative overflow-hidden select-none w-full wordmark-wrap"
      style={{ height: 'clamp(3rem, 10vw, 10rem)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
      <div
        className="relative"
        style={{
          zIndex: 1,
          maskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.0) 100%)'
        }}
      >
        <span
          ref={textRef}
          className="wordmark-text block font-black whitespace-nowrap text-center w-full"
          style={{
            fontSize: 'clamp(2.5rem, 12vw, 13rem)',
            letterSpacing: '-0.02em',
            lineHeight: '1.2',
            // background: 'var(--wordmark-gradient)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextStroke: '2px var(--wordmark-color)',
            color: 'transparent'
          }}
        >
          REACT BYTES
        </span>
      </div>
    </div>
  );
};
