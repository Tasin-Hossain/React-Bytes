
import { DOMAIN_URL } from '../../constants/site';
import BlurHighlightPrompt from '../../prompts/TextAnimations/BlurHighlight.txt?raw';
export { BlurHighlightPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const EASE_OPTIONS = [
  { label: 'Circ in-out',  value: 'circ.inOut' },
  { label: 'Power2 out',   value: 'power2.out' },
  { label: 'Power3 out',   value: 'power3.out' },
  { label: 'Back out',     value: 'back.out(1.7)' },
];

export const MODE_OPTIONS = [
  { label: 'Wipe',      value: 'wipe' },
  { label: 'Slide',     value: 'slide' },
  { label: 'Curtain',   value: 'curtain' },
  { label: 'Blinds',    value: 'blinds' },
  { label: 'Fade',      value: 'fade' },
  { label: 'Highlight', value: 'highlight' },
];

export const DIRECTION_OPTIONS = [
  { label: 'Left',   value: 'left' },
  { label: 'Right',  value: 'right' },
  { label: 'Top',    value: 'top' },
  { label: 'Bottom', value: 'bottom' },
];

export const METHOD_OPTIONS = [
  { label: 'Word',  value: 'word' },
  { label: 'Whole', value: 'whole' },
];

export const AS_OPTIONS = [
  { label: 'h1',   value: 'h1' },
  { label: 'h2',   value: 'h2' },
  { label: 'h3',   value: 'h3' },
  { label: 'p',    value: 'p' },
  { label: 'span', value: 'span' },
];

export const INITIAL_PROPS = {
  text:            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  mode:            'highlight',
  direction:       'left',
  method:          'word',
  highlightedBits: ['Lorem ipsum', 'elit', 'incididunt','minim','exercitation','commodo'],
  maskColor:       '#7C3AED',
  textColor:       '#ffffff',
  ease:            'circ.inOut',
  revealDuration:  0.6,
  revealDelay:     0,
  staggerAmount:   0.7,
  once:            true,
  amount:          1,
  className: 'text-2xl sm:text-2xl md:text-2xl lg:text-2xl '
  
};

export const PROPS_DATA = [
  // TEXT
  { name: 'text',            type: 'string',   def: '"Our cutting-edge technology..."', desc: 'Display text to animate (passed as children in JSX).' },
  // MODE + DIRECTION
  { name: 'mode',            type: 'string',   def: '"wipe"',       desc: 'Animation style: "wipe" | "slide" | "curtain" | "blinds" | "fade" | "highlight".' },
  { name: 'direction',       type: 'string',   def: '"left"',       desc: 'Direction the mask exits or the highlight pill grows from: "left" | "right" | "top" | "bottom".' },
  { name: 'method',          type: 'string',   def: '"word"',       desc: 'Split granularity for non-highlight modes: "word" (each word masked separately) or "whole" (single mask for the full text).' },
  { name: 'highlightedBits', type: 'string[]', def: '[]',           desc: 'Only used when mode="highlight". Exact phrases to wrap in an animated rounded pill.' },
  // STAGGER / TIMING
  { name: 'revealDuration',  type: 'number',   def: '0.6',          desc: 'Duration (s) of each chunk/pill reveal animation.' },
  { name: 'revealDelay',     type: 'number',   def: '0',            desc: 'Delay (s) before the reveal animation starts.' },
  { name: 'staggerAmount',   type: 'number',   def: 'auto (0.4–0.7)', desc: 'Total time (s) spread across all chunks/pills; leave unset for automatic stagger based on chunk count.' },
  { name: 'ease',            type: 'string',   def: '"circ.inOut"', desc: 'GSAP ease string, e.g. "circ.inOut", "power2.out", "back.out(1.7)".' },
  // STYLE
  { name: 'maskColor',       type: 'string',   def: '"#49A078"',    desc: 'CSS color for the mask / highlight pill, e.g. "#7C3AED" or "crimson".' },
  { name: 'textColor',       type: 'string',   def: '"inherit"',    desc: 'CSS color applied to the revealed text.' },
  { name: 'as',              type: 'string',   def: '"p"',          desc: 'HTML tag to render: "h1" | "h2" | "h3" | "p" | "span".' },
  // VIEWPORT
  { name: 'once',            type: 'boolean',  def: 'true',         desc: 'If true, animates only the first time it enters the viewport. If false, resets and re-animates every time (highlight mode only).' },
  { name: 'amount',          type: 'number',   def: '1',            desc: 'Fraction of the element that must be visible (0–1) before the animation triggers.' },
  { name: 'rootMargin',      type: 'string',   def: '"0px 0px -120px 0px"', desc: 'IntersectionObserver root margin, shifts when the trigger point fires relative to the viewport edge.' },
  // CLASSNAMES
  { name: 'className',       type: 'string',   def: '""',           desc: 'Extra classes applied to the root wrapper element.' },
];

export const dep = [
  { name: 'gsap', version: '3.12.5' },
];

export const PKG_CMDS = {
  pnpm: 'pnpm add gsap',
  npm:  'npm install gsap',
  yarn: 'yarn add gsap',
  bun:  'bun add gsap',
};

export const getShadcnCmds = (variant) => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/BlurHighlight-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/BlurHighlight-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/BlurHighlight-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/BlurHighlight-${variant}`,
});

export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/BlurHighlight-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/BlurHighlight-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/BlurHighlight-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/BlurHighlight-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/BlurHighlight/BlurHighlight?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/BlurHighlight/BlurHighlight?raw';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/BlurHighlight/BlurHighlight?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/BlurHighlight/BlurHighlight?raw';

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

