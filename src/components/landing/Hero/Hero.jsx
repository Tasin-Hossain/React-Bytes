import { useState } from 'react';

import MouseRepelCodeMockup from './components/MouseRepelCodeMockup';
import { MOUSE_REPEL_DEFAULTS } from './constants/mouseRepelConfig';
import { FaArrowRightLong } from 'react-icons/fa6';
import { MdTune } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import Button from '../../ui/Button/Button';
import './Hero.css';
import { Link } from 'react-router';
import CustomDropdown from '../../common/CustomDropdown';
import CurtainText from '../../../content/TextAnimations/CurtainText';
import MouseRepelDots from '../../../content/Backgrounds/MouseRepelDots';

const INSTALL_TABS = ['shadcn', 'jsrepo'];
const PACKAGE_MANAGERS = ['yarn dlx', 'npx', 'pnpm dlx', 'bunx --bun'];
const COMMANDS = {
  shadcn: {
    'yarn dlx': 'yarn dlx npx shadcn@latest add https://reactbytes.dev/r/MagneticText-JS-CSS',
    npx: 'npx shadcn@latest add https://reactbytes.dev/r/MagneticText-JS-CSS',
    'pnpm dlx': 'pnpm dlx shadcn@latest add https://reactbytes.dev/r/MagneticText-JS-CSS',
    'bunx --bun': 'bunx --bun shadcn@latest add https://reactbytes.dev/r/MagneticText-JS-CSS'
  },
  jsrepo: {
    'yarn dlx': 'yarn dlx jsrepo@latest add https://reactbytes.dev/r/MagneticText-JS-CSS',
    npx: 'npx jsrepo@latest add https://reactbytes.dev/r/MagneticText-JS-CSS',
    'pnpm dlx': 'pnpm dlx jsrepo@latest add https://reactbytes.dev/r/MagneticText-JS-CSS',
    'bunx --bun': 'bunx --bun jsrepo@latest add https://reactbytes.dev/r/MagneticText-JS-CSS'
  }
};

// ── Get Started Section
function GetStartedSection() {
  const [activeTab, setActiveTab] = useState('shadcn');
  const [activePkg, setActivePkg] = useState('npx');
  const [copied, setCopied] = useState(false);

  const command = COMMANDS[activeTab][activePkg];

  function handleCopy() {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="w-full max-w-2xl mx-auto mt-10 mb-20"
      style={{ animation: 'fadeUp 0.7s 0.4s ease both', opacity: 0 }}
    >
      <h2 className="title text-[22px]">Get started in seconds</h2>

      <div className="rounded-md border border-(--border-secondary) bg-(--bg-card) backdrop-blur-md">
        <div className="flex items-center justify-between px-4 border-b border-(--border-secondary) rounded-t-xl overflow-visible">
          <div className="flex">
            {INSTALL_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer
                  ${
                    activeTab === tab
                      ? 'border-(--text-primary) text-(--text-primary)'
                      : 'border-transparent text-(--text-muted) hover:text-(--text-primary)'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
          <CustomDropdown options={PACKAGE_MANAGERS} value={activePkg} onChange={setActivePkg} />
        </div>

        <div className="flex items-center justify-between px-5 py-4 gap-4 rounded-b-xl">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-(--text-muted) text-sm shrink-0">~</span>
            <code className="text-sm text-(--text-primary) font-mono truncate">{command}</code>
          </div>
          <button
            onClick={handleCopy}
            className="shrink-0 p-2 rounded-lg border border-(--border-secondary) hover:bg-(--bg-hover) transition-colors text-(--text-muted) hover:text-(--text-primary) cursor-pointer"
            title="Copy"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main HeroSection
export default function HeroSection() {
  const [params, setParams] = useState(MOUSE_REPEL_DEFAULTS);
  const [popupOpen, setPopupOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  function handleParamChange(key, val) {
    setParams(prev => ({ ...prev, [key]: val }));
  }

  const dotsProps = {
    dotRadius: params.dotRadius,
    dotSpacing: params.dotSpacing,
    repelRadius: params.repelRadius,
    force: params.force,
    springK: params.springK,
    damping: params.damping,
    maxDotSize: params.maxDotSize,
    dotColor: params.dotColor,
    dotColorMid: params.dotColorMid,
    dotColorHot: params.dotColorHot,
    backgroundColor: params.backgroundColor,
    gradientFrom: params.gradientFrom,
    gradientTo: params.gradientTo,
    bulgeOnly: params.bulgeOnly,
    bulgeStrength: params.bulgeStrength,
    waveAmplitude: params.waveAmplitude,
    sparkleMode: params.sparkleMode,
    sparkleColor: params.sparkleColor,
    sparkleSize: params.sparkleSize,
    sparkleSpeed: params.sparkleSpeed,
    sparkleDensity: params.sparkleDensity,
  };

  return (
    <>
      {/* MouseRepelDots — fixed full screen, header এর পেছনে সহ */}
      <div className="fixed inset-0" style={{ zIndex: -1 }}>
        <MouseRepelDots {...dotsProps} />
      </div>

      <section className="relative bg-transparent">
        {/* Page content */}
        <div className="relative z-10 flex flex-col gap-4 items-center justify-start px-6 md:px-0 pt-15 md:mb-0">
          {/* Badge */}
          <div
            className="mb-10 px-1 py-0.5 rounded-lg border border-(--border-secondary) bg-(--bg-card) text-xs tracking-wide transition-all duration-200"
            style={{ animation: 'fadeDown 0.6s ease both' }}
          >
            <div className="flex items-center justify-center gap-2">
              <Link to={'/text-animations/curtain-text'}>
                <Button text="New Components" />
              </Link>
              <Link to={'/text-animations/curtain-text'}>
                <button className="btn gap-2 bg-transparent border-none text-[11px]">
                  CURTAIN
                  <FaArrowRightLong size={12} />
                </button>
              </Link>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl tracking-wide text-(--text-primary) leading-[1.06] mb-5 text-center font-medium"
            style={{ animation: 'fadeUp 0.7s 0.1s ease both', opacity: 0 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            Build Faster With{' '}
            <CurtainText
              text="React Bytes"
              externalTrigger={hovered}
              className="mt-3 md:mt-0 lg:mt-0"
              activeClassName="text-(--text-primary)!"
              textClassName="text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient"
              fontClass="font-medium"
            />
          </h1>

          {/* Subtext */}
          <p
            className="text-(--text-muted) text-base md:text-lg leading-relaxed max-w-lg md:max-w-150 mx-auto mb-10 text-center"
            style={{ animation: 'fadeUp 0.7s 0.2s ease both', opacity: 0 }}
          >
            Highly customizable animated components & backgrounds that drop into your project and instantly make it stand out
          </p>

          {/* CTA button */}
          <div
            className="flex items-center justify-center gap-3 flex-wrap"
            style={{ animation: 'fadeUp 0.7s 0.3s ease both', opacity: 0 }}
          >
            <Link to="/text-animations/magnetic-text">
              <Button text="Browse Components" className="py-2 px-4" />
            </Link>
          </div>

          {/* Get started section */}
          <GetStartedSection />
        </div>

        {/* ── Floating customize button ── */}
        <button
          onClick={() => setPopupOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-(--bg-card) border border-(--border-secondary) text-(--text-secondary) text-sm font-medium shadow-lg hover:border-[#7a5af8]/60 hover:text-(--text-primary) transition-all duration-200 backdrop-blur-md"
          style={{ animation: 'fadeUp 0.5s 0.8s ease both', opacity: 0 }}
        >
          <MdTune size={16} />
          Customize
        </button>

        {/* ── Popup overlay ── */}
        {popupOpen && (
          <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={() => setPopupOpen(false)} />

            {/* Popup panel */}
            <div className="relative z-10 w-full max-w-lg rounded-2xl border border-(--border-secondary) bg-(--bg) backdrop-blur-xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setPopupOpen(false)}
                className="absolute top-3 right-3 z-10 p-1.5 border border-(--border-secondary) cursor-pointer rounded-md hover:bg-(--bg-hover) text-(--text-primary) transition-colors"
              >
                <IoClose size={16} />
              </button>

              <MouseRepelCodeMockup params={params} onParamChange={handleParamChange} embedded />
            </div>
          </div>
        )}
      </section>
    </>
  );
}