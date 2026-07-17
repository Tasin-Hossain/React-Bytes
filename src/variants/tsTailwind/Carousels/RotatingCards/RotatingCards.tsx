// TS-TW variant (uses react-router Link)
import { useEffect, useRef, useState, CSSProperties } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router';

type Direction = 'top' | 'bottom' | 'left' | 'right';
type EntranceType = 'pop' | 'fade' | 'bottom' | 'top' | 'left' | 'right' | 'flip' | 'scatter' | 'spin' | 'zoomBlur';

interface CardItem {
  id?: string | number;
  image?: string;
  src?: string;
  video?: string;
  poster?: string;
  label?: string;
  title?: string;
  to?: string;
  type?: 'video' | 'image';
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
const VIDEO_EXT_RE = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;
const isVideoSrc = (src: string | undefined): boolean => !!src && VIDEO_EXT_RE.test(src);

const getCardOffset = (rad: number, radius: number, dir: Direction) => {
  switch (dir) {
    case 'top':
      return { x: Math.sin(rad) * radius, y: Math.cos(rad) * radius };
    case 'left':
      return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
    case 'right':
      return { x: -Math.cos(rad) * radius, y: Math.sin(rad) * radius };
    case 'bottom':
    default:
      return { x: Math.sin(rad) * radius, y: -Math.cos(rad) * radius };
  }
};

const getLeanSign = (dir: Direction) => (dir === 'top' || dir === 'right' ? -1 : 1);

const getOrbitPosition = (dir: Direction) => {
  switch (dir) {
    case 'top':
      return { className: 'absolute left-1/2 -translate-x-1/2', style: { top: -40 } as CSSProperties };
    case 'left':
      return { className: 'absolute top-1/2 -translate-y-1/2', style: { left: -40 } as CSSProperties };
    case 'right':
      return { className: 'absolute top-1/2 -translate-y-1/2', style: { right: -40 } as CSSProperties };
    case 'bottom':
    default:
      return { className: 'absolute left-1/2 -translate-x-1/2', style: { bottom: -40 } as CSSProperties };
  }
};

interface RotatingCardsProps {
  cards?: CardItem[];
  numberOfCards?: number;
  radius?: number;
  duration?: number;
  cardWidth?: number;
  cardHeight?: number;
  height?: string | number;
  direction?: Direction;
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

export function RotatingCards({
  cards = [],
  numberOfCards = 10,
  radius = 480,
  duration = 22,
  cardWidth = 165,
  cardHeight = 154,
  height,
  direction = 'right',
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
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
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

  const totalRef = useRef(total),
    radiusRef = useRef(radius),
    reverseRef = useRef(reverse);
  const durationRef = useRef(duration),
    autoPlayRef = useRef(autoPlay),
    pausedRef = useRef(paused);
  const directionRef = useRef(direction);

  totalRef.current = total;
  radiusRef.current = radius;
  reverseRef.current = reverse;
  durationRef.current = duration;
  autoPlayRef.current = autoPlay;
  pausedRef.current = paused;
  directionRef.current = direction;

  const placeCards = () => {
    if (!totalRef.current) return;
    const angleStep = 360 / totalRef.current;
    const dir = reverseRef.current ? -1 : 1;
    const orbitDeg = progressRef.current * 360 * dir;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const deg = orbitDeg + i * angleStep,
        rad = (deg * Math.PI) / 180;
      const { x, y } = getCardOffset(rad, radiusRef.current, directionRef.current);
      const depth = (Math.cos(rad) + 1) / 2,
        scale = 0.38 + depth * 0.72;
      const lean = Math.sin(rad) * 40 * getLeanSign(directionRef.current);
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
      default:
        return { opacity: 0, scale: 0, rotation: 0 };
    }
  };

  useEffect(() => {
    placeCards();
    if (!entranceAnimation) {
      mountedRef.current = true;
      if (autoPlayRef.current && !pausedRef.current && !hoverPausedRef.current) startTicker();
      return;
    }
    const validEls = cardRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (!validEls.length) return;
    gsap.from(validEls, {
      ...getEntranceVars(entranceType),
      duration: entranceDuration,
      ease: entranceEase,
      stagger: entranceStagger,
      overwrite: 'auto',
      onComplete: () => {
        mountedRef.current = true;
        if (autoPlayRef.current && !pausedRef.current && !hoverPausedRef.current) startTicker();
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
  }, [radius, reverse, direction, cardWidth, cardHeight, total]);
  useEffect(() => {
    if (!mountedRef.current) return;
    progressRef.current = initialRotation / 360;
    placeCards();
  }, [initialRotation]);

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return;
    dragRef.current = {
      active: true,
      startX: 'touches' in e ? e.touches[0].clientX : e.clientX,
      startProg: progressRef.current
    };
    stopTicker();
  };
  const onPointerMove = (e: MouseEvent | TouchEvent) => {
    if (!dragRef.current.active) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    progressRef.current = dragRef.current.startProg + (clientX - dragRef.current.startX) * 0.0007;
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

  const setCardFiltered = (index: number, value: boolean) =>
    setFilteredCards(prev => {
      const next = new Set(prev);
      value ? next.add(index) : next.delete(index);
      return next;
    });
  const handleCardMouseEnter = (index: number) => {
    handleMouseEnter();
    if (filterOnHover) setCardFiltered(index, !defaultFiltered);
  };
  const handleCardMouseLeave = (index: number) => {
    handleMouseLeave();
    if (filterOnHover) setCardFiltered(index, defaultFiltered);
  };

  const orbitPosition = getOrbitPosition(direction);

  return (
    <div
      ref={stageRef}
      className={`relative overflow-hidden select-none ${className}`}
      style={{ height, cursor: draggable ? 'grab' : 'default' }}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
    >
      <div ref={orbitRef} className={orbitPosition.className} style={orbitPosition.style}>
        {activeCards.map((card, i) => {
          const mediaSrc = card.video ?? card.image ?? card.src;
          const useVideo = card.type === 'video' || !!card.video || isVideoSrc(mediaSrc);
          return (
            <Link
              to={card.to ?? '/'}
              key={card.id ?? i}
              ref={el => {
                cardRefs.current[i] = el as HTMLAnchorElement | null;
              }}
              className={`absolute rounded-2xl overflow-hidden bg-[#111] ${cardClassName}`}
              style={{
                width: cardWidth,
                height: cardHeight,
                marginLeft: -cardWidth / 2,
                marginTop: -cardHeight / 2,
                willChange: 'transform',
                cursor: 'pointer'
              }}
              onClick={() => onCardClick?.(card, i)}
              onMouseEnter={() => handleCardMouseEnter(i)}
              onMouseLeave={() => handleCardMouseLeave(i)}
            >
              {mediaSrc &&
                (useVideo ? (
                  <video
                    src={mediaSrc}
                    poster={card.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ filter: filteredCards.has(i) ? FILTER_STYLE : 'none' }}
                  />
                ) : (
                  <img
                    src={mediaSrc}
                    alt={card.label ?? ''}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ filter: filteredCards.has(i) ? FILTER_STYLE : 'none' }}
                  />
                ))}
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at 65% 35%, transparent 25%, rgba(0,0,0,0.6) 100%)' }}
              />
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-3">
                {card.title && <p className="text-sm">{card.title}</p>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default RotatingCards;
