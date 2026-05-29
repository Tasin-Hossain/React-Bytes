import { useState } from 'react';
import { IntegrationOrbit } from './IntegrationOrbit';
import OrbitCodeMockup from './components/OrbitCodeMockup';
import { ORBIT_PARAM_DEFAULTS } from './constants/orbitConfig';
import { FaArrowRightLong } from 'react-icons/fa6';
import Button from '../../ui/Button/Button';
import './Hero.css';
export default function HeroSection() {
  const [colorIdx, setColorIdx] = useState(0);
  const [params, setParams] = useState(ORBIT_PARAM_DEFAULTS);

  function handleParamChange(key, val) {
    setParams(prev => ({ ...prev, [key]: val }));
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-(--bg) ">
      {/* IntegrationOrbit — absolute full-screen background */}
      <div className="absolute inset-0 z-0">
        <IntegrationOrbit
          icons={['claude', 'figma', 'slack', 'openai', 'vercel', 'linear', 'supabase', 'stripe']}
          globeColor={[params.globeHue, params.globeSat, params.globeLit]}
          particleCount={params.particleCount}
          speedMultiplier={params.speed}
          height="100%"
          buttonLabel={null}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-6 pb-16 pt-20">
        {/* new Components button */}
        <div
          className="mb-10 px-1 py-1 rounded-md border border-(--border-secondary) bg-(--bg-card) text-xs  tracking-widetransition-all duration-200"
          style={{ animation: 'fadeDown 0.6s ease both' }}
        >
          <div className="flex items-center justify-center gap-2">
            <Button text="New Components" />
            <button className="btn gap-2 bg-transparent border-none text-xs">
              IntegrationOrbit
              <FaArrowRightLong size={12} className="" />
            </button>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-6xl  tracking-wide text-(--text-primary) leading-[1.06] mb-5 text-center"
          style={{ animation: 'fadeUp 0.7s 0.1s ease both', opacity: 0 }}
        >
          Build Faster With {''}
          <span className="inline-block text-transparent bg-clip-text bg-linear-to-r from-[#7a5af8]  via-[#d35af8]  to-[#7a5af8] bg-size-[300%_300%] animate-gradient">
            React Bytes
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="text-(--text-muted) text-base md:text-lg leading-relaxed max-w-lg md:max-w-150 mx-auto mb-10 text-center"
          style={{ animation: 'fadeUp 0.7s 0.2s ease both', opacity: 0 }}
        >
          Highly customizable animated components & backgrounds that drop into your project and instantly make it stand
          out
        </p>

        {/* CTAs */}
        <div
          className="flex items-center justify-center gap-3 flex-wrap"
          style={{ animation: 'fadeUp 0.7s 0.3s ease both', opacity: 0 }}
        >
          <button className="btn text-[16px]">Get Started</button>
        </div>

        <div className="">
          {/* Code mockup showing live IntegrationOrbit props */}
          <OrbitCodeMockup
            params={params}
            colorIdx={colorIdx}
            onParamChange={handleParamChange}
            onColorChange={setColorIdx}
          />
        </div>
      </div>
    </section>
  );
}
