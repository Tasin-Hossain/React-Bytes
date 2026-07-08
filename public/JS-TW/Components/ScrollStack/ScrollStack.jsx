// JS-TW variant (identical to uploaded source)
import { useRef, useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CARD_DATA = [
  { date: 'Published on July 18, 2025', title: 'Ribbons of warm light', description: 'Tubular forms sweeping diagonally across a near-black frame, oranges and cool blues folding past one another.', tag: 'light', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70' },
  { date: 'Published 6 days ago', title: 'Molten colour swirls', description: 'Warm glass, reds and greens fold into one another with no hard edge anywhere in sight.', tag: 'colour', image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&q=70' },
  { date: 'Published 2 weeks ago', title: 'A fan of luminous blades', description: 'Opens from a single point, violet giving way to green as it spreads.', tag: 'form', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70' },
  { date: 'Published 3 weeks ago', title: 'Poured pigment pools', description: 'Little cells of gold shot through with veins of deep, restless blue.', tag: 'texture', image: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=400&q=70' },
  { date: 'Published a month ago', title: 'Petals unfurl', description: 'Hot pink and gold, a bright bloom caught exactly mid-open.', tag: 'bloom', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=70' },
  { date: 'Published 5 weeks ago', title: 'Marbled currents', description: 'Teal and violet drift beneath a pane of glass.', tag: 'study', image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400&q=70' },
  { date: 'Published 5 weeks ago', title: 'Marbled currents', description: 'Teal and violet drift beneath a pane of glass.', tag: 'study', image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400&q=70' },
  { date: 'Published on July 18, 2025', title: 'Ribbons of warm light', description: 'Tubular forms sweeping diagonally across a near-black frame, oranges and cool blues folding past one another.', tag: 'light', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70' },
  { date: 'Published 6 days ago', title: 'Molten colour swirls', description: 'Warm glass, reds and greens fold into one another with no hard edge anywhere in sight.', tag: 'colour', image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&q=70' },
  { date: 'Published 2 weeks ago', title: 'A fan of luminous blades', description: 'Opens from a single point, violet giving way to green as it spreads.', tag: 'form', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70' },
];

const useBreakpoint = () => {
  const [bp, setBp] = useState('desktop');
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

function ScrollStack(props) {
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
  const scrollerRef = useRef(null);
  const cardRefs = useRef([]);
  const sentinelRef = useRef(null);

  const rDistance      = bp === 'mobile' ? itemDistance * 0.55 : bp === 'tablet' ? itemDistance * 0.8 : itemDistance;
  const rStackDistance = bp === 'mobile' ? itemStackDistance * 0.6 : itemStackDistance;
  const rPadding       = bp === 'mobile' ? 16 : bp === 'tablet' ? 22 : 28;
  const imgSize        = bp === 'mobile' ? 0 : bp === 'tablet' ? 150 : 210;
  const dateSize       = bp === 'mobile' ? 11 : 13;
  const titleSize      = bp === 'mobile' ? 14 : bp === 'tablet' ? 15 : 17;
  const descSize       = bp === 'mobile' ? 12 : 13;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const triggers = [];
    const activeCards = cardRefs.current.filter(Boolean);

    activeCards.forEach((card, i) => {
      card.style.marginBottom = i < activeCards.length - 1 ? `${rDistance}px` : '0px';
      card.style.transformOrigin = 'top center';

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          scroller,
          start: `top ${stackPosition}%+=${rStackDistance * i}`,
          endTrigger: sentinelRef.current,
          end: 'center center',
          scrub: true,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        },
      });
      tl.to(card, {
        scale: baseScale + i * itemScale,
        rotation: i * rotationAmount,
        filter: blurAmount ? `blur(${i * blurAmount}px)` : 'none',
        ease: 'none',
      });
      triggers.push(tl.scrollTrigger);
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

  return (
    <div
      ref={scrollerRef}
      className="stack-scroller relative w-full h-full overflow-y-auto overflow-x-visible"
      style={{ overscrollBehavior: 'contain' }}
    >
      <div className="pt-[8vh] sm:pt-[12vh] md:pt-[14vh] px-3 sm:px-6 pb-[35vh] sm:pb-[50vh] md:pb-[60vh] flex flex-col items-center">
        {items.map((card, i) => (
          <div
            key={i}
            ref={el => (cardRefs.current[i] = el)}
            className="relative bg-white will-change-transform"
            style={{
              width: '100%',
              maxWidth: cardMaxWidth,
              borderRadius: bp === 'mobile' ? Math.min(corner, 20) : corner,
              boxShadow: `0 ${10 * shadow}px ${40 * shadow}px rgba(0,0,0,${0.12 * shadow})`,
              zIndex: i + 1,
              padding: rPadding,
              boxSizing: 'border-box',
            }}
          >
            <div className="flex gap-4 sm:gap-5 md:gap-7 items-stretch">
              {imgSize > 0 && card.image && (
                <div
                  className="shrink-0 rounded-xl sm:rounded-2xl overflow-hidden"
                  style={{ width: imgSize, height: imgSize * imageRatio }}
                >
                  <img src={card.image} alt={card.title || card.tag || ''} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 flex flex-col min-w-0 py-1">
                <div style={{ fontSize: dateSize }} className="text-gray-400">{card.date}</div>
                {card.title && (
                  <div style={{ fontSize: titleSize }} className="text-gray-900 mt-2 leading-snug font-medium">
                    {card.title}
                  </div>
                )}
                {card.description && (
                  <p style={{ fontSize: descSize }} className="text-gray-500 mt-1 leading-snug line-clamp-3 sm:line-clamp-none">
                    {card.description}
                  </p>
                )}
                <div className="flex-1" />
                <div className="flex items-center justify-between mt-3 sm:mt-4">
                  <span className="inline-block px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-100 text-gray-600 text-[11px] sm:text-[13px]">
                    {card.tag}
                  </span>
                  <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-base sm:text-lg leading-none hover:bg-black transition-colors">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={sentinelRef} className="w-full h-px" />
      </div>
    </div>
  );
}

export default ScrollStack;