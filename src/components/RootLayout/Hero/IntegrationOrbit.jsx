import { useEffect, useRef } from 'react';

const ARC_RADIUS_FRACTIONS = [0.38, 0.55, 0.72, 0.88];

const DRAW_ICON = {
  claude: (ctx, x, y, s) => {
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * s * 0.25, y + Math.sin(a) * s * 0.25);
      ctx.lineTo(x + Math.cos(a) * s * 0.7, y + Math.sin(a) * s * 0.7);
      ctx.strokeStyle = '#e8674a';
      ctx.lineWidth = s * 0.18;
      ctx.stroke();
    }
  },
  figma: (ctx, x, y, s) => {
    ctx.fillStyle = '#f24e1e';
    ctx.beginPath();
    ctx.roundRect(x - s * 0.5, y - s, s, s, 3);
    ctx.fill();
    ctx.fillStyle = '#ff7262';
    ctx.beginPath();
    ctx.roundRect(x, y - s, s, s, 3);
    ctx.fill();
    ctx.fillStyle = '#a259ff';
    ctx.beginPath();
    ctx.roundRect(x, y, s, s, 3);
    ctx.fill();
    ctx.fillStyle = '#1abcfe';
    ctx.beginPath();
    ctx.arc(x + s * 0.5, y + s * 0.5, s * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0acf83';
    ctx.beginPath();
    ctx.roundRect(x - s * 0.5, y, s, s, 3);
    ctx.fill();
  },
  slack: (ctx, x, y, s) => {
    const colors = ['#e01e5a', '#36c5f0', '#2eb67d', '#ecb22e'];
    const pos = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1]
    ];
    pos.forEach(([dx, dy], i) => {
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.roundRect(x + dx * s * 0.3 - s * 0.2, y + dy * s * 0.3 - s * 0.2, s * 0.4, s * 0.4, s * 0.12);
      ctx.fill();
    });
  },
  openai: (ctx, x, y, s) => {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = s * 0.12;
    ctx.beginPath();
    ctx.arc(x, y, s * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, s * 0.35, 0, Math.PI * 2);
    ctx.stroke();
  },
  vercel: (ctx, x, y, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x, y - s * 0.7);
    ctx.lineTo(x + s * 0.7, y + s * 0.6);
    ctx.lineTo(x - s * 0.7, y + s * 0.6);
    ctx.closePath();
    ctx.fill();
  },
  linear: (ctx, x, y, s) => {
    ctx.strokeStyle = '#aaaaaa';
    ctx.lineWidth = s * 0.12;
    ctx.beginPath();
    ctx.arc(x, y, s * 0.65, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - s * 0.4, y + s * 0.4);
    ctx.lineTo(x + s * 0.4, y - s * 0.4);
    ctx.stroke();
  },
  supabase: (ctx, x, y, s) => {
    ctx.fillStyle = '#3ecf8e';
    ctx.beginPath();
    ctx.moveTo(x - s * 0.4, y + s * 0.6);
    ctx.lineTo(x + s * 0.5, y - s * 0.1);
    ctx.lineTo(x + s * 0.1, y - s * 0.1);
    ctx.lineTo(x + s * 0.4, y - s * 0.6);
    ctx.lineTo(x - s * 0.5, y + s * 0.1);
    ctx.lineTo(x - s * 0.1, y + s * 0.1);
    ctx.closePath();
    ctx.fill();
  },
  stripe: (ctx, x, y, s) => {
    ctx.fillStyle = '#635bff';
    ctx.beginPath();
    ctx.roundRect(x - s * 0.7, y - s * 0.7, s * 1.4, s * 1.4, s * 0.3);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${s * 1.1}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', x, y + s * 0.05);
  }
};

function makeParticles(count) {
  return Array.from({ length: count }, () => ({
    theta: Math.random() * Math.PI * 2,
    phi: Math.acos(2 * Math.random() - 1),
    speed: (Math.random() - 0.5) * 0.002
  }));
}

function makeOrbitIcons(icons) {
  return icons.map((key, i) => ({
    key,
    arcIdx: i % ARC_RADIUS_FRACTIONS.length,
    angle: (i / icons.length) * Math.PI * 2 - Math.PI * 0.5,
    speed: (i % 2 === 0 ? 1 : -1) * (0.0003 + i * 0.00004)
  }));
}

export function IntegrationOrbit({
  icons = ['claude', 'figma', 'slack', 'openai', 'vercel', 'linear', 'supabase', 'stripe'],
  height = 520,
  globeColor = [190, 70, 65],
  particleCount = 1800,
  speedMultiplier = 1
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = makeParticles(particleCount);
    const orbitIcons = makeOrbitIcons(icons);
    const [gh, gs, gl] = globeColor;

    function drawGlobe(cx, cy, R) {
      const tilt = 0.4;
      particles.forEach(p => {
        p.theta += p.speed * speedMultiplier;
        const x3 = R * Math.sin(p.phi) * Math.cos(p.theta);
        const y3 = R * Math.cos(p.phi);
        const z3 = R * Math.sin(p.phi) * Math.sin(p.theta);
        const px = cx + x3;
        const py = cy + y3 * Math.cos(tilt) - z3 * Math.sin(tilt);
        const depth = (z3 * Math.cos(tilt) + y3 * Math.sin(tilt)) / R;
        const alpha = 0.15 + depth * 0.35;
        if (alpha <= 0) return;
        ctx.beginPath();
        ctx.arc(px, py, 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${gh + depth * 40},${gs}%,${gl}%,${alpha.toFixed(2)})`;
        ctx.fill();
      });
    }

    function drawIconBadge(key, x, y, size) {
      const buttonBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-button').trim();
      const buttonBorder = getComputedStyle(document.documentElement).getPropertyValue('--border-secondary').trim();

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = buttonBg;
      ctx.fill();
      ctx.strokeStyle = buttonBorder;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size * 0.85, 0, Math.PI * 2);
      ctx.clip();
      DRAW_ICON[key]?.(ctx, x, y, size * 0.45);
      ctx.restore();
    }

    function draw() {
      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H * 0.8;
      const maxR = Math.min(W * 0.95, H * 0.82);

      ARC_RADIUS_FRACTIONS.forEach(frac => {
        const orbitColor = getComputedStyle(document.documentElement).getPropertyValue('--border-orbit').trim();

        ctx.beginPath();
        ctx.arc(cx, cy, maxR * frac, 0, Math.PI * 2);
        ctx.strokeStyle = orbitColor;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      drawGlobe(cx, cy, maxR * 0.28);

      orbitIcons.forEach(icon => {
        icon.angle += icon.speed * speedMultiplier;
        const r = maxR * ARC_RADIUS_FRACTIONS[icon.arcIdx];
        const x = cx + Math.cos(icon.angle) * r;
        const y = cy + Math.sin(icon.angle) * r;
        if (y > cy + 8) return;
        drawIconBadge(icon.key, x, y, 14 + (1 - ARC_RADIUS_FRACTIONS[icon.arcIdx]) * 6);
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [icons, globeColor, particleCount, speedMultiplier]);

  const canvasHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className="relative w-full" style={{ height: canvasHeight }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
