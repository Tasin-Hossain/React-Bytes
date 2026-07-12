import { Link } from 'react-router';
import { motion } from 'motion/react';
import { FiArrowRight } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa6';
import './CTA.css';
import BlinkingSquares from '../../../content/Backgrounds/BlinkingSquares';

const CTA = () => {
  return (
    <section className="relative w-full overflow-hidden z-4 py-8">
      <motion.div
        className="relative z-1 app-container mx-auto px-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="relative">
          <div className="ln-cta-card-border absolute -inset-px rounded-2xl p-px [background:conic-gradient(from_var(--cta-angle),transparent_0%,var(--brand)_10%,transparent_20%,transparent_50%,var(--brand-2)_60%,transparent_70%)] pointer-events-none z-0" />

          <div className="relative z-1 overflow-hidden flex flex-col items-center text-center py-25 rounded-2xl bg-(--bg-card) backdrop-blur-[32px] [backdrop-filter:blur(32px)_saturate(1.3)] shadow-[0_4px_32px_rgba(0,0,0,0.1),inset_0_0.5px_0_rgba(255,255,255,0.06)] max-[600px]:py-9 max-[600px]:px-6">
            <div className="absolute inset-0 pointer-events-none ">
              <BlinkingSquares
                className='w-full! h-full!'
                direction="bottom"
                gridSize={8}
                squareSize={0.41}
                fadeStart={0}
                fadeEnd={1}
                falloff={6}
                minBrightness={0.42}
                twinkleSpeed={0.2}
                twinkleStrength={1}
                intensity={1.65}
                opacity={1}
                squareColor="#d35af8"
                backgroundColor="transparent"
                dpr={1.5}
              />
            </div>
            <h2 className="title">Build faster. Ship sooner.</h2>

            <p className="mb-8 max-w-[46ch]">
              Highly customizable animated components & backgrounds you can drop into any project. Open source. Always
              free.
            </p>

            <div className="flex gap-2.5 max-[600px]:flex-col max-[600px]:w-full">
              <Link to="/backgrounds/blinking-squares" className="btn">
                Browse Components <FiArrowRight size={15} />
              </Link>
              <a
                href="https://github.com/Tasin-Hossain/React-Bytes"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-none"
              >
                <FaGithub size={15} /> Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
