import { useEffect, useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import Button from '../../ui/Button/Button';
import './Hero.css';
import { Link } from 'react-router';
import RotatingCards from '../../../content/Components/RotatingCards';
import SpotlightText from '../../../content/TextAnimations/SpotlightText';
import Image_1 from '../../../assets/demo/Hero/image-1.png';
import Image_2 from '../../../assets/demo/Hero/image-2.png';
import Image_3 from '../../../assets/demo/Hero/image-3.png';
import Image_4 from '../../../assets/demo/Hero/image-4.png';
import Image_5 from '../../../assets/demo/Hero/image-5.png';
import Image_6 from '../../../assets/demo/Hero/image-6.png';
// ── Main HeroSection
export default function HeroSection() {
  const [width, setWidth] = useState(0);

  const CARDS = [
    {
      id: 1,
      image: Image_1,
      title: 'Mouse Repel Dots',
      to: '/backgrounds/mouserepel-dots'
    },
    {
      id: 2,
      image: Image_2,
      title: 'Mouse Repel Grid',
      to: '/backgrounds/mouserepel-grid'

    },
    { id: 3, image: Image_3, title: 'Blinking Squares', to: '/backgrounds/blinking-squares'},
    { id: 4, image: Image_4, title: 'Half Tone', to: '/backgrounds/half-tone' },
    { id: 5, image: Image_5, title: 'Shapes Dots',  to: '/backgrounds/shapes-dots' },
    { id: 6, image: Image_6, title: 'Ascii Plasma Wave',  to: '/backgrounds/asciiplasma-wave' }
  ];

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);

    update();
    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, []);

  const isMobile = width > 0 && width < 768;
  const isTablet = width >= 768 && width < 1024;
  // Bottom-anchored orbit stays through tablet too; only desktop (lg+)
  // switches to the full-height, right-anchored version.
  const isCompact = isMobile || isTablet;

  const cardRadius = isMobile ? 150 : isTablet ? 260 : 380;

  const cardWidth = isMobile ? 165 : isTablet ? 200 : 250;
  const cardHight = isMobile ? 154 : isTablet ? 200 : 250;

  const cardDirection = isCompact ? 'bottom' : 'right';

  return (
    <section className="relative h-180 sm:h-170 md:h-200 lg:h-180 overflow-hidden bg-(--bg)">
      {/* Dark Noise Colored Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'var(--bg)',
          backgroundImage: `
      radial-gradient(circle at 1px 1px, rgba(211, 90, 248, 0.2) 1px, transparent 0),
      radial-gradient(circle at 1px 1px, rgba(122, 90, 248, 0.2) 1px, transparent 0)
    `,
          backgroundSize: '20px 20px, 30px 30px',
          backgroundPosition: '0 0, 10px 10px',
          WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)',
          maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)'
        }}
      />

      <RotatingCards
        cards={CARDS}
        numberOfCards={6}
        radius={cardRadius}
        direction={cardDirection}
        mouseWheel={false}
        cardWidth={cardWidth}
        cardHeight={cardHight}
        draggable={false}
        entranceType="right"
        pauseOnHover={true}
        cardClassName="shadow-2xl shadow-[#d35af8]/10"
        className="absolute! inset-x-0 bottom-0 h-64 sm:h-80 md:h-96 z-0 flex lg:h-screen lg:top-0 lg:opacity-100 lg:z-2 "
        defaultFiltered={false}
      />

      {/*
        Page content — top-aligned on mobile/tablet, vertically centered on lg+.
        pointer-events-none here so this full-bleed wrapper doesn't sit on top
        of RotatingCards (z-10 > lg:z-2) and swallow hover/click before it
        reaches the cards. Each interactive child re-enables pointer events
        with pointer-events-auto below.
      */}
      <div className="app-container relative z-10 h-full flex flex-col gap-4 items-center lg:items-start justify-start lg:justify-center pt-20 md:pt-20 lg:pt-0 lg:pb-0 pointer-events-none">
        {/* Badge */}
        <div
          className="pointer-events-auto mb-8 sm:mb-10 px-1 py-0.5 rounded-lg border border-(--border-secondary) bg-(--bg-card) text-xs tracking-wide transition-all duration-200"
          style={{ animation: 'fadeDown 0.6s ease both' }}
        >
          <div className="flex items-center justify-center flex-wrap gap-2">
            <Link to={'/text-animations/curtain-text'}>
              <Button text="New Components" />
            </Link>
            <Link to={'/text-animations/curtain-text'}>
              <button className="flex items-center gap-2 bg-transparent border-none text-(--text-primary) text-[11px] py-2 px-3">
                CURTAIN
                <FaArrowRightLong size={12} />
              </button>
            </Link>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-col lg:items-start gap-2 md:flex md:items-center ">
          {/* Headline */}
          <span
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-wide text-(--text-primary)   text-center lg:text-left font-medium wrap-break-word"
            style={{ animation: 'fadeUp 0.7s 0.1s ease both', opacity: 0 }}
          >
            Build Faster With
          </span>
          <SpotlightText
            text="React Bytes"
            repeat={true}
            baseColor="var(--brand) "
            spotColor="var-(--brand-two)"
            duration={0.6}
            className=" tracking-normal! text-3xl! sm:text-4xl! md:text-5xl! lg:text-7xl! font-medium "
          />
        </div>

        {/* Subtext */}
        <p
          className="pointer-events-auto text-(--text-muted) text-sm sm:text-base md:text-lg leading-relaxed max-w-md sm:max-w-lg lg:max-w-150 mx-auto lg:mx-0 mb-8 sm:mb-10 text-center lg:text-left"
          style={{ animation: 'fadeUp 0.7s 0.2s ease both', opacity: 0 }}
        >
          Highly customizable animated components & backgrounds that drop into your project and instantly make it stand
          out
        </p>

        {/* CTA button */}
        <div
          className="pointer-events-auto flex items-center justify-center lg:justify-start gap-3 flex-wrap"
          style={{ animation: 'fadeUp 0.7s 0.3s ease both', opacity: 0 }}
        >
          <Link to="/text-animations/magnetic-text">
            <Button text="Browse Components" className="py-2 px-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
