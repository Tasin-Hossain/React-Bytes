import { DOMAIN_URL } from '../../constants/site';
import ScrollStackPrompt from '../../prompts/Carousels/ScrollStack.txt?raw';
export { ScrollStackPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const INITIAL_PROPS = {
  cards: [],
  count: 6,
  itemDistance: 30,
  itemStackDistance: 20,
  stackPosition: 18,
  baseScale: 0.86,
  itemScale: 0.03,
  rotationAmount: 0,
  blurAmount: 0,
  corner: 32,
  shadow: 1,
  imageRatio: 1,
  cardMaxWidth: 500
};

export const PROPS_DATA = [
  {
    name: 'count',
    type: 'number',
    def: '6',
    desc: 'Number of cards to render (min 2, max 10). Cycles through the provided/demo card data.'
  },
  {
    name: 'cards',
    type: '{ id, date?, title?, description?, tag?, image }[]',
    def: '[]',
    desc: 'Array of card data. Each card can include id, date, title, description, tag, image. If empty/omitted, fallback demo cards are shown.'
  },
  {
    name: 'itemDistance',
    type: 'number',
    def: '90',
    desc: 'Vertical gap in pixels between consecutive cards before stacking begins.'
  },
  {
    name: 'itemStackDistance',
    type: 'number',
    def: '26',
    desc: 'Extra scroll offset (px) added per card index so each pin locks slightly later than the previous one.'
  },
  {
    name: 'stackPosition',
    type: 'number',
    def: '18',
    desc: 'Percentage from the top of the scroller where a card locks/pins.'
  },
  {
    name: 'baseScale',
    type: 'number',
    def: '0.86',
    desc: 'Minimum scale applied to the first card once fully stacked.'
  },
  {
    name: 'itemScale',
    type: 'number',
    def: '0.03',
    desc: 'Additional scale added per card index on top of baseScale.'
  },
  {
    name: 'rotationAmount',
    type: 'number',
    def: '0',
    desc: 'Rotation in degrees applied per card index while stacking.'
  },
  {
    name: 'blurAmount',
    type: 'number',
    def: '0',
    desc: 'Blur in pixels applied per card index while stacking.'
  },
  {
    name: 'corner',
    type: 'number',
    def: '32',
    desc: 'Card border radius in pixels (auto-reduced on mobile).'
  },
  {
    name: 'shadow',
    type: 'number',
    def: '1',
    desc: 'Multiplier controlling card drop-shadow spread/opacity.'
  },
  {
    name: 'imageRatio',
    type: 'number',
    def: '1',
    desc: 'Aspect ratio (height/width) of the card image block.'
  },
  {
    name: 'cardMaxWidth',
    type: 'number',
    def: '780',
    desc: 'Maximum width in pixels of each card.'
  }
];

export const dep = [{ name: 'gsap', version: '3.12.5' }];

export const PKG_CMDS = {
  pnpm: 'pnpm add gsap',
  npm: 'npm install gsap',
  yarn: 'yarn add gsap',
  bun: 'bun add gsap'
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/ScrollStack-${variant}`,
  npm: `npx shadcn@latest add ${DOMAIN_URL}/r/ScrollStack-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/ScrollStack-${variant}`,
  bun: `bunx shadcn@latest add ${DOMAIN_URL}/r/ScrollStack-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/ScrollStack-${variant}`,
  npm: `npx jsrepo@latest add ${DOMAIN_URL}/r/ScrollStack-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/ScrollStack-${variant}`,
  bun: `bunx jsrepo@latest add ${DOMAIN_URL}/r/ScrollStack-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/Carousels/ScrollStack/ScrollStack?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Carousels/ScrollStack/ScrollStack?raw';
import TS_CSS_CODE from '../../variants/tsCss/Carousels/ScrollStack/ScrollStack?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Carousels/ScrollStack/ScrollStack?raw';
export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css': JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};