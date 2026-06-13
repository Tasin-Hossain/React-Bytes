import { useEffect, useRef, memo } from 'react';

const TWO_PI = Math.PI * 2;

function smooth(x) {
  x = Math.max(0, Math.min(1, x));
  return x * x * (3 - 2 * x);
}

const MouseRepelDots = memo(({
  // grid layout
  dotRadius = 1.6,
  dotSpacing = 22,

  // physics
  repelRadius = 80,
  force = 5.5,
  springK = 0.07,
  damping = 0.72,

  // sizing
  maxDotSize = 6,

  // colors
  dotColor = '#7a5af8',
  dotColorMid = '#d35af8',
  dotColorHot = '#ffffff',
  backgroundColor = 'transparent',
  gradientFrom = null,
  gradientTo = null,

  // extra effects
  bulgeOnly = false,
  bulgeStrength = 30,
  waveAmplitude = 0,

  // sparkle
  sparkleMode = 'off',
  sparkleColor = '#d35af8',
  sparkleSize = 1.6,
  sparkleSpeed = 0.4,
  sparkleDensity = 0.015,

  className = '',
  ...rest
}) => {
  const canvasRef = useRef(null);

  const propsRef = useRef({});
  propsRef.current = {
    dotRadius, dotSpacing, repelRadius, force, springK, damping,
    maxDotSize,
    dotColor, dotColorMid, dotColorHot, backgroundColor, gradientFrom, gradientTo,
    bulgeOnly, bulgeStrength, waveAmplitude,
    sparkleMode, sparkleColor, sparkleSize, sparkleSpeed, sparkleDensity,
  };

  const remakeRef = useRef(false);
  const prevLayoutRef = useRef({ dotRadius, dotSpacing });

  useEffect(() => {
    if (
      prevLayoutRef.current.dotRadius !== dotRadius ||
      prevLayoutRef.current.dotSpacing !== dotSpacing
    ) {
      prevLayoutRef.current = { dotRadius, dotSpacing };
      remakeRef.current = true;
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;

    let mouse = { x: -9999, y: -9999 };
    let dots = [];
    let animId;
    let frameCount = 0;
    let cols = 0, rows = 0;

    function setCanvasSize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeDots() {
      const { dotRadius, dotSpacing } = propsRef.current;
      const step = dotRadius * 2 + dotSpacing;
      cols = Math.floor(W / step);
      rows = Math.floor(H / step);
      const padX = (W - (cols - 1) * step) / 2;
      const padY = (H - (rows - 1) * step) / 2;

      dots = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const ox = padX + i * step;
          const oy = padY + j * step;
          dots.push({
            ox, oy, sx: ox, sy: oy, x: ox, y: oy, vx: 0, vy: 0,
            col: i, row: j,
            sparkleSeed: Math.random() * 1000,
            sparklePhase: Math.random() * TWO_PI,
          });
        }
      }
    }

    function getSparkleIntensity(d, t, mode, density) {
      if (mode === 'off') return 0;

      switch (mode) {
        case 'random': {
          const cycle = Math.sin(t * 0.6 + d.sparklePhase) * 0.5 + 0.5;
          const burst = Math.sin(t * 2.3 + d.sparkleSeed) * 0.5 + 0.5;
          const combined = cycle * burst;
          const threshold = 1 - density * 6;
          if (combined < threshold) return 0;
          return smooth((combined - threshold) / (1 - threshold));
        }
        case 'left-to-right': {
          const pos = d.col / Math.max(cols - 1, 1);
          const width = 0.12;
          const phase = (t % (1 + width)) - width / 2;
          const dist = Math.abs(pos - phase);
          return dist < width ? smooth(1 - dist / width) : 0;
        }
        case 'right-to-left': {
          const pos = 1 - d.col / Math.max(cols - 1, 1);
          const width = 0.12;
          const phase = (t % (1 + width)) - width / 2;
          const dist = Math.abs(pos - phase);
          return dist < width ? smooth(1 - dist / width) : 0;
        }
        case 'top-to-bottom': {
          const pos = d.row / Math.max(rows - 1, 1);
          const width = 0.12;
          const phase = (t % (1 + width)) - width / 2;
          const dist = Math.abs(pos - phase);
          return dist < width ? smooth(1 - dist / width) : 0;
        }
        case 'bottom-to-top': {
          const pos = 1 - d.row / Math.max(rows - 1, 1);
          const width = 0.12;
          const phase = (t % (1 + width)) - width / 2;
          const dist = Math.abs(pos - phase);
          return dist < width ? smooth(1 - dist / width) : 0;
        }
        case 'line-right': {
          const pos = d.col / Math.max(cols - 1, 1);
          const width = 0.06;
          const phase = (t % (1 + width)) - width / 2;
          const dist = Math.abs(pos - phase);
          return dist < width ? smooth(1 - dist / width) : 0;
        }
        case 'line-left': {
          const pos = 1 - d.col / Math.max(cols - 1, 1);
          const width = 0.06;
          const phase = (t % (1 + width)) - width / 2;
          const dist = Math.abs(pos - phase);
          return dist < width ? smooth(1 - dist / width) : 0;
        }
        case 'wave-horizontal': {
          const phase = (d.col / Math.max(cols - 1, 1)) * Math.PI * 3 + t * TWO_PI;
          const v = (Math.sin(phase) + 1) / 2;
          return v > 0.7 ? smooth((v - 0.7) / 0.3) : 0;
        }
        case 'wave-vertical': {
          const phase = (d.row / Math.max(rows - 1, 1)) * Math.PI * 3 + t * TWO_PI;
          const v = (Math.sin(phase) + 1) / 2;
          return v > 0.7 ? smooth((v - 0.7) / 0.3) : 0;
        }
        case 'diagonal-tl-br': {
          const pos = ((d.col / Math.max(cols - 1, 1)) + (d.row / Math.max(rows - 1, 1))) / 2;
          const width = 0.1;
          const phase = (t % (1 + width)) - width / 2;
          const dist = Math.abs(pos - phase);
          return dist < width ? smooth(1 - dist / width) : 0;
        }
        case 'diagonal-br-tl': {
          const pos = 1 - (((d.col / Math.max(cols - 1, 1)) + (d.row / Math.max(rows - 1, 1))) / 2);
          const width = 0.1;
          const phase = (t % (1 + width)) - width / 2;
          const dist = Math.abs(pos - phase);
          return dist < width ? smooth(1 - dist / width) : 0;
        }
        case 'pulse': {
          const v = (Math.sin(t * TWO_PI) + 1) / 2;
          const threshold = 1 - density * 6;
          return v > threshold ? smooth((v - threshold) / (1 - threshold)) : 0;
        }
        case 'ripple': {
          const cx = (cols - 1) / 2;
          const cy = (rows - 1) / 2;
          const dx = d.col - cx;
          const dy = d.row - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.sqrt(cx * cx + cy * cy) || 1;
          const ringPos = dist / maxDist;
          const period = 4;
          const phase = (t % period) / period;
          const width = 0.1;
          const diff = Math.abs(ringPos - phase);
          return diff < width ? smooth(1 - diff / width) : 0;
        }
        default:
          return 0;
      }
    }

    function draw() {
      if (remakeRef.current) {
        remakeRef.current = false;
        makeDots();
      }

      const {
        repelRadius, force, springK, damping,
        dotRadius, maxDotSize,
        dotColor, dotColorMid, dotColorHot, backgroundColor,
        gradientFrom, gradientTo,
        bulgeOnly, bulgeStrength, waveAmplitude,
        sparkleMode, sparkleColor, sparkleSize, sparkleSpeed, sparkleDensity,
      } = propsRef.current;

      frameCount++;
      const t = frameCount * 0.02;
      const sparkleT = frameCount * sparkleSpeed * 0.05;

      ctx.clearRect(0, 0, W, H);

      if (backgroundColor && backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, W, H);
      }

      let gradFill = null;
      if (gradientFrom && gradientTo) {
        gradFill = ctx.createLinearGradient(0, 0, W, H);
        gradFill.addColorStop(0, gradientFrom);
        gradFill.addColorStop(1, gradientTo);
      }

      dots.forEach((d) => {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

        if (bulgeOnly) {
          const rSq = repelRadius * repelRadius;
          if (dx * dx + dy * dy < rSq) {
            const tNorm = 1 - dist / repelRadius;
            const push = tNorm * tNorm * bulgeStrength;
            const angle = Math.atan2(dy, dx);
            d.sx += (d.ox + Math.cos(angle) * push - d.sx) * 0.15;
            d.sy += (d.oy + Math.sin(angle) * push - d.sy) * 0.15;
          } else {
            d.sx += (d.ox - d.sx) * 0.1;
            d.sy += (d.oy - d.sy) * 0.1;
          }
          d.x = d.sx;
          d.y = d.sy;
        } else {
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
        }

        let drawX = d.x;
        let drawY = d.y;

        if (waveAmplitude > 0) {
          drawY += Math.sin(d.ox * 0.03 + t) * waveAmplitude;
          drawX += Math.cos(d.oy * 0.03 + t * 0.7) * waveAmplitude * 0.5;
        }

        const displaced = Math.sqrt((d.x - d.ox) ** 2 + (d.y - d.oy) ** 2);
        const energy = Math.min(displaced / repelRadius, 1);

        let r = dotRadius + energy * (maxDotSize - dotRadius);
        let alpha = 0.35 + energy * 0.65;

        let color;
        if (gradFill) {
          color = gradFill;
        } else {
          color = energy > 0.6 ? dotColorHot : energy > 0.25 ? dotColorMid : dotColor;
        }

        const s = getSparkleIntensity(d, sparkleT, sparkleMode, sparkleDensity);
        if (s > 0) {
          r += dotRadius * (sparkleSize - 1) * s;
          alpha = alpha * (1 - s) + s;
          color = sparkleColor;
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, r, 0, TWO_PI);
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

    function onMouseLeave(e) {
      if (
        e.clientX <= 0 ||
        e.clientY <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        mouse.x = -9999;
        mouse.y = -9999;
      }
    }

    function onResize() {
      setCanvasSize();
      makeDots();
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    setCanvasSize();
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
    <div className={`relative w-full h-full ${className}`} {...rest}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
});

MouseRepelDots.displayName = 'MouseRepelDots';

export default MouseRepelDots;