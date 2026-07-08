// TS-CSS variant
import { useRef, useEffect, useMemo, useState, CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CardData {
  date?: string;
  title?: string;
  description?: string;
  tag?: string;
  image?: string;
}

const CARD_DATA: CardData[] = [
  {
    date: 'Published on July 18, 2025',
    title: 'Ribbons of warm light',
    description:
      'Tubular forms sweeping diagonally across a near-black frame, oranges and cool blues folding past one another.',
    tag: 'light',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70'
  },
  {
    date: 'Published 6 days ago',
    title: 'Molten colour swirls',
    description: 'Warm glass, reds and greens fold into one another with no hard edge anywhere in sight.',
    tag: 'colour',
    image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&q=70'
  },
  {
    date: 'Published 2 weeks ago',
    title: 'A fan of luminous blades',
    description: 'Opens from a single point, violet giving way to green as it spreads.',
    tag: 'form',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70'
  },
  {
    date: 'Published 3 weeks ago',
    title: 'Poured pigment pools',
    description: 'Little cells of gold shot through with veins of deep, restless blue.',
    tag: 'texture',
    image: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=400&q=70'
  },
  {
    date: 'Published a month ago',
    title: 'Petals unfurl',
    description: 'Hot pink and gold, a bright bloom caught exactly mid-open.',
    tag: 'bloom',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=70'
  },
  {
    date: 'Published 5 weeks ago',
    title: 'Marbled currents',
    description: 'Teal and violet drift beneath a pane of glass.',
    tag: 'study',
    image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400&q=70'
  },
  {
    date: 'Published 5 weeks ago',
    title: 'Marbled currents',
    description: 'Teal and violet drift beneath a pane of glass.',
    tag: 'study',
    image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400&q=70'
  },
  {
    date: 'Published on July 18, 2025',
    title: 'Ribbons of warm light',
    description:
      'Tubular forms sweeping diagonally across a near-black frame, oranges and cool blues folding past one another.',
    tag: 'light',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70'
  },
  {
    date: 'Published 6 days ago',
    title: 'Molten colour swirls',
    description: 'Warm glass, reds and greens fold into one another with no hard edge anywhere in sight.',
    tag: 'colour',
    image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&q=70'
  },
  {
    date: 'Published 2 weeks ago',
    title: 'A fan of luminous blades',
    description: 'Opens from a single point, violet giving way to green as it spreads.',
    tag: 'form',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70'
  }
];

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const useBreakpoint = (): Breakpoint => {
  const [bp, setBp] = useState<Breakpoint>('desktop');
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp(w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return bp;
};

interface ScrollStackProps {
  count?: number;
  cards?: CardData[];
  itemDistance?: number;
  itemStackDistance?: number;
  stackPosition?: number;
  baseScale?: number;
  itemScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  corner?: number;
  shadow?: number;
  imageRatio?: number;
  cardMaxWidth?: number;
}

function ScrollStack(props: ScrollStackProps) {
  const {
    count = 6,
    cards,
    itemDistance = 90,
    itemStackDistance = 26,
    stackPosition = 18,
    baseScale = 0.86,
    itemScale = 0.03,
    rotationAmount = 0,
    blurAmount = 0,
    corner = 32,
    shadow = 1,
    imageRatio = 1,
    cardMaxWidth = 780
  } = props;

  const source = cards && cards.length ? cards : CARD_DATA;
  const N = Math.max(2, Math.min(Math.round(count), source.length || Math.round(count)));
  const bp = useBreakpoint();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const rDistance = bp === 'mobile' ? itemDistance * 0.55 : bp === 'tablet' ? itemDistance * 0.8 : itemDistance;
  const rStackDistance = bp === 'mobile' ? itemStackDistance * 0.6 : itemStackDistance;
  const rPadding = bp === 'mobile' ? 16 : bp === 'tablet' ? 22 : 28;
  const imgSize = bp === 'mobile' ? 0 : bp === 'tablet' ? 150 : 210;
  const dateSize = bp === 'mobile' ? 11 : 13;
  const titleSize = bp === 'mobile' ? 14 : bp === 'tablet' ? 15 : 17;
  const descSize = bp === 'mobile' ? 12 : 13;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const triggers: ScrollTrigger[] = [];
    const activeCards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    activeCards.forEach((card, i) => {
      card.style.marginBottom = i < activeCards.length - 1 ? `${rDistance}px` : '0px';
      card.style.transformOrigin = 'top center';

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          scroller,
          start: `top ${stackPosition}%+=${rStackDistance * i}`,
          endTrigger: sentinelRef.current ?? undefined,
          end: 'center center',
          scrub: true,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1
        }
      });
      tl.to(card, {
        scale: baseScale + i * itemScale,
        rotation: i * rotationAmount,
        filter: blurAmount ? `blur(${i * blurAmount}px)` : 'none',
        ease: 'none'
      });
      triggers.push(tl.scrollTrigger!);
    });

    const refresh = () => ScrollTrigger.refresh();
    const ro = new ResizeObserver(refresh);
    ro.observe(scroller);
    window.addEventListener('orientationchange', refresh);
    requestAnimationFrame(refresh);

    return () => {
      triggers.forEach(t => t.kill());
      ro.disconnect();
      window.removeEventListener('orientationchange', refresh);
    };
  }, [N, rDistance, rStackDistance, stackPosition, baseScale, itemScale, rotationAmount, blurAmount, bp, source]);

  const items = useMemo(() => Array.from({ length: N }, (_, i) => source[i % source.length]), [N, source]);

  const style = {
    scroller: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      overflowX: 'visible',
      overscrollBehavior: 'contain'
    } as CSSProperties,
    inner: {
      paddingTop: bp === 'mobile' ? '8vh' : bp === 'tablet' ? '12vh' : '14vh',
      paddingBottom: bp === 'mobile' ? '35vh' : bp === 'tablet' ? '50vh' : '60vh',
      paddingLeft: bp === 'mobile' ? '0.75rem' : '1.5rem',
      paddingRight: bp === 'mobile' ? '0.75rem' : '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    } as CSSProperties,
    card: (i: number): CSSProperties => ({
      width: '100%',
      maxWidth: cardMaxWidth,
      borderRadius: bp === 'mobile' ? Math.min(corner, 20) : corner,
      boxShadow: `0 ${10 * shadow}px ${40 * shadow}px rgba(0,0,0,${0.12 * shadow})`,
      zIndex: i + 1,
      padding: rPadding,
      boxSizing: 'border-box',
      position: 'relative',
      backgroundColor: '#ffffff',
      willChange: 'transform'
    }),
    row: {
      display: 'flex',
      gap: bp === 'mobile' ? '1rem' : bp === 'tablet' ? '1.25rem' : '1.75rem',
      alignItems: 'stretch'
    } as CSSProperties,
    img: {
      flexShrink: 0,
      borderRadius: bp === 'mobile' ? '0.75rem' : '1rem',
      overflow: 'hidden',
      width: imgSize,
      height: imgSize * imageRatio
    } as CSSProperties,
    imgEl: { width: '100%', height: '100%', objectFit: 'cover' } as CSSProperties,
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      paddingTop: '0.25rem',
      paddingBottom: '0.25rem'
    } as CSSProperties,
    date: { fontSize: dateSize, color: '#9ca3af' } as CSSProperties,
    title: {
      fontSize: titleSize,
      color: '#111827',
      marginTop: '0.5rem',
      lineHeight: 1.4,
      fontWeight: 500
    } as CSSProperties,
    desc: { fontSize: descSize, color: '#6b7280', marginTop: '0.25rem', lineHeight: 1.4 } as CSSProperties,
    spacer: { flex: 1 } as CSSProperties,
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: bp === 'mobile' ? '0.75rem' : '1rem'
    } as CSSProperties,
    tag: {
      display: 'inline-block',
      padding: bp === 'mobile' ? '0.25rem 0.625rem' : '0.375rem 0.75rem',
      borderRadius: '9999px',
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
      fontSize: bp === 'mobile' ? 11 : 13
    } as CSSProperties,
    btn: {
      width: bp === 'mobile' ? '2rem' : '2.5rem',
      height: bp === 'mobile' ? '2rem' : '2.5rem',
      borderRadius: '9999px',
      backgroundColor: '#111827',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: bp === 'mobile' ? '1rem' : '1.125rem',
      lineHeight: 1,
      border: 'none',
      cursor: 'pointer'
    } as CSSProperties,
    sentinel: { width: '100%', height: '1px' } as CSSProperties
  };

  return (
    <div ref={scrollerRef} className="stack-scroller" style={style.scroller}>
      <div style={style.inner}>
        {items.map((card, i) => (
          <div
            key={i}
            ref={el => {
              cardRefs.current[i] = el;
            }}
            style={style.card(i)}
          >
            <div style={style.row}>
              {imgSize > 0 && card.image && (
                <div style={style.img}>
                  <img src={card.image} alt={card.title || card.tag || ''} style={style.imgEl} />
                </div>
              )}
              <div style={style.content}>
                <div style={style.date}>{card.date}</div>
                {card.title && <div style={style.title}>{card.title}</div>}
                {card.description && <p style={style.desc}>{card.description}</p>}
                <div style={style.spacer} />
                <div style={style.footer}>
                  <span style={style.tag}>{card.tag}</span>
                  <button style={style.btn}>+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={sentinelRef} style={style.sentinel} />
      </div>
    </div>
  );
}

export default ScrollStack;
