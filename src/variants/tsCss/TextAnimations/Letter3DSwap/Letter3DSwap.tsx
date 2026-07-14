import {
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
  type HTMLAttributes
} from 'react';
import gsap from 'gsap';

/* ---- internal CSS (no external .css file needed) ---- */
const STYLES = `
.letter3d-root {
  display: inline-flex;
  flex-wrap: wrap;
  perspective: 900px;
}
.letter3d-word {
  display: inline-flex;
}
.letter3d-char {
  position: relative;
  display: inline-block;
  height: 1lh;
  transform-style: preserve-3d;
  will-change: transform;
}
.letter3d-face {
  position: relative;
  display: flex;
  height: 1lh;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
}
.letter3d-face--back {
  position: absolute;
  left: 0;
  top: 0;
}
.letter3d-space {
  white-space: pre;
}
`;

type Direction = 'top' | 'right' | 'bottom' | 'left';
type StaggerFrom = 'first' | 'last' | 'center' | 'random' | number;
type Trigger = 'hover' | 'mount' | 'manual';

export interface Letter3DSwapHandle {
  flip: () => void;
}

export interface Letter3DSwapProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'onAnimationEnd'> {
  text?: string;
  direction?: Direction;
  staggerFrom?: StaggerFrom;
  staggerDuration?: number;
  flipDuration?: number;
  trigger?: Trigger;
  className?: string;
  charClassName?: string;
  onFlipComplete?: () => void;
}

/* ---- 3D flip mechanics (ported 1:1 from the original ROTATION_MAP / FACE transforms) ---- */
const ROTATION_MAP: Record<Direction, string> = {
  top: 'rotateX(90deg)',
  right: 'rotateY(90deg)',
  bottom: 'rotateX(-90deg)',
  left: 'rotateY(-90deg)'
};

const SECOND_FACE_TRANSFORMS: Record<Direction, string> = {
  top: 'rotateX(-90deg) translateZ(0.5lh)',
  right: 'rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(-50%) rotateY(-90deg) translateX(50%)',
  bottom: 'rotateX(90deg) translateZ(0.5lh)',
  left: 'rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(50%) rotateY(-90deg) translateX(50%)'
};

const FRONT_FACE_TRANSFORMS: Record<Direction, string> = {
  top: 'translateZ(0.5lh)',
  bottom: 'translateZ(0.5lh)',
  left: 'rotateY(90deg) translateX(50%) rotateY(-90deg)',
  right: 'rotateY(-90deg) translateX(50%) rotateY(90deg)'
};

const CONTAINER_TRANSFORMS: Record<Direction, string> = {
  top: 'translateZ(-0.5lh)',
  bottom: 'translateZ(-0.5lh)',
  left: 'rotateY(90deg) translateX(50%) rotateY(-90deg)',
  right: 'rotateY(90deg) translateX(50%) rotateY(-90deg)'
};

const HAS_SEGMENTER = typeof Intl !== 'undefined' && 'Segmenter' in Intl;
function splitIntoCharacters(text: string): string[] {
  if (HAS_SEGMENTER) {
    const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(seg.segment(text), s => s.segment);
  }
  return Array.from(text);
}

function getStaggerDelay(
  index: number,
  totalChars: number,
  staggerFrom: StaggerFrom,
  staggerDuration: number
): number {
  if (staggerFrom === 'first') return index * staggerDuration;
  if (staggerFrom === 'last') return (totalChars - 1 - index) * staggerDuration;
  if (staggerFrom === 'center') {
    const center = Math.floor(totalChars / 2);
    return Math.abs(center - index) * staggerDuration;
  }
  if (staggerFrom === 'random') {
    const r = Math.floor(Math.random() * totalChars);
    return Math.abs(r - index) * staggerDuration;
  }
  return Math.abs(staggerFrom - index) * staggerDuration;
}

const Letter3DSwap = forwardRef<Letter3DSwapHandle, Letter3DSwapProps>(function TextFlipBoard(
  {
    text = 'DEPARTURES',
    direction = 'right',
    staggerFrom = 'first',
    staggerDuration = 50,
    flipDuration = 0.45,
    trigger = 'hover',
    className = '',
    charClassName = '',
    onFlipComplete,
    ...rest
  },
  ref
) {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const charRefs = useRef<HTMLSpanElement[]>([]);
  const isAnimating = useRef(false);

  const words = useMemo(() => text.split(' '), [text]);

  // flatten char refs fresh on every render of `text`
  charRefs.current = [];
  const registerChar = (el: HTMLSpanElement | null) => {
    if (el) charRefs.current.push(el);
  };

  const flip = () => {
    const charEls = charRefs.current;
    if (!charEls.length || isAnimating.current) return;
    isAnimating.current = true;

    const total = charEls.length;
    const staggerSec = staggerDuration / 1000;
    const delays = charEls.map((_, i) => getStaggerDelay(i, total, staggerFrom, staggerSec));

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(charEls, { css: { transform: CONTAINER_TRANSFORMS[direction] } });
        isAnimating.current = false;
        onFlipComplete?.();
      }
    });

    charEls.forEach((el, i) => {
      tl.to(
        el,
        {
          duration: flipDuration,
          ease: 'back.out(1.6)',
          css: { transform: ROTATION_MAP[direction] }
        },
        delays[i]
      );
    });
  };

  useImperativeHandle(ref, () => ({ flip }));

  // reset every char to its container transform whenever text/direction changes
  useEffect(() => {
    gsap.set(charRefs.current, { css: { transform: CONTAINER_TRANSFORMS[direction] } });
    isAnimating.current = false;

    if (trigger === 'mount') flip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, direction]);

  return (
    <>
      <style>{STYLES}</style>
      <h1
        ref={rootRef}
        className={`letter3d-root ${className}`}
        onMouseEnter={trigger === 'hover' ? flip : undefined}
        {...rest}
      >
      {words.map((word, wi) => (
        <span key={wi} className="letter3d-word">
          {splitIntoCharacters(word).map((ch, ci) => (
            <span
              key={ci}
              ref={registerChar}
              className={`letter3d-char ${charClassName}`}
              style={{ transform: CONTAINER_TRANSFORMS[direction] }}
            >
              <span
                className="letter3d-face"
                style={{ transform: FRONT_FACE_TRANSFORMS[direction] }}
              >
                {ch}
              </span>
              <span
                className="letter3d-face letter3d-face--back"
                style={{ transform: SECOND_FACE_TRANSFORMS[direction] }}
              >
                {ch}
              </span>
            </span>
          ))}
          {wi !== words.length - 1 && <span className="letter3d-space"> </span>}
        </span>
      ))}
      </h1>
    </>
  );
});

export default Letter3DSwap;
