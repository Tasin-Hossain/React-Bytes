// JS-CSS variant
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

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

const VIDEO_EXT_RE = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;
const isVideoSrc = src => !!src && VIDEO_EXT_RE.test(src);

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

const getLeanSign = dir => (dir === 'top' || dir === 'right' ? -1 : 1);

const getOrbitStyle = dir => {
  switch (dir) {
    case 'top':
      return { position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: -40 };
    case 'left':
      return { position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: -40 };
    case 'right':
      return { position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: -40 };
    case 'bottom':
    default:
      return { position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: -40 };
  }
};

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

  useEffect(() => {
    totalRef.current = total;
    radiusRef.current = radius;
    reverseRef.current = reverse;
    durationRef.current = duration;
    autoPlayRef.current = autoPlay;
    pausedRef.current = paused;
    directionRef.current = direction;
  }, [total, radius, reverse, duration, autoPlay, paused, direction]);

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
      if (autoPlayRef.current && !pausedRef.current && !hoverPausedRef.current) startTicker();
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
    const handler = e => {
      e.preventDefault();
      progressRef.current += e.deltaY * 0.00035;
      placeCards();
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [mouseWheel]);

  const setCardFiltered = (index, value) => {
    setFilteredCards(prev => {
      const next = new Set(prev);
      value ? next.add(index) : next.delete(index);
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

  const style = {
    stage: {
      position: 'relative',
      overflow: 'hidden',
      userSelect: 'none',
      height,
      cursor: draggable ? 'grab' : 'default'
    },
    card: {
      position: 'absolute',
      borderRadius: '1rem',
      overflow: 'hidden',
      backgroundColor: '#111',
      width: cardWidth,
      height: cardHeight,
      marginLeft: -cardWidth / 2,
      marginTop: -cardHeight / 2,
      willChange: 'transform',
      cursor: 'pointer'
    },
    media: f => ({
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      pointerEvents: 'none',
      filter: f
    }),
    overlay: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(ellipse at 65% 35%, transparent 25%, rgba(0,0,0,0.6) 100%)'
    },
    content: {
      position: 'absolute',
      inset: 0,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '0.75rem'
    },
    title: { fontSize: '0.875rem', color: '#fff', margin: 0 }
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
      <div ref={orbitRef} style={getOrbitStyle(direction)}>
        {activeCards.map((card, i) => {
          const mediaSrc = card.video ?? card.image ?? card.src;
          const useVideo = card.type === 'video' || !!card.video || isVideoSrc(mediaSrc);
          const filterVal = filteredCards.has(i) ? FILTER_STYLE : 'none';

          return (
            <a
              href={card.to ?? '#'}
              key={card.id ?? i}
              ref={el => (cardRefs.current[i] = el)}
              className={cardClassName}
              style={style.card}
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
                    style={style.media(filterVal)}
                  />
                ) : (
                  <img src={mediaSrc} alt={card.label ?? ''} style={style.media(filterVal)} />
                ))}
              <div style={style.overlay} />
              <div style={style.content}>{card.title && <p style={style.title}>{card.title}</p>}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default RotatingCards;
