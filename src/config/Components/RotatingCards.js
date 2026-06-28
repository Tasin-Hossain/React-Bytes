import RotatingCardsPrompt from '../../prompts/Components/RotatingCards.txt?raw';
export { RotatingCardsPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const ENTRANCETYPES = [
  { value: 'zoomBlur', label: 'Zoom Blur' },
  { value: 'spin', label: 'Spin' },
  { value: 'scatter', label: 'Scatter' },
  { value: 'flip', label: 'Flip' },
  { value: 'pop',  label: 'Pop'  },
  { value: 'fade',   label: 'Fade'   },
  { value: 'top', label: 'Top' },
  { value: 'bottom',    label: 'Bottom'    },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

export const INITIAL_PROPS = {
  cards: [
    { id: 1, image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=70', content: '1' },
    { id: 2, image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&q=70', content: '2' },
    { id: 3, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70', content: '3' },
    { id: 4, image: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=400&q=70', content: '4' },
    { id: 5, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=70', content: '5' },
    { id: 6, image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400&q=70', content: '6' },
    { id: 7, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70', content: '7' },
    { id: 8, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70', content: '8' },
    { id: 9, image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=70', content: '9' },
    { id: 10, image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=70', content: '10' }
  ],
  radius: 390,
  numberOfCards: 10,
  duration: 22,
  cardWidth: 165,
  cardHeight: 154,
  pauseOnHover: false,
  reverse: false,
  draggable: false,
  autoPlay: true,
  mouseWheel: false,
  filterOnHover: true,
  defaultFiltered: true,
  initialRotation: 0,
  entranceAnimation: true,
  entranceType: 'pop',
  entranceDuration: 0.9,
  entranceStagger: 0.02,
  entranceEase: 'back.out(1.4)'
};

export const PROPS_DATA = [
  {
    name: 'cards',
    type: 'Card[]',
    def: '[]',
    desc: 'Array of card objects. Each card: { id, image?: string, content?: ReactNode }. If empty, fallback demo cards are shown.'
  },
  {
    name: 'numberOfCards',
    type: 'number',
    def: '10',
    desc: 'Number of cards to display (min 3, max 10). Slices from the cards array or fallback demo cards.'
  },
  {
    name: 'radius',
    type: 'number',
    def: '480',
    desc: 'Radius of the circle in pixels.'
  },
  {
    name: 'duration',
    type: 'number',
    def: '22',
    desc: 'Duration of one full rotation in seconds.'
  },
  {
    name: 'cardWidth',
    type: 'number',
    def: '162',
    desc: 'Width of each card in pixels.'
  },
  {
    name: 'cardHeight',
    type: 'number',
    def: '192',
    desc: 'Height of each card in pixels.'
  },
  {
    name: 'height',
    type: 'number',
    def: '500',
    desc: 'Height of the container in pixels.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    def: 'false',
    desc: 'Pause rotation when hovering over a card.'
  },
  {
    name: 'reverse',
    type: 'boolean',
    def: 'false',
    desc: 'Reverse the rotation direction.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    def: 'true',
    desc: 'Enable drag to rotate the circle.'
  },
  {
    name: 'autoPlay',
    type: 'boolean',
    def: 'true',
    desc: 'Auto-play rotation animation.'
  },
  {
    name: 'onCardClick',
    type: '(card: Card, index: number) => void',
    def: 'undefined',
    desc: 'Callback fired when a card is clicked.'
  },
  {
    name: 'mouseWheel',
    type: 'boolean',
    def: 'true',
    desc: 'Enable mouse wheel to control rotation.'
  },
  {
    name: 'className',
    type: 'string',
    def: '""',
    desc: 'Additional CSS classes for the container.'
  },
  {
    name: 'cardClassName',
    type: 'string',
    def: '""',
    desc: 'Additional CSS classes for individual cards.'
  },
  {
    name: 'initialRotation',
    type: 'number',
    def: '0',
    desc: 'Initial rotation offset in degrees. Updates live when changed.'
  },
  {
    name: 'filterOnHover',
    type: 'boolean',
    def: 'true',
    desc: 'Toggle the grayscale/dark filter on a card when hovering over it.'
  },
  {
    name: 'defaultFiltered',
    type: 'boolean',
    def: 'true',
    desc: 'Whether cards start with the grayscale/dark filter applied by default. Hovering inverts this state per card.'
  },
  {
    name: 'entranceAnimation',
    type: 'boolean',
    def: 'true',
    desc: 'Enable/disable the entrance animation played when the component first mounts.'
  },
  {
    name: 'entranceType',
    type: '"pop" | "fade" | "bottom" | "top" | "left" | "right" | "flip" | "spin" | "zoomBlur" | "scatter"',
    def: '"pop"',
    desc: 'Preset style for the mount entrance animation.'
  },
  {
    name: 'entranceDuration',
    type: 'number',
    def: '0.9',
    desc: 'Duration of the entrance animation in seconds.'
  },
  {
    name: 'entranceStagger',
    type: 'number',
    def: '0.07',
    desc: 'Delay (in seconds) between each card animating in during entrance.'
  },
  {
    name: 'entranceEase',
    type: 'string',
    def: '"back.out(1.4)"',
    desc: 'GSAP ease string used for the entrance animation (e.g. "power2.out", "elastic.out(1, 0.5)").'
  }
];

export const dep = [{ name: 'gsap', version: '3.15.0' }];

export const PKG_CMDS = {
  pnpm: 'pnpm add gsap',
  npm: 'npm install gsap',
  yarn: 'yarn add gsap',
  bun: 'bun add gsap'
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add https://reactbytes.dev/r/RotatingCards-${variant}`,
  npm: `npx shadcn@latest add https://reactbytes.dev/r/RotatingCards-${variant}`,
  yarn: `yarn shadcn@latest add https://reactbytes.dev/r/RotatingCards-${variant}`,
  bun: `bunx shadcn@latest add https://reactbytes.dev/r/RotatingCards-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add https://reactbytes.dev/r/RotatingCards-${variant}`,
  npm: `npx jsrepo@latest add https://reactbytes.dev/r/RotatingCards-${variant}`,
  yarn: `yarn jsrepo@latest add https://reactbytes.dev/r/RotatingCards-${variant}`,
  bun: `bunx jsrepo@latest add https://reactbytes.dev/r/RotatingCards-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/Components/RotatingCards/RotatingCards?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Components/RotatingCards/RotatingCards?raw';
import TS_CSS_CODE from '../../variants/tsCss/Components/RotatingCards/RotatingCards?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Components/RotatingCards/RotatingCards?raw';
export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css': JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};
