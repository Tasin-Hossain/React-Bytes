import { DOMAIN_URL } from '../../constants/site';
import SpiralImagesPrompt from '../../prompts/Carousels/SpiralImages.txt?raw';
export { SpiralImagesPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

// Same 14 seeded images shipped as the component's own DEFAULT_IMAGES fallback.
const DEFAULT_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=70' },
  { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=70' }
];

// Matches the tuned preview state (turns/speed/sizeAttenuation/fadeIn/cornerRadius);
// spacing/spread/imageSize/fadeOut stay at the component's own defaults.
export const INITIAL_PROPS = {
  images: DEFAULT_IMAGES,
  turns: 8,
  speed: 0.4,
  spacing: 1,
  spread: 15,
  sizeAttenuation: 3.9,
  imageSize: 175,
  fadeIn: 100,
  fadeOut: 0,
  cornerRadius: 5,
  className: ''
};

export const PROPS_DATA = [
  {
    name: 'images',
    type: '{ src: string }[]',
    def: '[]',
    desc: 'Array of image sources cycled along the spiral. If empty, fallback demo images are shown.'
  },
  {
    name: 'turns',
    type: 'number',
    def: '3.5',
    desc: 'Number of spiral turns from the outer edge to the center.'
  },
  {
    name: 'speed',
    type: 'number',
    def: '2',
    desc: 'Progress speed of the flow, in loop-units per second.'
  },
  {
    name: 'spacing',
    type: 'number',
    def: '5',
    desc: 'Arc-length spacing between cards along the path — smaller values pack cards closer together.'
  },
  {
    name: 'spread',
    type: 'number',
    def: '6',
    desc: 'Outward radius multiplier for the spiral — higher values push the arms further out (clipped by the container).'
  },
  {
    name: 'sizeAttenuation',
    type: 'number',
    def: '2',
    desc: 'How strongly cards shrink as they approach the center. 0 disables shrinking.'
  },
  {
    name: 'imageSize',
    type: 'number',
    def: '200',
    desc: 'Base card size in pixels, before size attenuation is applied.'
  },
  {
    name: 'fadeIn',
    type: 'number',
    def: '20',
    desc: 'Percentage of the path (from the outer edge) over which cards fade in.'
  },
  {
    name: 'fadeOut',
    type: 'number',
    def: '0',
    desc: 'Percentage of the path (approaching the center) over which cards fade out.'
  },
  {
    name: 'cornerRadius',
    type: 'number',
    def: '5',
    desc: 'Corner rounding applied to each image card.'
  },
  {
    name: 'className',
    type: 'string',
    def: '""',
    desc: 'Additional CSS classes for the outer container. No background is applied by the component itself.'
  }
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: null,
  npm: null,
  yarn: null,
  bun: null
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/SpiralImages-${variant}`,
  npm: `npx shadcn@latest add ${DOMAIN_URL}/r/SpiralImages-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/SpiralImages-${variant}`,
  bun: `bunx shadcn@latest add ${DOMAIN_URL}/r/SpiralImages-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/SpiralImages-${variant}`,
  npm: `npx jsrepo@latest add ${DOMAIN_URL}/r/SpiralImages-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/SpiralImages-${variant}`,
  bun: `bunx jsrepo@latest add ${DOMAIN_URL}/r/SpiralImages-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/Carousels/SpiralImages/SpiralImages?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Carousels/SpiralImages/SpiralImages?raw';
import TS_CSS_CODE from '../../variants/tsCss/Carousels/SpiralImages/SpiralImages?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Carousels/SpiralImages/SpiralImages?raw';
export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css': JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};
