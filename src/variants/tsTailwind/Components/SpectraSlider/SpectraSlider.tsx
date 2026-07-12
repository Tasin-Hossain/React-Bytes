// TS-TW variant
import { useEffect, useRef, useState, CSSProperties, ReactNode } from 'react';
import gsap from 'gsap';

interface CardItem {
  id?: string | number;
  image?: string;
  label?: string;
  content?: ReactNode;
}

type EntranceType = 'pop' | 'fade' | 'bottom' | 'top' | 'left' | 'right' | 'flip' | 'scatter' | 'spin' | 'zoomBlur';

const FALLBACK_CARDS: CardItem[] = [
  { id: 1, image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&q=70' },
  { id: 2, image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=500&q=70' },
  { id: 3, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=70' },
  { id: 4, image: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=500&q=70' },
  { id: 5, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&q=70' },
  { id: 6, image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=500&q=70' },
  { id: 7, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&q=70' }
];

const FILTER_STYLE = 'grayscale(100%) brightness(0.52) contrast(1.18)';

interface SpectraSliderProps {
  cards?: CardItem[];
  numberOfCards?: number;
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  perspective?: number;
  maxRotation?: number;
  scaleStep?: number;
  opacityStep?: number;
  brightnessStep?: number;
  draggable?: boolean;
  snap?: boolean;
  initialIndex?: number;
  className?: string;
  cardClassName?: string;
  onCardClick?: (card: CardItem, index: number) => void;
  autoPlay?: boolean;
  duration?: number;
  direction?: 'horizontal' | 'vertical';
  curveIntensity?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  mouseWheel?: boolean;
  wheelSmoothness?: number;
  wheelSensitivity?: number;
  filterOnHover?: boolean;
  defaultFiltered?: boolean;
  entranceAnimation?: boolean;
  entranceDuration?: number;
  entranceStagger?: number;
  entranceEase?: string;
  entranceType?: EntranceType;
}

export function SpectraSlider({
  cards = [],
  numberOfCards = 7,
  cardWidth = 220,
  cardHeight = 340,
  gap = 190,
  perspective = 1200,
  maxRotation = 35,
  scaleStep = 0.14,
  opacityStep = 0.28,
  brightnessStep = 0.35,
  draggable = true,
  snap = true,
  initialIndex = 0,
  className = '',
  cardClassName = '',
  onCardClick,
  autoPlay = false,
  duration = 20,
  direction = 'vertical',
  curveIntensity = -20,
  reverse = false,
  pauseOnHover = true,
  mouseWheel = true,
  wheelSmoothness = 0.15,
  wheelSensitivity = 0.008,
  filterOnHover = false,
  defaultFiltered = false,
  entranceAnimation = true,
  entranceDuration = 0.9,
  entranceStagger = 0.07,
  entranceEase = 'back.out(1.4)',
  entranceType = 'spin'
}: SpectraSliderProps) {
  const sourceCards = cards.length > 0 ? cards : FALLBACK_CARDS;
  const activeCards = sourceCards.slice(0, Math.max(numberOfCards, 3));
  const total = activeCards.length;
  const isVertical = direction === 'vertical';

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsetRef = useRef(initialIndex);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startOffset: 0 });
  const tickerFnRef = useRef<(() => void) | null>(null);
  const tickingRef = useRef(false);
  const hoverPausedRef = useRef(false);
  const hoveredRef = useRef(false);
  const mountedRef = useRef(false);
  const wheelTargetRef = useRef(initialIndex);
  const wheelTickerFnRef = useRef<(() => void) | null>(null);
  const wheelTickingRef = useRef(false);
  const wheelSnapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [filteredCards, setFilteredCards] = useState<Set<number>>(() => {
    if (!defaultFiltered) return new Set();
    return new Set(activeCards.map((_, i) => i));
  });

  const totalRef = useRef(total),
    gapRef = useRef(gap),
    maxRotationRef = useRef(maxRotation);
  const scaleStepRef = useRef(scaleStep),
    opacityStepRef = useRef(opacityStep);
  const brightnessStepRef = useRef(brightnessStep),
    durationRef = useRef(duration);
  const reverseRef = useRef(reverse),
    autoPlayRef = useRef(autoPlay),
    directionRef = useRef(direction);
  const curveIntensityRef = useRef(curveIntensity),
    wheelSmoothnessRef = useRef(wheelSmoothness);
  const wheelSensitivityRef = useRef(wheelSensitivity);

  useEffect(() => {
    totalRef.current = total;
    gapRef.current = gap;
    maxRotationRef.current = maxRotation;
    scaleStepRef.current = scaleStep;
    opacityStepRef.current = opacityStep;
    brightnessStepRef.current = brightnessStep;
    durationRef.current = duration;
    reverseRef.current = reverse;
    autoPlayRef.current = autoPlay;
    directionRef.current = direction;
    curveIntensityRef.current = curveIntensity;
    wheelSmoothnessRef.current = wheelSmoothness;
    wheelSensitivityRef.current = wheelSensitivity;
  }, [
    total,
    gap,
    maxRotation,
    scaleStep,
    opacityStep,
    brightnessStep,
    duration,
    reverse,
    autoPlay,
    direction,
    curveIntensity,
    wheelSmoothness,
    wheelSensitivity
  ]);

  const wrapDiff = (i: number, offset: number, total: number) => {
    let diff = (i - offset) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const placeCards = () => {
    const vertical = directionRef.current === 'vertical';
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const diff = wrapDiff(i, offsetRef.current, totalRef.current),
        absDiff = Math.abs(diff);
      const offset = diff * gapRef.current,
        curveOffset = curveIntensityRef.current * absDiff * absDiff;
      const rotate = gsap.utils.clamp(-maxRotationRef.current, maxRotationRef.current, -diff * 22);
      const scale = Math.max(0.35, 1 - absDiff * scaleStepRef.current);
      const opacity = Math.max(0, 1 - absDiff * opacityStepRef.current);
      const brightness = Math.max(0.25, 1 - absDiff * brightnessStepRef.current);
      gsap.set(el, {
        x: vertical ? curveOffset : offset,
        y: vertical ? offset : curveOffset,
        z: -absDiff * 60,
        rotateY: vertical ? 0 : rotate,
        rotateX: vertical ? rotate : 0,
        scale,
        opacity,
        zIndex: Math.round(100 - absDiff * 10),
        filter: `brightness(${brightness})`
      });
    });
  };

  const stopTicker = () => {
    if (!tickingRef.current || !tickerFnRef.current) return;
    gsap.ticker.remove(tickerFnRef.current);
    tickerFnRef.current = null;
    tickingRef.current = false;
  };
  const startTicker = () => {
    if (tickingRef.current) return;
    const dir = reverseRef.current ? -1 : 1;
    tickerFnRef.current = () => {
      offsetRef.current += (dir * totalRef.current) / (durationRef.current * 60);
      offsetRef.current = ((offsetRef.current % totalRef.current) + totalRef.current) % totalRef.current;
      placeCards();
    };
    gsap.ticker.add(tickerFnRef.current);
    tickingRef.current = true;
  };
  const maybeStartTicker = () => {
    if (autoPlayRef.current && !hoverPausedRef.current && !dragRef.current.active && !wheelTickingRef.current)
      startTicker();
  };

  const getEntranceVars = (type: EntranceType) => {
    switch (type) {
      case 'fade':
        return { opacity: 0 };
      case 'bottom':
        return { opacity: 0, y: '+=140' };
      case 'top':
        return { opacity: 0, y: '-=140' };
      case 'left':
        return { opacity: 0, x: '-=180' };
      case 'right':
        return { opacity: 0, x: '+=180' };
      case 'flip':
        return { opacity: 0, scaleX: 0 };
      case 'spin':
        return { opacity: 0, scale: 0, rotation: '+=360' };
      case 'zoomBlur':
        return { opacity: 0, scale: 2.4, filter: 'blur(14px)' };
      case 'scatter':
        return {
          opacity: 0,
          scale: 0.3,
          x: () => gsap.utils.random(-300, 300),
          y: () => gsap.utils.random(-300, 300),
          rotation: () => gsap.utils.random(-180, 180)
        };
      default:
        return { opacity: 0, scale: 0, rotation: 0 };
    }
  };

  useEffect(() => {
    placeCards();
    if (!entranceAnimation) {
      mountedRef.current = true;
      maybeStartTicker();
      return;
    }
    const validEls = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!validEls.length) return;
    gsap.from(validEls, {
      ...getEntranceVars(entranceType),
      duration: entranceDuration,
      ease: entranceEase,
      stagger: entranceStagger,
      overwrite: 'auto',
      onComplete: () => {
        mountedRef.current = true;
        maybeStartTicker();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;
    if (autoPlay && !hoverPausedRef.current && !dragRef.current.active) {
      startTicker();
    } else {
      stopTicker();
    }
    return () => stopTicker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, reverse, duration]);

  useEffect(() => {
    if (!mountedRef.current) return;
    placeCards();
  }, [total, gap, maxRotation, scaleStep, opacityStep, cardWidth, cardHeight, direction]);

  const snapToNearest = () => {
    const target = Math.round(offsetRef.current);
    wheelTargetRef.current = target;
    gsap.to(offsetRef, {
      current: target,
      duration: 0.5,
      ease: 'power3.out',
      onUpdate: placeCards,
      onComplete: () => {
        offsetRef.current = ((offsetRef.current % totalRef.current) + totalRef.current) % totalRef.current;
        wheelTargetRef.current = offsetRef.current;
        placeCards();
        maybeStartTicker();
      }
    });
  };

  const onCardPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return;
    dragRef.current = {
      active: true,
      startX: 'touches' in e ? e.touches[0].clientX : e.clientX,
      startY: 'touches' in e ? e.touches[0].clientY : e.clientY,
      startOffset: offsetRef.current
    };
    gsap.killTweensOf(offsetRef);
    stopTicker();
    stopWheelTicker();
  };
  const onPointerMove = (e: MouseEvent | TouchEvent) => {
    if (!dragRef.current.active) return;
    const vertical = directionRef.current === 'vertical';
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    const delta = vertical ? clientY - dragRef.current.startY : clientX - dragRef.current.startX;
    offsetRef.current = dragRef.current.startOffset - delta / gapRef.current;
    wheelTargetRef.current = offsetRef.current;
    placeCards();
  };
  const onPointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    if (snap) {
      snapToNearest();
    } else {
      maybeStartTicker();
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopWheelTicker = () => {
    if (!wheelTickingRef.current || !wheelTickerFnRef.current) return;
    gsap.ticker.remove(wheelTickerFnRef.current);
    wheelTickerFnRef.current = null;
    wheelTickingRef.current = false;
  };
  const startWheelTicker = () => {
    if (wheelTickingRef.current) return;
    wheelTickingRef.current = true;
    wheelTickerFnRef.current = () => {
      const diff = wheelTargetRef.current - offsetRef.current;
      if (Math.abs(diff) < 0.001) {
        offsetRef.current = wheelTargetRef.current;
        placeCards();
        stopWheelTicker();
        if (snap) {
          if (wheelSnapTimerRef.current) clearTimeout(wheelSnapTimerRef.current);
          wheelSnapTimerRef.current = setTimeout(snapToNearest, 100);
        } else {
          maybeStartTicker();
        }
        return;
      }
      offsetRef.current += diff * wheelSmoothnessRef.current;
      placeCards();
    };
    gsap.ticker.add(wheelTickerFnRef.current);
  };

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !mouseWheel) return;
    const handler = (e: WheelEvent) => {
      if (!hoveredRef.current) return;
      e.preventDefault();
      gsap.killTweensOf(offsetRef);
      stopTicker();
      if (wheelSnapTimerRef.current) clearTimeout(wheelSnapTimerRef.current);
      if (!wheelTickingRef.current) wheelTargetRef.current = offsetRef.current;
      wheelTargetRef.current += e.deltaY * wheelSensitivityRef.current;
      startWheelTicker();
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => {
      el.removeEventListener('wheel', handler);
      stopWheelTicker();
      if (wheelSnapTimerRef.current) clearTimeout(wheelSnapTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseWheel, snap]);

  const handleStageMouseEnter = () => {
    if (!pauseOnHover || !autoPlay) return;
    hoverPausedRef.current = true;
    stopTicker();
  };
  const handleStageMouseLeave = () => {
    if (!pauseOnHover || !autoPlay) return;
    hoverPausedRef.current = false;
    if (!dragRef.current.active) startTicker();
  };

  const handleCardClick = (card: CardItem, index: number) => {
    const diff = wrapDiff(index, offsetRef.current, totalRef.current);
    if (Math.abs(diff) < 0.05) {
      onCardClick?.(card, index);
    } else {
      stopTicker();
      stopWheelTicker();
      const target = offsetRef.current + diff;
      gsap.to(offsetRef, {
        current: target,
        duration: 0.5,
        ease: 'power3.out',
        onUpdate: placeCards,
        onComplete: () => {
          offsetRef.current = ((offsetRef.current % totalRef.current) + totalRef.current) % totalRef.current;
          wheelTargetRef.current = offsetRef.current;
          placeCards();
          maybeStartTicker();
        }
      });
    }
  };

  const setCardFiltered = (index: number, value: boolean) =>
    setFilteredCards(prev => {
      const next = new Set(prev);
      value ? next.add(index) : next.delete(index);
      return next;
    });
  const handleCardMouseEnter = (index: number) => {
    hoveredRef.current = true;
    handleStageMouseEnter();
    if (filterOnHover) setCardFiltered(index, !defaultFiltered);
  };
  const handleCardMouseLeave = (index: number) => {
    hoveredRef.current = false;
    handleStageMouseLeave();
    if (filterOnHover) setCardFiltered(index, defaultFiltered);
  };

  const stageStyle: CSSProperties = isVertical
    ? { height: '100%', minHeight: cardHeight + 60, perspective }
    : { height: cardHeight + 60, perspective };

  return (
    <div
      ref={stageRef}
      className={`relative w-full flex items-center justify-center select-none ${className}`}
      style={stageStyle}
    >
      <div className="relative" style={{ width: cardWidth, height: cardHeight, transformStyle: 'preserve-3d' }}>
        {activeCards.map((card, i) => (
          <div
            key={card.id ?? i}
            ref={el => {(cardRefs.current[i] = el)}}
            className={`absolute top-0 left-0 rounded-2xl overflow-hidden bg-neutral-900 ${cardClassName}`}
            style={{ width: cardWidth, height: cardHeight, willChange: 'transform' }}
            onClick={() => handleCardClick(card, i)}
            onMouseDown={onCardPointerDown}
            onTouchStart={onCardPointerDown}
            onMouseEnter={() => handleCardMouseEnter(i)}
            onMouseLeave={() => handleCardMouseLeave(i)}
          >
            {card.image && (
              <img
                src={card.image}
                alt={card.label ?? ''}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
                style={{ filter: filteredCards.has(i) ? FILTER_STYLE : 'none' }}
              />
            )}
            {card.content && <div className="absolute inset-0 z-10 flex flex-col justify-end p-4">{card.content}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpectraSlider;
