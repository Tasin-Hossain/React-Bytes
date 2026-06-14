import MouseRepelGridPrompt from '../../prompts/Backgrounds/MouseRepelGrid.txt?raw';
export { MouseRepelGridPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const COLOR_MODE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'rainbow', label: 'Rainbow' }
];

export const GRADIENT_DIRECTION_OPTIONS = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'diagonal', label: 'Diagonal' },
  { value: 'radial', label: 'Radial' }
];

export const ANIMATION_MODE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'breathing', label: 'Breathing' },
  { value: 'pulse-glow', label: 'Pulse Glow' },
  { value: 'shimmer', label: 'Shimmer' },
  { value: 'auto-ripple', label: 'Auto Ripple' }
];

export const INITIAL_PROPS = {
  gridSpacing: 28,
  curveStrength: 0,
  repelRadius: 100,
  force: 14,
  easeSpeed: 0.1,
  damping: 0.9,
  springK: 0.08,
  waveAmplitude: 0,
  ambientNoise: false,
  ambientNoiseAmplitude: 4,
  ambientNoiseSpeed: 0.3,
  lineWidth: 1,
  glowIntensity: 0.7,
  lineColor: '#5a4cff',
  glowColor: '#b8a0ff',
  backgroundColor: 'var(--bg)',
  diagonals: false,
  colorMode: 'solid',
  gradientColors: ['#5a4cff', '#d35af8'],
  gradientDirection: 'horizontal',
  rainbowSpeed: 0.2,
  rainbowSaturation: 0.7,
  rainbowLightness: 0.6,
  vignette: false,
  vignetteStrength: 0.6,
  animationMode: 'none',
  animationSpeed: 1,
  animationIntensity: 1,
  pulseOnClick: true
};

export const PROPS_DATA = [
  { name: 'gridSpacing', type: 'number', def: '28', desc: 'Gap in px between adjacent grid nodes.' },
  { name: 'curveStrength', type: 'number', def: '0', desc: 'Bows the grid outward from center; higher values increase the curve.' },
  { name: 'repelRadius', type: 'number', def: '100', desc: 'Radius (px) around the cursor within which nodes are repelled.' },
  { name: 'force', type: 'number', def: '14', desc: 'Strength of the push applied to nodes near the cursor.' },
  { name: 'easeSpeed', type: 'number', def: '0.1', desc: 'How quickly nodes ease toward their target position each frame.' },
  { name: 'damping', type: 'number', def: '0.9', desc: 'Velocity damping factor applied each frame (0–1). Lower = bouncier.' },
  { name: 'springK', type: 'number', def: '0.08', desc: 'Spring constant — how strongly each node snaps back to its origin.' },
  { name: 'waveAmplitude', type: 'number', def: '0', desc: 'Amplitude (px) of a continuous ambient sine-wave ripple across the grid. 0 disables it.' },
  { name: 'ambientNoise', type: 'boolean', def: 'false', desc: 'Enables subtle idle drift of nodes independent of the cursor.' },
  { name: 'ambientNoiseAmplitude', type: 'number', def: '4', desc: 'Amplitude (px) of the ambient idle drift.' },
  { name: 'ambientNoiseSpeed', type: 'number', def: '0.3', desc: 'Speed of the ambient idle drift.' },
  { name: 'lineWidth', type: 'number', def: '1', desc: 'Base width/point size of the grid lines and nodes.' },
  { name: 'glowIntensity', type: 'number', def: '0.7', desc: 'Maximum glow strength applied to nodes near the cursor or during animations.' },
  { name: 'lineColor', type: 'string', def: '"#5a4cff"', desc: 'Base color of the grid lines in solid color mode. Accepts hex or CSS var().' },
  { name: 'glowColor', type: 'string', def: '"#b8a0ff"', desc: 'Color blended into nodes/lines as glow intensity increases. Accepts hex or CSS var().' },
  { name: 'backgroundColor', type: 'string', def: '"#050310"', desc: 'Canvas background fill color. Accepts hex, CSS var(), or "transparent".' },
  { name: 'diagonals', type: 'boolean', def: 'false', desc: 'When true, adds diagonal connecting lines between grid nodes.' },
  { name: 'colorMode', type: '"solid" | "gradient" | "rainbow"', def: '"solid"', desc: 'Determines how node/line colors are computed.' },
  { name: 'gradientColors', type: 'string[]', def: "['#5a4cff', '#d35af8']", desc: 'Array of hex colors used for multi-stop gradient interpolation.' },
  { name: 'gradientDirection', type: '"horizontal" | "vertical" | "diagonal" | "radial"', def: '"horizontal"', desc: 'Direction used to compute the gradient/rainbow position factor.' },
  { name: 'rainbowSpeed', type: 'number', def: '0.2', desc: 'Speed at which the rainbow hue cycles over time.' },
  { name: 'rainbowSaturation', type: 'number', def: '0.7', desc: 'Saturation (0–1) used for rainbow color mode.' },
  { name: 'rainbowLightness', type: 'number', def: '0.6', desc: 'Lightness (0–1) used for rainbow color mode.' },
  { name: 'vignette', type: 'boolean', def: 'false', desc: 'Enables a darkened vignette overlay around the canvas edges.' },
  { name: 'vignetteStrength', type: 'number', def: '0.6', desc: 'Opacity strength of the vignette overlay.' },
  { name: 'animationMode', type: '"none" | "breathing" | "pulse-glow" | "shimmer" | "auto-ripple"', def: '"none"', desc: 'Idle animation pattern that plays automatically.' },
  { name: 'animationSpeed', type: 'number', def: '1', desc: 'Playback speed multiplier for the idle animation.' },
  { name: 'animationIntensity', type: 'number', def: '1', desc: 'Strength multiplier for the idle animation effect.' },
  { name: 'pulseOnClick', type: 'boolean', def: 'false', desc: 'When true, clicking the canvas emits an expanding ripple pulse from the click point.' },
  { name: 'className', type: 'string', def: '""', desc: 'Extra CSS classes forwarded to the wrapper div.' },
  { name: 'style', type: 'object', def: '{}', desc: 'Inline style object forwarded to the wrapper div.' },
];

export const dep = ['ogl'];

export const PKG_CMDS = {
  pnpm: 'pnpm add ogl',
  npm: 'npm install ogl',
  yarn: 'yarn add ogl',
  bun: 'bun add ogl'
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
  npm: `npx shadcn@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
  yarn: `yarn shadcn@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
  bun: `bunx shadcn@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
  npm: `npx jsrepo@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
  yarn: `yarn jsrepo@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
  bun: `bunx jsrepo@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/Backgrounds/MouseRepelGrid/MouseRepelGrid?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/MouseRepelGrid/MouseRepelGrid?raw';
import TS_CSS_CODE from '../../variants/tsCss/Backgrounds/MouseRepelGrid/MouseRepelGrid?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/MouseRepelGrid/MouseRepelGrid?raw';

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