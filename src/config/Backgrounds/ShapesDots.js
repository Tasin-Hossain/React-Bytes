import { DOMAIN_URL } from '../../constants/site';
import ShapesDotsPrompt from '../../prompts/Backgrounds/ShapesDots.txt?raw';
export { ShapesDotsPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const SHAPES = ['circle', 'triangle', 'square'];

export const ANIMATION_MODES = [
  { value: 'off', label: 'Off' },
  { value: 'random', label: 'Random' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'ripple', label: 'Ripple' },
  { value: 'left-to-right', label: 'Left → Right' },
  { value: 'right-to-left', label: 'Right → Left' },
  { value: 'top-to-bottom', label: 'Top → Bottom' },
  { value: 'bottom-to-top', label: 'Bottom → Top' },
  { value: 'wave-horizontal', label: 'Wave Horizontal' },
  { value: 'wave-vertical', label: 'Wave Vertical' },
  { value: 'diagonal-tl-br', label: 'Diagonal ↘' },
  { value: 'diagonal-br-tl', label: 'Diagonal ↖' },
  { value: 'line-right', label: 'Line Right' },
  { value: 'line-left', label: 'Line Left' }
];

export const INITIAL_PROPS = {

  cellSize: 40,
  influenceRadiusVmin: 25,
  attackTime: 0.05,
  releaseTime: 0.2,
  idleScale: 0.10,

  minPeakScale: 1,
  maxPeakScale: 3,

  burstSpeed: 1200,
  burstThickness: 180,

  backgroundColor: 'transparent',
  shapes: ['circle', 'triangle', 'square'],
  // colors : DEFAULT_COLORS,

  dpr: 3,
  opacity: 1,

  animationMode: 'off',
  animationSpeed: 1,

  overlapGuard: 0.86
};

export const PROPS_DATA = [
  // Grid Layout
  { name: 'width', type: 'string | number', def: '"100%"', desc: 'Width of the canvas wrapper. Accepts any CSS value or number.' },
  { name: 'height', type: 'string | number', def: '"100%"', desc: 'Height of the canvas wrapper. Accepts any CSS value or number.' },
  { name: 'className', type: 'string', def: '""', desc: 'Additional Tailwind or CSS classes applied to the wrapper div.' },
  { name: 'cellSize', type: 'number', def: '40', desc: 'Pixel size of each grid cell. Smaller values produce more dots; larger values produce fewer.' },

  // Mouse Interaction
  { name: 'influenceRadiusVmin', type: 'number', def: '25', desc: 'Radius around the cursor within which shapes react, expressed in vmin (percentage of the viewport\'s smaller dimension).' },
  { name: 'attackTime', type: 'number', def: '0.05', desc: 'Time in seconds for a shape to grow. Lower values snap instantly; higher values grow gradually.' },
  { name: 'releaseTime', type: 'number', def: '0.6', desc: 'Time in seconds for a shape to shrink back to idle after the cursor leaves.' },

  // Scale / Size
  { name: 'idleScale', type: 'number', def: '0.09', desc: 'Resting scale of shapes when not influenced. 0 is invisible; 1 is full base size.' },
  { name: 'minPeakScale', type: 'number', def: '1', desc: 'Minimum scale a shape can reach at peak (lower bound of the per-cell random range). Must be less than or equal to maxPeakScale.' },
  { name: 'maxPeakScale', type: 'number', def: '3', desc: 'Maximum scale a shape can reach at peak (upper bound of the per-cell random range). Must be greater than or equal to minPeakScale.' },
  { name: 'overlapGuard', type: 'number', def: '0.86', desc: 'Safety margin that prevents adjacent shapes from touching at max scale. 1 allows shapes to just touch; lower values add more gap.' },

  // Click Burst
  { name: 'burstSpeed', type: 'number', def: '1200', desc: 'Speed at which the click burst ring expands, in pixels per second.' },
  { name: 'burstThickness', type: 'number', def: '180', desc: 'Thickness of the click burst ring in pixels. Higher values produce a wider ring.' },

  // Visuals
  { name: 'backgroundColor', type: 'string', def: '"#080808"', desc: 'Background color of the canvas. Set to "transparent" to skip drawing a background.' },
  { name: 'shapes', type: 'string[]', def: '["circle","triangle","square"]', desc: 'Pool of shape types randomly assigned to cells. Available values: "circle", "square", "triangle".' },
  { name: 'colors', type: '(string | { stops: string[] })[]', def: 'DEFAULT_COLORS', desc: 'Pool of colors randomly assigned to shapes. Accepts plain hex strings or gradient objects ({ stops: ["#color1", "#color2"] }).' },
  { name: 'opacity', type: 'number', def: '1', desc: 'Global opacity of the entire canvas. 0 is fully transparent; 1 is fully opaque.' },
  { name: 'dpr', type: 'number', def: '3', desc: 'Maximum device pixel ratio cap. Higher values are sharper but more GPU-intensive.' },

  // Ambient Animation
  { name: 'animationMode', type: 'string', def: '"off"', desc: 'Continuous ambient animation pattern that runs independently of the cursor. Options: "off" | "random" | "pulse" | "ripple" | "left-to-right" | "right-to-left" | "top-to-bottom" | "bottom-to-top" | "wave-horizontal" | "wave-vertical" | "diagonal-tl-br" | "diagonal-br-tl" | "line-right" | "line-left".' },
  { name: 'animationSpeed', type: 'number', def: '1', desc: 'Speed multiplier for the ambient animation. 2 = double speed; 0.5 = half speed.' },

  // Children
  { name: 'children', type: 'ReactNode', def: 'undefined', desc: 'Content rendered absolutely on top of the canvas, useful for text overlays or UI elements.' },
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: null,
  npm: null,
  yarn: null,
  bun: null
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/ShapesDots-${variant}`,
  npm: `npx shadcn@latest add ${DOMAIN_URL}/r/ShapesDots-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/ShapesDots-${variant}`,
  bun: `bunx shadcn@latest add ${DOMAIN_URL}/r/ShapesDots-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/ShapesDots-${variant}`,
  npm: `npx jsrepo@latest add ${DOMAIN_URL}/r/ShapesDots-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/ShapesDots-${variant}`,
  bun: `bunx jsrepo@latest add ${DOMAIN_URL}/r/ShapesDots-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/Backgrounds/ShapesDots/ShapesDots?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/ShapesDots/ShapesDots?raw';
import TS_CSS_CODE from '../../variants/tsCss/Backgrounds/ShapesDots/ShapesDots?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/ShapesDots/ShapesDots?raw';

export { JS_CSS_CODE };
export { JS_TAILWIND_CODE };
export { TS_CSS_CODE };
export { TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css': JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};