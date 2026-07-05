import React, { useEffect, useRef } from 'react';

/**
 * StaticNoiseText
 * Ambient (always-on, no hover needed) static noise text effect.
 * Each horizontal row of the text is shifted by a random amount every frame.
 *
 * Usage:
 *   <StaticNoiseText text="static noise" intensity={0.12} />
 *
 * Props:
 *   text        — string to render
 *   fontSize    — px (number)
 *   fontWeight  — css font-weight
 *   color       — text color
 *   intensity   — 0 (no noise) to 1 (heavy noise). Default 0.12
 *   maxShift    — max horizontal pixel shift at intensity = 1. Default 45
 *   fps         — cap animation frame rate. Default uncapped (60ish via rAF)
 */
export default function StaticNoiseText({
  text = 'static noise',
  fontSize = 56,
  fontWeight = 900,
  color = '#aaaaaa',
  intensity = 0.12,
  maxShift = 45,
  className = '',
}) {
  const canvasRef = useRef(null);
  const intensityRef = useRef(intensity);

  // keep latest intensity available inside the rAF loop without restarting it
  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

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

    const margin = Math.ceil(maxShift) + 10;
    canvas.width = w + margin * 2;
    canvas.height = h + margin * 2;

    let frameId;
    const run = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(margin, margin);
      const currentIntensity = intensityRef.current;
      for (let j = 0; j < h; j++) {
        const dx = Math.floor((Math.random() - 0.5) * currentIntensity * maxShift);
        ctx.drawImage(off, 0, j, w, 1, dx, j, w, 1);
      }
      ctx.restore();
      frameId = requestAnimationFrame(run);
    };
    run();

    return () => cancelAnimationFrame(frameId);
  }, [text, fontSize, fontWeight, color, maxShift]);

  return <canvas ref={canvasRef} className={className} />;
}

/* ----------------------------------------------------------------------
   Demo with a live slider control — drop into App.jsx to preview.
---------------------------------------------------------------------- */
export function StaticNoiseTextDemo() {
  const [intensity, setIntensity] = React.useState(0.12);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 p-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 flex items-center justify-center">
        <StaticNoiseText text="static noise" intensity={intensity} color="#aaaaaa" />
      </div>
      <div className="flex items-center gap-3 w-full max-w-xs">
        <label className="text-sm text-zinc-400 whitespace-nowrap">intensity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-zinc-300 w-10">{intensity.toFixed(2)}</span>
      </div>
    </div>
  );
}
