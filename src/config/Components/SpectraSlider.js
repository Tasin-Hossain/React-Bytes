import { DOMAIN_URL } from '../../constants/site';
import SpectraSliderPrompt from '../../prompts/Components/SpectraSlider.txt?raw';
export { SpectraSliderPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const ENTRANCETYPES = [
  { label: 'Pop', value: 'pop' },
  { label: 'Fade', value: 'fade' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Top', value: 'top' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Flip', value: 'flip' },
  { label: 'Scatter', value: 'scatter' },
  { label: 'Spin', value: 'spin' },
  { label: 'Zoom Blur', value: 'zoomBlur' }
];
export const DIRECTIONS =[
    { label: 'Vertical', value: 'vertical' },
    { label: 'Horizontal', value: 'horizontal' },

]

export const INITIAL_PROPS = {
  cards: [
    { id: 1, image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&q=70', content: '1' },
    { id: 2, image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=500&q=70', content: '2' },
    { id: 3, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=70', content: '3' },
    { id: 4, image: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=500&q=70', content: '4' },
    { id: 5, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&q=70', content: '5' },
    { id: 6, image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=500&q=70', content: '6' },
    { id: 7, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&q=70', content: '7' }
  ],
  numberOfCards: 10,
  cardWidth: 220,
  cardHeight: 240,
  gap: 100,
  perspective: 400,
  maxRotation: 0,
  scaleStep: 0.10,
  opacityStep: 0.28,
  brightnessStep: 0.5,
  draggable: true,
  snap: true,
  initialIndex: 0,
  autoPlay: true,
  direction : 'horizontal',
  curveIntensity : -20,
  duration: 20,
  reverse: false,
  pauseOnHover: true,
  wheelSmoothness : 0.15,
  wheelSensitivity : 0.008,
  mouseWheel: false,
  filterOnHover: true,
  defaultFiltered: false,
  entranceAnimation: true,
  entranceDuration: 0.9,
  entranceStagger: 0.07,
  entranceEase: 'back.out(1.4)',
  entranceType: 'flip'
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
    def: '7',
    desc: 'Number of cards to display (min 3). Slices from the cards array or fallback demo cards.'
  },
  {
    name: 'cardWidth',
    type: 'number',
    def: '220',
    desc: 'Width of each card in pixels.'
  },
  {
    name: 'cardHeight',
    type: 'number',
    def: '340',
    desc: 'Height of each card in pixels.'
  },
  {
    name: 'gap',
    type: 'number',
    def: '190',
    desc: 'Horizontal distance between card centers in pixels.'
  },
  {
    name: 'perspective',
    type: 'number',
    def: '1200',
    desc: 'CSS perspective (in pixels) applied to the stage, controls how strong the 3D depth effect looks.'
  },
  {
    name: 'maxRotation',
    type: 'number',
    def: '35',
    desc: 'Maximum rotateY tilt (in degrees) applied to the furthest visible cards.'
  },
  {
    name: 'scaleStep',
    type: 'number',
    def: '0.14',
    desc: 'How much each card shrinks per step away from the centered card.'
  },
  {
    name: 'opacityStep',
    type: 'number',
    def: '0.28',
    desc: 'How much each card fades per step away from the centered card.'
  },
  {
    name: 'brightnessStep',
    type: 'number',
    def: '0.35',
    desc: 'How much each card darkens (CSS brightness filter) per step away from the centered card.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    def: 'true',
    desc: 'Enable drag to move through the cards.'
  },
  {
    name: 'snap',
    type: 'boolean',
    def: 'true',
    desc: 'Snap to the nearest card when a drag or wheel scroll ends.'
  },
  {
    name: 'initialIndex',
    type: 'number',
    def: '0',
    desc: 'Index of the card centered on mount.'
  },
  {
    name: 'autoPlay',
    type: 'boolean',
    def: 'false',
    desc: 'Automatically cycles through the cards on a continuous loop.'
  },
  {
    name: 'duration',
    type: 'number',
    def: '20',
    desc: 'Seconds for one full autoplay loop through every card.'
  },
  {
    name: 'reverse',
    type: 'boolean',
    def: 'false',
    desc: 'Reverses the autoplay direction.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    def: 'true',
    desc: 'Pauses autoplay while the pointer is hovering over the stage.'
  },
   {
    name: 'wheelSmoothness',
    type: 'number',
    def: '0.15',
    desc: 'Lerp factor (0-1) for wheel-driven movement — lower values feel smoother/slower to catch up to the scroll target.'
  },
  {
    name: 'wheelSensitivity',
    type: 'number',
    def: '0.008',
    desc: 'Multiplier converting wheel deltaY into offset movement.'
  },
  {
    name: 'mouseWheel',
    type: 'boolean',
    def: 'true',
    desc: 'Enables scrolling through cards with the mouse wheel / trackpad.'
  },
  {
    name: 'filterOnHover',
    type: 'boolean',
    def: 'false',
    desc: 'Toggles a grayscale/contrast filter on a card when it is hovered.'
  },
  {
    name: 'defaultFiltered',
    type: 'boolean',
    def: 'false',
    desc: 'When filterOnHover is enabled, controls whether cards start filtered (and clear on hover) or start clear (and filter on hover).'
  },
    {
    name: 'direction',
    type: "'horizontal' | 'vertical'",
    def: "'horizontal'",
    desc: 'Layout axis for the stack — cards spread vertically or horizontally.'
  },
  {
    name: 'curveIntensity',
    type: 'number',
    def: '-20',
    desc: 'Perpendicular arc offset applied per step away from center (offset * diff²). Positive/negative flips the curve side; 0 keeps the stack flat.'
  },
  {
    name: 'entranceAnimation',
    type: 'boolean',
    def: 'true',
    desc: 'Plays a one-time entrance animation for the cards on mount.'
  },
  {
    name: 'entranceDuration',
    type: 'number',
    def: '0.9',
    desc: 'Duration (in seconds) of the entrance animation.'
  },
  {
    name: 'entranceStagger',
    type: 'number',
    def: '0.07',
    desc: 'Delay (in seconds) between each card\u2019s entrance animation.'
  },
  {
    name: 'entranceEase',
    type: 'string',
    def: '"back.out(1.4)"',
    desc: 'GSAP easing function used for the entrance animation.'
  },
  {
    name: 'entranceType',
    type: 'string',
    def: '"spin"',
    desc: 'Entrance animation style: pop | fade | bottom | top | left | right | flip | scatter | spin | zoomBlur.'
  },
  {
    name: 'onCardClick',
    type: '(card: Card, index: number) => void',
    def: 'undefined',
    desc: 'Callback fired when the centered card is clicked. Clicking an off-center card instead animates it to center.'
  },
  {
    name: 'className',
    type: 'string',
    def: '""',
    desc: 'Additional CSS classes for the stage container. No background is applied by the component itself.'
  },
  {
    name: 'cardClassName',
    type: 'string',
    def: '""',
    desc: 'Additional CSS classes for individual cards.'
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
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/SpectraSlider-${variant}`,
  npm: `npx shadcn@latest add ${DOMAIN_URL}/r/SpectraSlider-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/SpectraSlider-${variant}`,
  bun: `bunx shadcn@latest add ${DOMAIN_URL}/r/SpectraSlider-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/SpectraSlider-${variant}`,
  npm: `npx jsrepo@latest add ${DOMAIN_URL}/r/SpectraSlider-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/SpectraSlider-${variant}`,
  bun: `bunx jsrepo@latest add ${DOMAIN_URL}/r/SpectraSlider-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/Components/SpectraSlider/SpectraSlider?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Components/SpectraSlider/SpectraSlider?raw';
import TS_CSS_CODE from '../../variants/tsCss/Components/SpectraSlider/SpectraSlider?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Components/SpectraSlider/SpectraSlider?raw';
export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css': JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};