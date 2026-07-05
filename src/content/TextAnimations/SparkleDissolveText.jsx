import React, { useEffect, useRef } from 'react';

/**
 * SparkleDissolveText
 * Ambient (always-on) canvas text effect where random pixels of the glyphs
 * flicker — either flashing bright white ("sparkle") or vanishing briefly
 * ("dissolve") — every animation frame.
 *
 * Usage:
 *   <SparkleDissolveText text="sparkle dissolve" dissolve={0.12} />
 *
 * Props:
 *   text         — string to render
 *   fontSize     — px (number), default 48
 *   fontWeight   — css font-weight, default 900
 *   color        — base text color, default '#ffd23f'
 *   sparkleColor — color used for the bright flicker pixels, default '#ffffff'
 *   dissolve     — 0 (static, no flicker) to 1 (fully chaotic). Default 0.12
 *   sparkleRatio — of the affected pixels, fraction that flash bright vs vanish (0–1). Default 0.5
 */
export default function SparkleDissolveText({
  text = 'sparkle dissolve',
  fontSize = 48,
  fontWeight = 900,
  color = '#ffd23f',
  sparkleColor = '#ffffff',
  dissolve = 0.12,
  sparkleRatio = 0.5,
  className = '',
}) {
  const canvasRef = useRef(null);
  const dissolveRef = useRef(dissolve);
  const sparkleRatioRef = useRef(sparkleRatio);

  // keep latest values available inside the rAF loop without restarting it
  useEffect(() => {
    dissolveRef.current = dissolve;
  }, [dissolve]);
  useEffect(() => {
    sparkleRatioRef.current = sparkleRatio;
  }, [sparkleRatio]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // render the base text once onto an offscreen canvas to read its pixel data
    const off = document.createElement('canvas');
    const offCtx = off.getContext('2d');
    const font = `${fontWeight} ${fontSize}px sans-serif`;
    offCtx.font = font;

    const m = offCtx.measureText(text);
    const ascent = m.actualBoundingBoxAscent || fontSize;
    const descent = m.actualBoundingBoxDescent || fontSize * 0.25;
    const w = Math.ceil(m.width) + 20;
    const h = Math.ceil(ascent + descent) + 4;

    off.width = w;
    off.height = h;
    offCtx.font = font;
    offCtx.fillStyle = color;
    offCtx.textBaseline = 'alphabetic';
    offCtx.fillText(text, 10, ascent);

    const baseImageData = offCtx.getImageData(0, 0, w, h);

    const margin = 20;
    canvas.width = w + margin * 2;
    canvas.height = h + margin * 2;

    // parse sparkle color to rgb once
    const sparkleEl = document.createElement('div');
    sparkleEl.style.color = sparkleColor;
    document.body.appendChild(sparkleEl);
    const computed = window.getComputedStyle(sparkleEl).color;
    document.body.removeChild(sparkleEl);
    const rgbMatch = computed.match(/\d+/g) || [255, 255, 255];
    const [sr, sg, sb] = rgbMatch.map(Number);

    let frameId;
    const run = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(margin, margin);

      // clone base pixels fresh each frame, then randomly perturb
      const frame = new ImageData(
        new Uint8ClampedArray(baseImageData.data),
        w,
        h
      );
      const data = frame.data;
      const d = dissolveRef.current;
      const ratio = sparkleRatioRef.current;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 50 && Math.random() < d) {
          if (Math.random() < ratio) {
            data[i] = sr;
            data[i + 1] = sg;
            data[i + 2] = sb;
            data[i + 3] = 255;
          } else {
            data[i + 3] = 0;
          }
        }
      }

      ctx.putImageData(frame, 0, 0);
      ctx.restore();
      frameId = requestAnimationFrame(run);
    };
    run();

    return () => cancelAnimationFrame(frameId);
  }, [text, fontSize, fontWeight, color, sparkleColor]);

  return <canvas ref={canvasRef} className={className} />;
}

/* ----------------------------------------------------------------------
   Demo with live controls — drop into App.jsx to preview.
---------------------------------------------------------------------- */
export function SparkleDissolveTextDemo() {
  const [dissolve, setDissolve] = React.useState(0.12);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 p-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 flex items-center justify-center">
        <SparkleDissolveText text="sparkle dissolve" dissolve={dissolve} />
      </div>
      <div className="flex items-center gap-3 w-full max-w-xs">
        <label className="text-sm text-zinc-400 whitespace-nowrap">dissolve</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={dissolve}
          onChange={(e) => setDissolve(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-zinc-300 w-10">{dissolve.toFixed(2)}</span>
      </div>
    </div>
  );
}
