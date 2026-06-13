import MouseRepelDotsPrompt from '../../prompts/Backgrounds/MouseRepelDots.txt?raw';
export { MouseRepelDotsPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const DOT_COLOR_OPTIONS = [
  { value: '#7a5af8', label: 'Violet' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Emerald' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ef4444', label: 'Red' }
];

export const REPEL_RADIUS_OPTIONS = [
  { value: 40, label: '40px' },
  { value: 80, label: '80px' },
  { value: 120, label: '120px' },
  { value: 160, label: '160px' }
];

export const FORCE_OPTIONS = [
  { value: 2, label: '2' },
  { value: 5.5, label: '5.5' },
  { value: 9, label: '9' },
  { value: 14, label: '14' }
];

export const SPRING_K_OPTIONS = [
  { value: 0.03, label: '0.03' },
  { value: 0.07, label: '0.07' },
  { value: 0.12, label: '0.12' },
  { value: 0.2, label: '0.20' }
];

export const DAMPING_OPTIONS = [
  { value: 0.55, label: '0.55' },
  { value: 0.72, label: '0.72' },
  { value: 0.85, label: '0.85' },
  { value: 0.95, label: '0.95' }
];

export const DOT_SPACING_OPTIONS = [
  { value: 10, label: '10px' },
  { value: 22, label: '22px' },
  { value: 35, label: '35px' },
  { value: 50, label: '50px' }
];

export const DOT_RADIUS_OPTIONS = [
  { value: 1, label: '1px' },
  { value: 1.6, label: '1.6px' },
  { value: 2.5, label: '2.5px' },
  { value: 4, label: '4px' }
];

export const MAX_DOT_SIZE_OPTIONS = [
  { value: 3, label: '3px' },
  { value: 6, label: '6px' },
  { value: 10, label: '10px' },
  { value: 16, label: '16px' }
];

export const SPARKLE_MODE_OPTIONS = [
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
  dotRadius: 1.6,
  dotSpacing: 22,
  repelRadius: 80,
  force: 5.5,
  springK: 0.07,
  damping: 0.72,
  maxDotSize: 6,
  dotColor: '#7a5af8',
  dotColorMid: '#d35af8',
  dotColorHot: '#ffffff',
  backgroundColor: 'transparent',
  gradientFrom: null,
  gradientTo: null,
  bulgeOnly: false,
  bulgeStrength: 30,
  waveAmplitude: 4,
  sparkleMode: 'ripple',
  sparkleColor: '#d35af8',
  sparkleSize: 1.6,
  sparkleSpeed: 0.4,
  sparkleDensity: 0.015
};

export const PROPS_DATA = [
  { name: 'dotRadius', type: 'number', def: '1.6', desc: 'Base radius (px) of each dot in its resting state.' },
  { name: 'dotSpacing', type: 'number', def: '22', desc: 'Gap in px between adjacent dots in the grid.' },
  {
    name: 'repelRadius',
    type: 'number',
    def: '80',
    desc: 'Radius (px) around the cursor within which dots are repelled.'
  },
  {
    name: 'force',
    type: 'number',
    def: '5.5',
    desc: 'Strength of the repulsion force applied to dots near the cursor.'
  },
  {
    name: 'springK',
    type: 'number',
    def: '0.07',
    desc: 'Spring constant — how strongly each dot snaps back to its origin.'
  },
  {
    name: 'damping',
    type: 'number',
    def: '0.72',
    desc: 'Velocity damping factor applied each frame (0–1). Lower = bouncier.'
  },
  { name: 'maxDotSize', type: 'number', def: '6', desc: 'Maximum dot radius (px) when fully displaced by the cursor.' },
  {
    name: 'dotColor',
    type: 'string',
    def: '"#7a5af8"',
    desc: 'Base dot color used in the resting / low-energy state.'
  },
  { name: 'dotColorMid', type: 'string', def: '"#d35af8"', desc: 'Mid-energy dot color shown at medium displacement.' },
  {
    name: 'dotColorHot',
    type: 'string',
    def: '"#ffffff"',
    desc: 'High-energy dot color for dots closest to the cursor.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    def: '"transparent"',
    desc: 'Canvas background fill. Use "transparent" to inherit the parent background.'
  },
  {
    name: 'gradientFrom',
    type: 'string',
    def: 'null',
    desc: 'Start color of a diagonal linear gradient that overrides dotColor/dotColorMid/dotColorHot.'
  },
  {
    name: 'gradientTo',
    type: 'string',
    def: 'null',
    desc: 'End color of the diagonal linear gradient. Both gradientFrom and gradientTo must be set.'
  },
  {
    name: 'bulgeOnly',
    type: 'boolean',
    def: 'false',
    desc: 'When true, dots push outward smoothly instead of flying with spring physics.'
  },
  {
    name: 'bulgeStrength',
    type: 'number',
    def: '30',
    desc: 'Outward push distance (px) used when bulgeOnly is enabled.'
  },
  {
    name: 'waveAmplitude',
    type: 'number',
    def: '0',
    desc: 'Amplitude (px) of a continuous ambient sine-wave ripple across the grid. 0 disables it.'
  },
  {
    name: 'sparkleMode',
    type: '"off" | "random" | "pulse" | "ripple" others..',
    def: '"off"',
    desc: 'Pattern used to light up sparkle dots across the grid.'
  },
  { name: 'sparkleColor', type: 'string', def: '"#d35af8"', desc: 'Color applied to dots when they sparkle.' },
  {
    name: 'sparkleSize',
    type: 'number',
    def: '1.6',
    desc: 'Size multiplier applied to a dot at peak sparkle intensity.'
  },
  {
    name: 'sparkleSpeed',
    type: 'number',
    def: '0.4',
    desc: 'Playback speed of sparkle animations. Higher = faster sweep/pulse.'
  },
  {
    name: 'sparkleDensity',
    type: 'number',
    def: '0.015',
    desc: 'Fraction of dots that sparkle simultaneously in random mode (0–1).'
  },
  { name: 'className', type: 'string', def: '""', desc: 'Extra CSS classes forwarded to the wrapper div.' }
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: null,
  npm: null,
  yarn: null,
  bun: null
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add https://reactbytes.dev/r/MouseRepelDots-${variant}`,
  npm: `npx shadcn@latest add https://reactbytes.dev/r/MouseRepelDots-${variant}`,
  yarn: `yarn shadcn@latest add https://reactbytes.dev/r/MouseRepelDots-${variant}`,
  bun: `bunx shadcn@latest add https://reactbytes.dev/r/MouseRepelDots-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add https://reactbytes.dev/r/MouseRepelDots-${variant}`,
  npm: `npx jsrepo@latest add https://reactbytes.dev/r/MouseRepelDots-${variant}`,
  yarn: `yarn jsrepo@latest add https://reactbytes.dev/r/MouseRepelDots-${variant}`,
  bun: `bunx jsrepo@latest add https://reactbytes.dev/r/MouseRepelDots-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/Backgrounds/MouseRapeldots/MouseRepelDots';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/MouseRapeldots/MouseRepelDots';
import TS_CSS_CODE from '../../variants/tsCss/Backgrounds/MouseRapeldots/MouseRepelDots';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/MouseRapeldots/MouseRepelDots';

export { JS_CSS_CODE };
export { JS_TAILWIND_CODE };
export { TS_CSS_CODE };
export { TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  js: JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};
