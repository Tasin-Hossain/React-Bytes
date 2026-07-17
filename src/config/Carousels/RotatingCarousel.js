import { DOMAIN_URL } from '../../constants/site';
import RotatingCarouselPrompt from '../../prompts/Carousels/RotatingCarousel.txt?raw';
export { RotatingCarouselPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const ENTRANCETYPES = [
  { value: 'spin', label: 'Spin' },
  { value: 'scatter', label: 'Scatter' },
  { value: 'flip', label: 'Flip' },
  { value: 'pop',  label: 'Pop'  },
  { value: 'fade',   label: 'Fade'   },
  { value: 'top', label: 'Top' },
  { value: 'bottom',    label: 'Bottom'    },

];

export const FACEFITTYPES = [
  { value: 'cover', label: 'Cover' },
  { value: 'contain', label: 'Contain' },
  { value: 'fill', label: 'Fill' },
];

export const INITIAL_PROPS = {
  images: [
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=70',
    'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&q=70',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70',
    'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=400&q=70',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=70',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70',
    'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=70',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=70',
  ],
  faceCount: 12,
  faceWidth: 150,
  faceHeight: 140,
  maxFaceWidth: undefined,
  minFaceWidth: 120,
  responsive: true,
  cardGap: 10,
  draggable: true,
  dragSensitivity: 1,
  shadeIntensity: 0.85,
  shadeBase: 0.15,
  autoRotate: true,
  autoRotateSpeed: 30,
  autoRotateDirection: 1,
  smoothness: 0.25,
  inertia: true,
  inertiaResistance: 7,
  pauseAutoRotateOnHover: true,
  initialRotation: 0,
  faceFit: 'cover',
  entranceAnimation: true,
  entranceType: 'spin',
  entranceDuration: 0.9,
  entranceStagger: 0.07,
  entranceEase: 'back.out(1.4)',
  filterOnHover: true,
  defaultFiltered: true,
  className: '',
  cardClassName: '',
};

export const PROPS_DATA = [
  {
    name: 'images',
    type: 'string[]',
    def: '[...6 demo images]',
    desc: 'Array of image URLs to use for the carousel faces. Cycled with modulo if faceCount exceeds array length.'
  },
  {
    name: 'faceCount',
    type: 'number',
    def: '6',
    desc: 'Number of faces in the 3D wheel (clamped between 3 and 12).'
  },
  {
    name: 'faceWidth',
    type: 'number',
    def: '300',
    desc: 'Width of each face in pixels.'
  },
  {
    name: 'faceHeight',
    type: 'number',
    def: '300',
    desc: 'Height of each face in pixels.'
  },
  {
    name: 'maxFaceWidth',
    type: 'number',
    def: 'undefined',
    desc: 'Optional cap on the responsive face width. Defaults to faceWidth when not set.'
  },
  {
    name: 'minFaceWidth',
    type: 'number',
    def: '120',
    desc: 'Smallest the face will shrink to on tiny screens when responsive is enabled.'
  },
  {
    name: 'responsive',
    type: 'boolean',
    def: 'true',
    desc: 'Scale faces to fit the container width using a ResizeObserver, clamped between minFaceWidth and maxFaceWidth/faceWidth, preserving aspect ratio.'
  },
  {
    name: 'cardGap',
    type: 'number',
    def: '0',
    desc: 'Extra pixels added to the wheel radius to space faces apart. Positive values push faces further apart; negative values bring them closer/overlap.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    def: 'true',
    desc: 'Enable or disable drag-to-rotate interaction. When false, the wheel cannot be dragged (inertia is also disabled), though auto-rotate still works.'
  },
  {
    name: 'dragSensitivity',
    type: 'number',
    def: '1',
    desc: 'Multiplier applied to drag movement to control rotation speed while dragging.'
  },
  {
    name: 'shadeIntensity',
    type: 'number',
    def: '0.85',
    desc: 'Intensity of the opacity shading applied to faces based on their rotation angle.'
  },
  {
    name: 'shadeBase',
    type: 'number',
    def: '0.15',
    desc: 'Base/minimum opacity applied to faces regardless of angle.'
  },
  {
    name: 'autoRotate',
    type: 'boolean',
    def: 'false',
    desc: 'Enable continuous automatic rotation of the wheel.'
  },
  {
    name: 'autoRotateSpeed',
    type: 'number',
    def: '12',
    desc: 'Duration (seconds) for one full automatic rotation.'
  },
  {
    name: 'autoRotateDirection',
    type: 'number',
    def: '1',
    desc: 'Direction of auto-rotation: 1 for clockwise, -1 for counter-clockwise.'
  },
  {
    name: 'smoothness',
    type: 'number',
    def: '0.25',
    desc: 'Tween duration (seconds) used to smooth drag-based rotation updates.'
  },
  {
    name: 'inertia',
    type: 'boolean',
    def: 'true',
    desc: 'Whether the wheel continues spinning with momentum after a drag release.'
  },
  {
    name: 'inertiaResistance',
    type: 'number',
    def: '7',
    desc: 'Multiplier controlling how far the wheel spins from inertia after drag release.'
  },
  {
    name: 'pauseAutoRotateOnHover',
    type: 'boolean',
    def: 'true',
    desc: 'Pause automatic rotation while the pointer is hovering over the carousel.'
  },
  {
    name: 'initialRotation',
    type: 'number',
    def: '0',
    desc: 'Initial rotationY offset (in degrees) applied to the wheel on mount.'
  },
  {
    name: 'faceFit',
    type: '"cover" | "contain" | "fill"',
    def: '"cover"',
    desc: 'CSS background-size value used for each face image.'
  },
  {
    name: 'onFaceChange',
    type: '(index: number) => void',
    def: 'undefined',
    desc: 'Callback fired whenever the nearest-facing face index changes during rotation.'
  },
  {
    name: 'entranceAnimation',
    type: 'boolean',
    def: 'true',
    desc: 'Enable/disable the entrance animation played when the component first mounts.'
  },
  {
    name: 'entranceType',
    type: '"pop" | "fade" | "bottom" | "top" | "flip" | "scatter" | "spin" ',
    def: '"spin"',
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
    desc: 'Delay (in seconds) between each face animating in during entrance.'
  },
  {
    name: 'entranceEase',
    type: 'string',
    def: '"back.out(1.4)"',
    desc: 'GSAP ease string used for the entrance animation (e.g. "power2.out", "elastic.out(1, 0.5)").'
  },
  {
    name: 'filterOnHover',
    type: 'boolean',
    def: 'true',
    desc: 'Toggle the grayscale/dark filter on a face when hovering over it.'
  },
  {
    name: 'defaultFiltered',
    type: 'boolean',
    def: 'true',
    desc: 'Whether faces start with the grayscale/dark filter applied by default. Hovering inverts this state per face.'
  },
  {
    name: 'className',
    type: 'string',
    def: '""',
    desc: 'Custom class name applied to the outer wrapper div of the carousel.'
  },
  {
    name: 'cardClassName',
    type: 'string',
    def: '""',
    desc: 'Custom class name applied to each individual face (card) element, merged with the default "rc-face" class.'
  },
];

export const dep = [{ name: 'gsap', version: '3.15.0' }];

export const PKG_CMDS = {
  pnpm: 'pnpm add gsap',
  npm: 'npm install gsap',
  yarn: 'yarn add gsap',
  bun: 'bun add gsap'
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/RotatingCarousel-${variant}`,
  npm: `npx shadcn@latest add ${DOMAIN_URL}/r/RotatingCarousel-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/RotatingCarousel-${variant}`,
  bun: `bunx shadcn@latest add ${DOMAIN_URL}/r/RotatingCarousel-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/RotatingCarousel-${variant}`,
  npm: `npx jsrepo@latest add ${DOMAIN_URL}/r/RotatingCarousel-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/RotatingCarousel-${variant}`,
  bun: `bunx jsrepo@latest add ${DOMAIN_URL}/r/RotatingCarousel-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/Carousels/RotatingCarousel/RotatingCarousel?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Carousels/RotatingCarousel/RotatingCarousel?raw';
import TS_CSS_CODE from '../../variants/tsCss/Carousels/RotatingCarousel/RotatingCarousel?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Carousels/RotatingCarousel/RotatingCarousel?raw';
export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css': JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};