import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router';

const FALLBACK_CARDS = [
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

// direction determines which edge the orbit hub is anchored to, and the arc
// therefore opens away from that edge (bottom -> opens up, top -> opens down,
// left -> opens right, right -> opens left).
const getCardOffset = (rad, radius, dir) => {
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

// top/right mirror the depth axis (cos sign) relative to bottom/left, so the
// card's own tilt needs its sign flipped too, otherwise it leans backwards.
const getLeanSign = dir => (dir === 'top' || dir === 'right' ? -1 : 1);

const getOrbitPosition = dir => {
  switch (dir) {
    case 'top':
      return { className: 'absolute left-1/2 -translate-x-1/2', style: { top: -40 } };
    case 'left':
      return { className: 'absolute top-1/2 -translate-y-1/2', style: { left: -40 } };
    case 'right':
      return { className: 'absolute top-1/2 -translate-y-1/2', style: { right: -40 } };
    case 'bottom':
    default:
      return { className: 'absolute left-1/2 -translate-x-1/2', style: { bottom: -40 } };
  }
};

// Detect video sources by extension so plain `card.image = "clip.mp4"` also
// works without needing an explicit `type` field. GIFs need no special
// handling — <img> already animates them natively.
const VIDEO_EXT_RE = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;
const isVideoSrc = src => !!src && VIDEO_EXT_RE.test(src);

export function RotatingCards({
  cards = [],
  numberOfCards = 10,
  radius = 480,
  duration = 22,
  cardWidth = 165,
  cardHeight = 154,
  height,
  direction = 'right', // top | bottom | left | right
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
  entranceType = 'spin' // pop | fade | bottom | top | left | right | flip | scatter | spin | zoomBlur
}) {
  const sourceCards = cards.length > 0 ? cards : FALLBACK_CARDS;
  const activeCards = sourceCards.slice(0, Math.min(Math.max(numberOfCards, 3), 10));
  const total = activeCards.length;

  const stageRef = useRef(null);
  const orbitRef = useRef(null);
  const cardRefs = useRef([]);
  const progressRef = useRef(initialRotation / 360);
  const tickerFnRef = useRef(null);
  const tickingRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, startProg: 0 });
  const hoverPausedRef = useRef(false);
  const [paused] = useState(!autoPlay);

  const [filteredCards, setFilteredCards] = useState(() => {
    if (!defaultFiltered) return new Set();
    return new Set(activeCards.map((_, i) => i));
  });

  const totalRef = useRef(total);
  const radiusRef = useRef(radius);
  const reverseRef = useRef(reverse);
  const durationRef = useRef(duration);
  const autoPlayRef = useRef(autoPlay);
  const pausedRef = useRef(paused);
  const directionRef = useRef(direction);

  // eslint-disable-next-line react-hooks/refs
  totalRef.current = total;
  // eslint-disable-next-line react-hooks/refs
  radiusRef.current = radius;
  // eslint-disable-next-line react-hooks/refs
  reverseRef.current = reverse;
  // eslint-disable-next-line react-hooks/refs
  durationRef.current = duration;
  // eslint-disable-next-line react-hooks/refs
  autoPlayRef.current = autoPlay;
  // eslint-disable-next-line react-hooks/refs
  pausedRef.current = paused;
  // eslint-disable-next-line react-hooks/refs
  directionRef.current = direction;

  const placeCards = () => {
    if (!totalRef.current) return;
    const angleStep = 360 / totalRef.current;
    const dir = reverseRef.current ? -1 : 1;
    const orbitDeg = progressRef.current * 360 * dir;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const deg = orbitDeg + i * angleStep;
      const rad = (deg * Math.PI) / 180;
      const { x, y } = getCardOffset(rad, radiusRef.current, directionRef.current);

      const depth = (Math.cos(rad) + 1) / 2;
      const scale = 0.38 + depth * 0.72;
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

  const getEntranceVars = type => {
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

    const validEls = cardRefs.current.filter(Boolean);
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

  // radius / reverse / direction / card dimensions change
  useEffect(() => {
    if (!mountedRef.current) return;
    placeCards();
  }, [radius, reverse, direction, cardWidth, cardHeight, total]);

  // initialRotation change
  useEffect(() => {
    if (!mountedRef.current) return;
    progressRef.current = initialRotation / 360;
    placeCards();
  }, [initialRotation]);

  // drag
  const onPointerDown = e => {
    if (!draggable) return;
    dragRef.current = {
      active: true,
      startX: e.touches ? e.touches[0].clientX : e.clientX,
      startProg: progressRef.current
    };
    stopTicker();
  };

  const onPointerMove = e => {
    if (!dragRef.current.active) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
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

  // hover pause
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

  // mouse wheel
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !mouseWheel) return;
    const handler = e => {
      e.preventDefault();
      progressRef.current += e.deltaY * 0.00035;
      placeCards();
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [mouseWheel]);

  const handleCardClick = (card, index) => {
    onCardClick?.(card, index);
  };

  const setCardFiltered = (index, value) => {
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

  const handleCardMouseEnter = index => {
    handleMouseEnter();
    if (filterOnHover) setCardFiltered(index, !defaultFiltered);
  };

  const handleCardMouseLeave = index => {
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
          // Explicit `card.type === 'video'` or `card.video` always wins;
          // otherwise we sniff the extension on `card.image`/`card.src`.
          const mediaSrc = card.video ?? card.image ?? card.src;
          const useVideo = card.type === 'video' || !!card.video || isVideoSrc(mediaSrc);

          return (
            <Link
              to={card.to}
              key={card.id ?? i}
              ref={el => (cardRefs.current[i] = el)}
              className={`absolute rounded-2xl overflow-hidden bg-[#111] ${cardClassName}`}
              style={{
                width: cardWidth,
                height: cardHeight,
                marginLeft: -cardWidth / 2,
                marginTop: -cardHeight / 2,
                willChange: 'transform',
                cursor: 'pointer'
              }}
              onClick={() => handleCardClick(card, i)}
              onMouseEnter={() => handleCardMouseEnter(i)}
              onMouseLeave={() => handleCardMouseLeave(i)}
            >
              {mediaSrc && (useVideo ? (
                <video
                  src={mediaSrc}
                  poster={card.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{
                    filter: filteredCards.has(i) ? FILTER_STYLE : 'none'
                  }}
                />
              ) : (
                <img
                  src={mediaSrc}
                  alt={card.label ?? ''}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{
                    filter: filteredCards.has(i) ? FILTER_STYLE : 'none'
                  }}
                />
              ))}
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at 65% 35%, transparent 25%, rgba(0,0,0,0.6) 100%)' }}
              />
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-3">
                {card.title ? <p className="text-sm">{card.title}</p> : ''}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default RotatingCards;