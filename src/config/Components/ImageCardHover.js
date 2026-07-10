import { DOMAIN_URL } from '../../constants/site';
import ImageCardHoverPrompt from '../../prompts/Components/ImageCardHover.txt?raw';
export { ImageCardHoverPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const SHAPES = ['rectangle', 'circle', 'diamond', 'hexagon'];

export const INITIAL_PROPS = {
  layerImages: [
    'https://picsum.photos/id/39/300/300',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=70',

  ],
  layerCount: 10,
  shapes: SHAPES,
  defaultShape: 'rectangle',
  width: 270,
  height: 300,
  initialRotation: false,
  initialBlur: false,
  initialColor: false,
  initialOpacity: false,
  initialParallax: false,
  initial3D: false,
  rounded: 20,
  tiltMax: 45,
  panMax: 88,
  depthStep: 36,
  scale3D: 0.07,
  opacityFalloff: 0.1,
  moveAmplify: 0.54,
  tiltBoost: 1.25,
  panBoost: 1.25,
  className: '',
};

export const PROPS_DATA = [
  {
    name: 'image',
    type: 'string',
    def: 'undefined (required)',
    desc: 'Fallback/base image URL used for the bottom-most layer, and for every layer when layerImages is not provided. The only prop with no safe default — omitting it logs a dev warning.'
  },
  {
    name: 'layerImages',
    type: 'string[]',
    def: '[]',
    desc: 'Array of image URLs to cycle through (via modulo) across the stacked layers. Falls back to `image` for every layer when empty.'
  },
  {
    name: 'layerCount',
    type: 'number',
    def: '10',
    desc: 'Number of stacked layers rendered behind the base image (clamped to at least 1). Controller setup re-runs whenever this changes.'
  },
  {
    name: 'shapes',
    type: '("rectangle" | "circle" | "diamond" | "hexagon")[]',
    def: '["rectangle", "circle", "diamond", "hexagon"]',
    desc: 'Set of clip-path shapes exposed as clickable swatches to reshape every layer above the base image.'
  },
  {
    name: 'defaultShape',
    type: '"rectangle" | "circle" | "diamond" | "hexagon"',
    def: '"rectangle"',
    desc: 'Clip-path shape applied to non-base layers on mount.'
  },
  {
    name: 'width',
    type: 'number | string',
    def: '600',
    desc: 'Width of the hover stage. Auto-clamped down at the 768px and 480px breakpoints for mobile.'
  },
  {
    name: 'height',
    type: 'number | string',
    def: '600',
    desc: 'Height of the hover stage. Auto-clamped down at the 768px and 480px breakpoints for mobile.'
  },
  {
    name: 'showShapeControls',
    type: 'boolean',
    def: 'true',
    desc: 'Show/hide the row of shape-swatch buttons below the stage.'
  },
  {
    name: 'showToggleControls',
    type: 'boolean',
    def: 'true',
    desc: 'Show/hide the rotation / blur / color / opacity / parallax / 3d toggle buttons.'
  },
  {
    name: 'showTuner',
    type: 'boolean',
    def: 'true',
    desc: 'Show/hide the tilt/pan/depth/amp slider panel that appears once 3D mode is enabled.'
  },
  {
    name: 'initialRotation',
    type: 'boolean',
    def: 'false',
    desc: 'Whether the "rotation" toggle starts enabled, applying alternating per-layer rotation while stacking/in 3D.'
  },
  {
    name: 'initialBlur',
    type: 'boolean',
    def: 'false',
    desc: 'Whether the "blur" toggle starts enabled, applying an increasing per-layer blur sequence.'
  },
  {
    name: 'initialColor',
    type: 'boolean',
    def: 'false',
    desc: 'Whether the "color" toggle starts enabled, desaturating/saturating layers based on depth index.'
  },
  {
    name: 'initialOpacity',
    type: 'boolean',
    def: 'false',
    desc: 'Whether the "opacity" toggle starts enabled, fading further-back layers more aggressively.'
  },
  {
    name: 'initialParallax',
    type: 'boolean',
    def: 'false',
    desc: 'Whether 2D mouse-follow parallax starts enabled. Mutually exclusive with 3D mode (enabling one disables the other).'
  },
  {
    name: 'initial3D',
    type: 'boolean',
    def: 'false',
    desc: 'Whether the true 3D tilt/depth/pan mode starts enabled. Mutually exclusive with parallax mode.'
  },
  {
    name: 'tiltMax',
    type: 'number',
    def: '45',
    desc: 'Base max tilt angle (degrees) used for the 3D rotateX/rotateY response to cursor position; live-tunable via the tuner slider (--lih-tilt-max).'
  },
  {
    name: 'panMax',
    type: 'number',
    def: '88',
    desc: 'Base max translation (px) applied to the stack while panning in 3D mode; live-tunable via the tuner slider (--lih-pan-max).'
  },
  {
    name: 'depthStep',
    type: 'number',
    def: '36',
    desc: 'Base per-layer Z translation (px) in 3D mode; live-tunable via the tuner slider (--lih-depth-step).'
  },
  {
    name: 'scale3D',
    type: 'number',
    def: '0.07',
    desc: 'Per-layer scale reduction applied on top of depth while in 3D mode (--lih-scale-3d).'
  },
  {
    name: 'opacityFalloff',
    type: 'number',
    def: '0.1',
    desc: 'Per-layer opacity reduction baseline used in 3D mode, independent of the opacity toggle (--lih-opacity-falloff).'
  },
  {
    name: 'moveAmplify',
    type: 'number',
    def: '0.54',
    desc: 'Multiplier amplifying tilt/pan response to cursor movement; live-tunable via the tuner slider (--lih-move-amplify, displayed x100).'
  },
  {
    name: 'tiltBoost',
    type: 'number',
    def: '1.25',
    desc: 'Extra multiplier stacked on top of tiltMax/moveAmplify when computing 3D rotation response.'
  },
  {
    name: 'panBoost',
    type: 'number',
    def: '1.25',
    desc: 'Extra multiplier stacked on top of panMax/moveAmplify when computing 3D pan response.'
  },
  {
    name: 'monoFontFamily',
    type: 'string',
    def: '"monospace"',
    desc: 'Font family used for the shape/toggle/tuner control labels (--lih-mono-font).'
  },
  {
    name: 'className',
    type: 'string',
    def: '""',
    desc: 'Custom class name applied to the outer wrapper div.'
  },
];

export const dep = [{ name: 'gsap', version: '3.12.5' }];

export const PKG_CMDS = {
  pnpm: 'pnpm add gsap',
  npm: 'npm install gsap',
  yarn: 'yarn add gsap',
  bun: 'bun add gsap'
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/ImageCardHover-${variant}`,
  npm: `npx shadcn@latest add ${DOMAIN_URL}/r/ImageCardHover-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/ImageCardHover-${variant}`,
  bun: `bunx shadcn@latest add ${DOMAIN_URL}/r/ImageCardHover-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/ImageCardHover-${variant}`,
  npm: `npx jsrepo@latest add ${DOMAIN_URL}/r/ImageCardHover-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/ImageCardHover-${variant}`,
  bun: `bunx jsrepo@latest add ${DOMAIN_URL}/r/ImageCardHover-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/Components/ImageCardHover/ImageCardHover?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Components/ImageCardHover/ImageCardHover?raw';
import TS_CSS_CODE from '../../variants/tsCss/Components/ImageCardHover/ImageCardHover?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Components/ImageCardHover/ImageCardHover?raw';
export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css': JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};