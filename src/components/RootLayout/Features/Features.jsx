import AiCoding from './Components/AiCoding';
import BlockElements from './Components/BlockElements';
import BuiltWorkflow from './Components/BuiltWorkflow';
import Explore from './Components/Explore';
import Marquee from './Components/Marquee';
import Tools from './Components/Tools';
import './Features.css';
import { motion } from 'framer-motion';

// Card Data
const CARDS = [
  {
    title: 'Interactive Tools',
    desc: 'Three free tools to play with components and grab the code.',
    span: 3,
    visual: <Tools/>
  },
  {
    title: 'Huge Component Collection',
    desc: 'Ready-made animations, effects, layouts, and UI blocks so you can skip repetitive work and build faster.',
    span: 5,
    visual: <Marquee />
  },
  {
    title: 'Easy to Explore',
    desc: 'Everything is grouped neatly into categories, making it simple to find what you need quickly.',
    span: 4,
    visual: <Explore />
  },
  {
    title: 'Built for Every Workflow',
    desc: 'Choose between JavaScript or TypeScript, Tailwind or CSS — whichever fits your project best.',
    span: 4,
    visual: <BuiltWorkflow />
  },
  {
    title: 'Block Elements',
    desc: 'Pre-built layout blocks and flexible sections to speed up page building and design workflows.',
    span: 5,
    visual: <BlockElements />
  },
  {
    title: 'Perfect for AI Coding',
    desc: 'Use with modern AI tools like Cursor, Copilot, and v0 to generate, tweak, and ship components faster.',
    span: 3,
    visual: <AiCoding/>
  }
];

// Responsive col-span mapping:
// mobile  (default) : full width → col-span-12
// tablet  (sm/md)   : half width → col-span-6
// desktop (lg+)     : original spans (3 / 4 / 5)
const getColClass = span => {
  if (span === 5) return 'col-span-12 sm:col-span-6 lg:col-span-5';
  if (span === 4) return 'col-span-12 sm:col-span-6 lg:col-span-4';
  return 'col-span-12 sm:col-span-6 lg:col-span-3';
};

// Features section
const Features = () => {
  return (
    <section className="app-container bg-(--bg) py-10">
      <div>
        <h2 className="title">What&apos;s inside</h2>

        <div className="grid grid-cols-12 gap-4">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              className={`
                bg-(--bg-card)
                backdrop-blur-[32px]
                backdrop-saturate-[1.3] 
                border
                border-(--border-secondary)
                rounded-md
                flex
                flex-col
                transition-all
                duration-300
                overflow-hidden
                hover:border-white/15
                hover:-translate-y-0.5
                ${getColClass(card.span)}
              `}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
            >
              <div className="h-45 pb-4 w-full flex items-center justify-center relative overflow-hidden">
                {card.visual}
              </div>
              <div className="pt-4.5 px-5.5 pb-5.5 ">
                <h3 className="text-[15px] text-(--text-primary) font-semibold mb-1.5 tracking-[-0.01em]">
                  {card.title}
                </h3>

                <p className="text-sm text-(--text-muted) leading-6">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
