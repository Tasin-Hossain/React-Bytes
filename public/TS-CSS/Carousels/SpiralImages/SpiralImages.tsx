import { useEffect, useRef } from 'react';

const TWO_PI = Math.PI * 2;

export interface SpiralImageItem {
  src: string;
}

export interface SpiralImagesProps {
  images?: SpiralImageItem[];
  turns?: number;
  speed?: number;
  spacing?: number;
  spread?: number;
  sizeAttenuation?: number;
  imageSize?: number;
  fadeIn?: number;
  fadeOut?: number;
  cornerRadius?: number;
  className?: string;
}

// 30 stable seeded images (used when no `images` prop is passed).
const DEFAULT_IMAGES: SpiralImageItem[] = [
  { src: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=70' }
];

// Wrapper styling — inlined here (instead of a separate .css file) so the
// component ships as a single, drop-in file.
const CSS = `
.spiralImages-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.spiralImages-canvas {
  display: block;
}
`;

interface Point {
  x: number;
  y: number;
}

interface Card {
  tt: number;
  n: number;
  img: number;
}

export default function SpiralImages({
  images = DEFAULT_IMAGES,
  turns = 3.5,
  speed = 2,
  spacing = 5,
  spread = 6,
  sizeAttenuation = 2,
  imageSize = 200,
  fadeIn = 20,
  fadeOut = 0,
  cornerRadius = 5,
  className = ''
}: SpiralImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const lastRef = useRef<number>(0);
  const imgsRef = useRef<(HTMLImageElement | null)[]>([]);

  const items = images.length > 0 ? images : DEFAULT_IMAGES;

  // Load images whenever the source list changes.
  const srcKey = items.map((im) => im?.src || '').join('|');
  useEffect(() => {
    imgsRef.current = items.map((im) => {
      if (!im?.src) return null;
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.src = im.src;
      return el;
    });
  }, [items, srcKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = container.clientWidth || 600;
      h = container.clientHeight || 600;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Archimedean spiral (linear radius) → every turn is equally spaced.
    // n in [0,1] → outer edge (n=0) to center (n=1).
    const spiral = (n: number, R: number): Point => {
      const ang = n * turns * TWO_PI;
      const rad = R * (1 - n);
      return { x: rad * Math.cos(ang), y: -rad * Math.sin(ang) };
    };

    // Arc-length reparameterization: equal arc steps → equal visual spacing
    // (a uniform parameter step would bunch cards near the center). Shape is
    // R-independent, so build the table once at R=1.
    const M = 2000;
    const cum = new Float32Array(M + 1);
    let prev = spiral(0, 1);
    for (let k = 1; k <= M; k++) {
      const pt = spiral(k / M, 1);
      const dx = pt.x - prev.x;
      const dy = pt.y - prev.y;
      cum[k] = cum[k - 1] + Math.sqrt(dx * dx + dy * dy);
      prev = pt;
    }
    const total = cum[M] || 1;
    const K = 1024;
    const nForArc = new Float32Array(K + 1);
    let j = 0;
    for (let a = 0; a <= K; a++) {
      const target = (a / K) * total;
      while (j < M && cum[j + 1] < target) j++;
      const seg = cum[j + 1] - cum[j];
      const f2 = seg > 0 ? (target - cum[j]) / seg : 0;
      nForArc[a] = (j + f2) / M;
    }
    // arc fraction s in [0,1) → spiral parameter n (interpolated; rounding
    // here would quantize motion into visible steps / chop).
    const arcToN = (s: number): number => {
      const x = Math.max(0, Math.min(K, s * K));
      const i = Math.floor(x);
      const a = nForArc[i];
      const b = nForArc[Math.min(i + 1, K)];
      return a + (b - a) * (x - i);
    };

    const roundRect = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      rw: number,
      rh: number,
      r: number
    ) => {
      const rr = Math.min(r, rw / 2, rh / 2);
      c.beginPath();
      c.moveTo(x + rr, y);
      c.arcTo(x + rw, y, x + rw, y + rh, rr);
      c.arcTo(x + rw, y + rh, x, y + rh, rr);
      c.arcTo(x, y + rh, x, y, rr);
      c.arcTo(x, y, x + rw, y, rr);
      c.closePath();
    };

    const draw = (now: number) => {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
      lastRef.current = now;
      const f = Math.min(dt, 0.1);

      // Advance the global progress (wraps 0..100).
      progressRef.current = (progressRef.current + speed * f) % 100;
      const L = progressRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      // Spread scales the radius uniformly → wider, still-equal turn gaps
      // (outer arms overflow and are clipped by the container).
      const R = 0.48 * Math.min(w, h) * (1 + (spread - 1) * 0.18);
      const els = imgsRef.current;
      const nImgs = els.length || 1;

      // Slots fill the whole path with equal ARC spacing (one card every
      // `stepFrac` of the spiral's length). Cards cycle through the images
      // so the stream is continuous and infinite even with one image.
      const stepFrac = Math.max(0.005, (spacing * 0.5) / 100);
      const slots = Math.min(400, Math.ceil(1 / stepFrac) + 2);
      const base = L / 100;

      // Build cards, sorted outer→center so center cards draw on top.
      const cards: Card[] = [];
      for (let i = 0; i < slots; i++) {
        const s = (((base + i * stepFrac) % 1) + 1) % 1;
        const n = arcToN(s);
        cards.push({ tt: s * 100, n, img: i % nImgs });
      }
      cards.sort((a, b) => a.n - b.n);

      for (let k = 0; k < cards.length; k++) {
        const { tt, n, img: imgIdx } = cards[k];
        const p = spiral(n, R);
        const dist = Math.sqrt(p.x * p.x + p.y * p.y);

        // Fade at both ends of the path.
        let opacity = 1;
        if (tt < fadeIn) opacity = tt / fadeIn;
        else if (tt > 100 - fadeOut) opacity = (100 - tt) / fadeOut;
        if (opacity < 0.01) continue;

        // Size attenuation — smaller toward the center.
        const scale = sizeAttenuation > 0 ? Math.pow(Math.min(dist / R, 1), sizeAttenuation * 0.5) : 1;

        // Tangent angle (finite difference) for rotation.
        const p2 = spiral(Math.min(n + 0.001, 1), R);
        const angle = Math.atan2(p2.y - p.y, p2.x - p.x);

        const el = els[imgIdx];
        const ready = !!el && el.complete && el.naturalWidth > 0;

        // Every card is the same fixed square (imageSize x imageSize) no
        // matter what the source image's own aspect ratio is.
        const cw = imageSize * scale;
        const ch = imageSize * scale;

        const x = cx + p.x;
        const y = cy + p.y;
        const rad = (cornerRadius / 20) * (Math.min(cw, ch) / 2);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.globalAlpha = opacity;
        roundRect(ctx, -cw / 2, -ch / 2, cw, ch, rad);
        ctx.clip();
        if (ready && el) {
          // Cover-fit: crop the source image to the target box's aspect
          // ratio (1:1 here) so it fills the card without stretching.
          const iw = el.naturalWidth;
          const ih = el.naturalHeight;
          const srcAspect = iw / ih;
          const dstAspect = cw / ch;
          let sx = 0;
          let sy = 0;
          let sw = iw;
          let sh = ih;
          if (srcAspect > dstAspect) {
            sw = ih * dstAspect;
            sx = (iw - sw) / 2;
          } else if (srcAspect < dstAspect) {
            sh = iw / dstAspect;
            sy = (ih - sh) / 2;
          }
          ctx.drawImage(el, sx, sy, sw, sh, -cw / 2, -ch / 2, cw, ch);
        } else {
          ctx.fillStyle = `hsl(${(imgIdx * 360) / nImgs}, 65%, 55%)`;
          ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
        }
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    lastRef.current = 0;
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [srcKey, turns, speed, spacing, spread, sizeAttenuation, imageSize, fadeIn, fadeOut, cornerRadius]);

  return (
    <div ref={containerRef} className={`spiralImages-container ${className}`}>
      <style>{CSS}</style>
      <canvas ref={canvasRef} className="spiralImages-canvas" />
    </div>
  );
}
