import { useRef, useEffect, useLayoutEffect, useId, useState, CSSProperties } from 'react';
import gsap from 'gsap';

export interface WavePathTextProps {
  text?: string;
  path?: string;
  className?: string;
  textClassName?: string;
  duration?: number;
  reversed?: boolean;
  letterSpacing?: string;
  viewBox?: string;
  pathScale?: number;
  gap?: string;
}

interface LoopState {
  repeatedText: string;
  unitLength: number;
}

const WavePathText: React.FC<WavePathTextProps> = ({
  text = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do',
  path = 'M-400,90 C-350,50 -300,50 -250,90 C-200,130 -150,130 -100,90 C-50,50 0,50 50,90 C100,130 150,130 200,90 C250,50 300,50 350,90 C400,130 450,130 500,90 C550,50 600,50 650,90 C700,130 750,130 800,90 C850,50 900,50 950,90 C1000,130 1050,130 1100,90 C1150,50 1200,50 1250,90',
  className = '',
  textClassName = 'text-6xl sm:text-6xl md:text-6xl lg:text-5xl',
  duration = 21,
  reversed = false,
  letterSpacing = 'normal',
  viewBox = '0 0 700 160',
  pathScale = 1,
  gap = '   '
}) => {
  const uid = useId().replace(/:/g, '');
  const pathId = `curved-loop-path-${uid}`;
  const measureRef = useRef<SVGTSpanElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [ready, setReady] = useState(false);
  const stateRef = useRef<LoopState>({ repeatedText: text, unitLength: 0 });
  const [repeatedText, setRepeatedText] = useState(text);

  // scale from the center of the viewBox instead of the top-left origin
  const [vbX, vbY, vbW, vbH] = viewBox.split(' ').map(Number);
  const cx = vbX + vbW / 2;
  const cy = vbY + vbH / 2;
  const groupTransform = `translate(${cx} ${cy}) scale(${pathScale}) translate(${-cx} ${-cy})`;

  // Tile the text (with a small gap) just enough times to fully cover the
  // path — so text is ALWAYS present somewhere along it, never runs out.
  // Then animate by exactly one tile's measured length: since the pattern
  // repeats with that exact period, wrapping back after one shift lands on
  // a frame that looks identical to the start — a true, gapless infinite loop.
  useLayoutEffect(() => {
    if (!measureRef.current || !pathRef.current) return;

    const unitText = `${text}${gap}`;
    measureRef.current.textContent = unitText;
    const unitLength = measureRef.current.getComputedTextLength();
    const pathLength = pathRef.current.getTotalLength();

    const copies = unitLength > 0 ? Math.ceil(pathLength / unitLength) + 1 : 1;

    stateRef.current = {
      repeatedText: unitText.repeat(Math.max(copies, 1)),
      unitLength
    };
    setRepeatedText(unitText.repeat(Math.max(copies, 1)));
    setReady(true);
    // re-measure whenever the text-size classes change too, since that
    // changes the rendered length of each tile
  }, [text, gap, path, textClassName]);

  useEffect(() => {
    if (!ready || !textPathRef.current || !stateRef.current.unitLength) return;

    tweenRef.current?.kill();

    const shift = reversed ? stateRef.current.unitLength : -stateRef.current.unitLength;

    tweenRef.current = gsap.fromTo(
      textPathRef.current,
      { attr: { startOffset: 0 } },
      {
        attr: { startOffset: shift },
        duration,
        ease: 'none',
        repeat: -1
      }
    );

    return () => {
      tweenRef.current?.kill();
    };
  }, [ready, duration, reversed]);

  const textStyle: CSSProperties = { letterSpacing, whiteSpace: 'pre' };

  return (
    <svg className={className} viewBox={viewBox} width="100%" style={{ overflow: 'visible', display: 'block' }}>
      <g transform={groupTransform}>
        <path ref={pathRef} id={pathId} d={path} fill="none" stroke="none" />
        <text className={textClassName} style={textStyle} fill="currentColor">
          {/* hidden — used only to measure one tile's rendered length */}
          <tspan ref={measureRef} opacity={0} />
          <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0">
            {repeatedText}
          </textPath>
        </text>
      </g>
    </svg>
  );
};

export default WavePathText;