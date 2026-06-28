import BlurTextPrompt from '../../prompts/TextAnimations/BlurText.txt?raw';
export { BlurTextPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const FROM_OPTIONS = [
  { value: 'center', label: 'Center' },
  { value: 'start',  label: 'Start' },
  { value: 'end',    label: 'End' },
  { value: 'random', label: 'Random' },
];

export const ANIMATE_BY_OPTIONS = [
  { value: 'letter', label: 'Letter' },
  { value: 'word',   label: 'Word' },
];

export const INITIAL_PROPS = {
  text:      'BLUR TEXT',
  animateBy: 'letter',
  from:      'start',
  scale:     4,
  blur:      8,
  yOffset:   0,
  duration:  0.8,
  charDelay: 0.06,
  wordDelay: 0.15,
  repeat:    false,
  color:     '#d35af8',
  fontSize:  'text-6xl',
};

export const PROPS_DATA = [
  // TEXT
  { name: 'text',      type: 'string',  def: '"BLUR TEXT"',   desc: 'Display text to animate.' },
  // ANIMATION MODE
  { name: 'animateBy', type: 'string',  def: '"letter"',   desc: 'Animate character-by-character or word-by-word: "letter" | "word".' },
  // STAGGER
  { name: 'from',      type: 'string',  def: '"center"',   desc: 'Stagger origin for reveal: "center" | "start" | "end" | "random".' },
  { name: 'charDelay', type: 'number',  def: '0.06',       desc: 'Stagger delay (s) between each character entrance (used when animateBy="letter").' },
  { name: 'wordDelay', type: 'number',  def: '0.15',       desc: 'Stagger delay (s) between each word entrance (used when animateBy="word").' },
  // EXPLODE
  { name: 'scale',     type: 'number',  def: '4',          desc: 'Initial scale of each token before it animates in.' },
  { name: 'blur',      type: 'number',  def: '8',          desc: 'Initial blur amount (px) applied to each token before it animates in.' },
  { name: 'yOffset',   type: 'number',  def: '0',          desc: 'Initial Y offset (px) — tokens travel upward into position. 0 disables vertical movement.' },
  // TIMING
  { name: 'duration',  type: 'number',  def: '0.8',        desc: 'Duration (s) of the animation for each character or word.' },
  { name: 'repeat',    type: 'boolean', def: 'false',      desc: 'Loop the explode animation indefinitely.' },
  // STYLE
  { name: 'color',     type: 'string',  def: '"#d35af8"',  desc: 'CSS color value for the text, e.g. "#fff" or "crimson". Ignored when gradient is set.' },
  { name: 'gradient',  type: 'string',  def: '""',         desc: 'CSS gradient string applied as a text gradient, e.g. "linear-gradient(90deg,#f97316,#ec4899)". Overrides color when set.' },
  { name: 'fontSize',  type: 'string',  def: '"text-6xl"', desc: 'Tailwind font-size class, e.g. "text-4xl" | "text-6xl" | "text-9xl".' },
  // CLASSNAMES
  { name: 'className', type: 'string',  def: '""',         desc: 'Extra classes applied to the root wrapper div.' },
];

export const dep = [
  { name: 'gsap', version: '3.15.0' },
];

export const PKG_CMDS = {
  pnpm: 'pnpm add gsap',
  npm:  'npm install gsap',
  yarn: 'yarn add gsap',
  bun:  'bun add gsap',
};

export const getShadcnCmds = (variant) => ({
  pnpm: `pnpm dlx shadcn@latest add https://reactbytes.dev/r/BlurText-${variant}`,
  npm:  `npx shadcn@latest add https://reactbytes.dev/r/BlurText-${variant}`,
  yarn: `yarn shadcn@latest add https://reactbytes.dev/r/BlurText-${variant}`,
  bun:  `bunx shadcn@latest add https://reactbytes.dev/r/BlurText-${variant}`,
});

export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add https://reactbytes.dev/r/BlurText-${variant}`,
  npm:  `npx jsrepo@latest add https://reactbytes.dev/r/BlurText-${variant}`,
  yarn: `yarn jsrepo@latest add https://reactbytes.dev/r/BlurText-${variant}`,
  bun:  `bunx jsrepo@latest add https://reactbytes.dev/r/BlurText-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/BlurText/BlurText?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/BlurText/BlurText?raw';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/BlurText/BlurText?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/BlurText/BlurText?raw';

export { JS_CSS_CODE };
export { JS_TAILWIND_CODE };
export { TS_CSS_CODE };
export { TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css':      JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css':      TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE,
};