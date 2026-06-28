// TS-CSS variant
import {
  useEffect,
  useRef,
  useState,
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  ReactNode
} from 'react';
import gsap from 'gsap';

interface CardItem {
  id?: string | number;
  image?: string;
  label?: string;
  content?: ReactNode;
}

type EntranceType = 'pop' | 'fade' | 'bottom' | 'top' | 'left' | 'right' | 'flip' | 'scatter' | 'spin' | 'zoomBlur';

interface RotatingCardsProps {
  cards?: CardItem[];
  numberOfCards?: number;
  radius?: number;
  duration?: number;
  cardWidth?: number;
  cardHeight?: number;
  height?: string | number;
  pauseOnHover?: boolean;
  reverse?: boolean;
  draggable?: boolean;
  autoPlay?: boolean;
  onCardClick?: (card: CardItem, index: number) => void;
  mouseWheel?: boolean;
  className?: string;
  cardClassName?: string;
  initialRotation?: number;
  filterOnHover?: boolean;
  defaultFiltered?: boolean;
  entranceAnimation?: boolean;
  entranceDuration?: number;
  entranceStagger?: number;
  entranceEase?: string;
  entranceType?: EntranceType;
}

const FALLBACK_CARDS: CardItem[] = [
  { id: 1, image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=70' },
  { id: 2, image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&q=70' },
  { id: 3, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70' },
  { id: 4, image: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=400&q=70' },
  { id: 5, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=70' },
  { id: 6, image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400&q=70' },
  { id: 7, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70' },
  { id: 8, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70' },
  { id: 9, image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=70' },
  { id: 10, image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=70' }
];

const FILTER_STYLE = 'grayscale(100%) brightness(0.52) contrast(1.18)';

export function RotatingCards({
  cards = [],
  numberOfCards = 10,
  radius = 480,
  duration = 22,
  cardWidth = 165,
  cardHeight = 154,
  height,
  pauseOnHover = false,
  reverse = false,
  draggable = true,
  autoPlay = true,
  onCardClick,
  mouseWheel = true,
  className = '',
  cardClassName = '',
  initialRotation = 0,
  filterOnHover = true,
  defaultFiltered = true,
  entranceAnimation = true,
  entranceDuration = 0.9,
  entranceStagger = 0.07,
  entranceEase = 'back.out(1.4)',
  entranceType = 'spin'
}: RotatingCardsProps) {
  const sourceCards = cards.length > 0 ? cards : FALLBACK_CARDS;
  const activeCards = sourceCards.slice(0, Math.min(Math.max(numberOfCards, 3), 10));
  const total = activeCards.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(initialRotation / 360);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const tickingRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, startProg: 0 });
  const hoverPausedRef = useRef(false);
  const [paused] = useState(!autoPlay);

  const [filteredCards, setFilteredCards] = useState<Set<number>>(() => {
    if (!defaultFiltered) return new Set();
    return new Set(activeCards.map((_, i) => i));
  });

  const totalRef = useRef(total);
  const radiusRef = useRef(radius);
  const reverseRef = useRef(reverse);
  const durationRef = useRef(duration);
  const autoPlayRef = useRef(autoPlay);
  const pausedRef = useRef(paused);

  totalRef.current = total;
  radiusRef.current = radius;
  reverseRef.current = reverse;
  durationRef.current = duration;
  autoPlayRef.current = autoPlay;
  pausedRef.current = paused;

  const placeCards = () => {
    if (!totalRef.current) return;
    const angleStep = 360 / totalRef.current;
    const dir = reverseRef.current ? -1 : 1;
    const orbitDeg = progressRef.current * 360 * dir;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const deg = orbitDeg + i * angleStep;
      const rad = (deg * Math.PI) / 180;
      const x = Math.sin(rad) * radiusRef.current;
      const y = -Math.cos(rad) * radiusRef.current;

      const depth = (Math.cos(rad) + 1) / 2;
      const scale = 0.38 + depth * 0.72;
      const lean = Math.sin(rad) * 40;
      const opacity = depth < 0.12 ? 0 : 0.28 + depth * 0.72;

      gsap.set(el, {
        x,
        y,
        scale,
        rotation: lean,
        zIndex: Math.round(depth * 100),
        opacity,
        transformOrigin: 'center center'
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
    tickerFnRef.current = () => {
      progressRef.current += 1 / (durationRef.current * 60);
      placeCards();
    };
    gsap.ticker.add(tickerFnRef.current);
    tickingRef.current = true;
  };

  const mountedRef = useRef(false);

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
      case 'pop':
      default:
        return { opacity: 0, scale: 0, rotation: 0 };
    }
  };

  useEffect(() => {
    placeCards();

    if (!entranceAnimation) {
      mountedRef.current = true;
      if (autoPlayRef.current && !pausedRef.current && !hoverPausedRef.current) {
        startTicker();
      }
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
        if (autoPlayRef.current && !pausedRef.current && !hoverPausedRef.current) {
          startTicker();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;
    if (autoPlay && !paused && !hoverPausedRef.current) {
      startTicker();
    } else {
      stopTicker();
    }
    return () => stopTicker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, paused]);

  useEffect(() => {
    if (!mountedRef.current) return;
    placeCards();
  }, [radius, reverse, cardWidth, cardHeight, total]);

  useEffect(() => {
    if (!mountedRef.current) return;
    progressRef.current = initialRotation / 360;
    placeCards();
  }, [initialRotation]);

  const onPointerDown = (e: ReactMouseEvent | ReactTouchEvent) => {
    if (!draggable) return;
    const isTouch = 'touches' in e;
    dragRef.current = {
      active: true,
      startX: isTouch ? e.touches[0].clientX : (e as ReactMouseEvent).clientX,
      startProg: progressRef.current
    };
    stopTicker();
  };

  const onPointerMove = (e: MouseEvent | TouchEvent) => {
    if (!dragRef.current.active) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const dx = clientX - dragRef.current.startX;
    progressRef.current = dragRef.current.startProg + dx * 0.0007;
    placeCards();
  };

  const onPointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    if (autoPlayRef.current && !pausedRef.current && !hoverPausedRef.current) startTicker();
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

  const handleMouseEnter = () => {
    if (!pauseOnHover || !autoPlay) return;
    hoverPausedRef.current = true;
    stopTicker();
  };

  const handleMouseLeave = () => {
    if (!pauseOnHover || !autoPlay) return;
    hoverPausedRef.current = false;
    if (!pausedRef.current && !dragRef.current.active) startTicker();
  };

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !mouseWheel) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      progressRef.current += e.deltaY * 0.00035;
      placeCards();
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [mouseWheel]);

  const handleCardClick = (card: CardItem, index: number) => {
    onCardClick?.(card, index);
  };

  const setCardFiltered = (index: number, value: boolean) => {
    setFilteredCards(prev => {
      const next = new Set(prev);
      if (value) {
        next.add(index);
      } else {
        next.delete(index);
      }
      return next;
    });
  };

  const handleCardMouseEnter = (index: number) => {
    handleMouseEnter();
    if (filterOnHover) setCardFiltered(index, !defaultFiltered);
  };

  const handleCardMouseLeave = (index: number) => {
    handleMouseLeave();
    if (filterOnHover) setCardFiltered(index, defaultFiltered);
  };

  const style = {
    stage: {
      position: 'relative' as const,
      overflow: 'hidden',
      userSelect: 'none' as const,
      height,
      cursor: draggable ? 'grab' : 'default'
    } as CSSProperties,
    orbit: {
      position: 'absolute' as const,
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: -40
    } as CSSProperties,
    card: {
      position: 'absolute' as const,
      borderRadius: '1rem',
      overflow: 'hidden',
      backgroundColor: '#111',
      width: cardWidth,
      height: cardHeight,
      marginLeft: -cardWidth / 2,
      marginTop: -cardHeight / 2,
      willChange: 'transform',
      cursor: 'pointer'
    } as CSSProperties,
    image: {
      position: 'absolute' as const,
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      pointerEvents: 'none' as const
    },
    overlay: {
      position: 'absolute' as const,
      inset: 0,
      background: 'radial-gradient(ellipse at 65% 35%, transparent 25%, rgba(0,0,0,0.6) 100%)'
    } as CSSProperties,
    content: {
      position: 'absolute' as const,
      inset: 0,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'flex-end',
      padding: '0.75rem'
    } as CSSProperties
  };

  const classes = `${className}`;

  return (
    <div
      ref={stageRef}
      style={style.stage}
      className={classes}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
    >
      <div ref={orbitRef} style={style.orbit}>
        {activeCards.map((card, i) => (
          <div
            key={card.id ?? i}
            ref={el => {
              cardRefs.current[i] = el;
            }}
            className={cardClassName}
            style={style.card}
            onClick={() => handleCardClick(card, i)}
            onMouseEnter={() => handleCardMouseEnter(i)}
            onMouseLeave={() => handleCardMouseLeave(i)}
          >
            {card.image && (
              <img
                src={card.image}
                alt={card.label ?? ''}
                style={{
                  ...style.image,
                  filter: filteredCards.has(i) ? FILTER_STYLE : 'none'
                }}
              />
            )}
            <div style={style.overlay} />
            <div style={style.content}>{card.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RotatingCards;
