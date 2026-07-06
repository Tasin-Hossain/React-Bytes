import React, { useEffect, useRef, useLayoutEffect, useState, useCallback } from 'react';

export interface StaticNoiseTextProps {
  text?: string;
  fontWeight?: number;
  color?: string;
  intensity?: number;
  density?: number;
  maxShift?: number;
  textStyle?: React.CSSProperties;
}

interface LineMetric {
  line: string;
  width: number;
  ascent: number;
  descent: number;
}

export default function StaticNoiseText({
  text = 'static noise',
  fontWeight = 900,
  color = '#aaaaaa',
  intensity = 0.12,
  density = 1,
  maxShift = 45,
  textStyle,
}: StaticNoiseTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const intensityRef = useRef(intensity);
  const densityRef = useRef(density);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const measureStyle: React.CSSProperties = {
    position: 'absolute',
    visibility: 'hidden',
    pointerEvents: 'none',
    fontSize: viewportWidth >= 1024 ? '6rem' : '3.75rem',
    lineHeight: 1,
    fontWeight: 900,
    ...textStyle,
  };

  useEffect(() => { intensityRef.current = intensity; }, [intensity]);
  useEffect(() => { densityRef.current = density; }, [density]);

  // measure actual rendered font-size + track container width for wrapping
  useLayoutEffect(() => {
    const measureFont = () => {
      if (!measureRef.current) return;
      setFontSize(parseFloat(getComputedStyle(measureRef.current).fontSize));
    };
    measureFont();

    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
      measureFont();
    });
    ro.observe(containerRef.current);
    window.addEventListener('resize', measureFont);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureFont);
    };
  }, [viewportWidth]);

  const wrapLines = useCallback((ctx: CanvasRenderingContext2D, words: string[], maxWidth: number) => {
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }, []);

  useEffect(() => {
    if (!fontSize || !containerWidth) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const off = document.createElement('canvas');
    const offCtx = off.getContext('2d');
    if (!offCtx) return;
    const font = `${fontWeight} ${fontSize}px sans-serif`;
    offCtx.font = font;

    const lineHeightPx = fontSize * 1.15;
    const words = text.split(' ');
    const lines = wrapLines(offCtx, words, containerWidth);

    const lineMetrics: LineMetric[] = lines.map(line => {
      const m = offCtx.measureText(line);
      const ascent = m.actualBoundingBoxAscent || fontSize;
      const descent = m.actualBoundingBoxDescent || fontSize * 0.25;
      return { line, width: Math.ceil(m.width), ascent, descent };
    });

    const w = Math.min(
      containerWidth,
      Math.max(...lineMetrics.map(l => l.width)) + 20
    );
    const h = Math.ceil(lineMetrics.length * lineHeightPx) + 8;

    off.width = w;
    off.height = h;
    offCtx.font = font;
    offCtx.fillStyle = color;
    offCtx.textBaseline = 'alphabetic';

    lineMetrics.forEach((lm, i) => {
      const y = i * lineHeightPx + lm.ascent + 4;
      offCtx.fillText(lm.line, (w - lm.width) / 2, y);
    });

    const MARGIN = Math.ceil(maxShift) + 10;
    canvas.width = w + MARGIN * 2;
    canvas.height = h + MARGIN * 2;

    let frameId: number;
    const run = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(MARGIN, MARGIN);
      const currentIntensity = intensityRef.current;
      const currentDensity = densityRef.current;
      for (let j = 0; j < h; j++) {
        const affected = Math.random() < currentDensity;
        const dx = affected
          ? Math.floor((Math.random() - 0.5) * currentIntensity * maxShift)
          : 0;
        ctx.drawImage(off, 0, j, w, 1, dx, j, w, 1);
      }
      ctx.restore();
      frameId = requestAnimationFrame(run);
    };
    run();

    return () => cancelAnimationFrame(frameId);
  }, [text, fontWeight, color, maxShift, fontSize, containerWidth, wrapLines]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <span ref={measureRef} style={measureStyle} aria-hidden="true">
        {text}
      </span>
      <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />
    </div>
  );
}