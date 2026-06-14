import MouseRepelGridPrompt from '../../prompts/Backgrounds/MouseRepelGrid.txt?raw';
export { MouseRepelGridPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const COLOR_MODE_OPTIONS = [
  { value: 'solid',    label: 'Solid'    },
  { value: 'gradient', label: 'Gradient' },
  { value: 'rainbow',  label: 'Rainbow'  },
];

export const GRADIENT_DIR_OPTIONS = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical',   label: 'Vertical'   },
  { value: 'diagonal',   label: 'Diagonal'   },
  { value: 'radial',     label: 'Radial'     },
];

export const ANIMATION_MODE_OPTIONS = [
  { value: 'none',        label: 'None'        },
  { value: 'breathing',   label: 'Breathing'   },
  { value: 'pulse-glow',  label: 'Pulse Glow'  },
  { value: 'shimmer',     label: 'Shimmer'     },
  { value: 'auto-ripple', label: 'Auto Ripple' },
];

export const INITIAL_PROPS = {
  // Grid layout
  gridSpacing:           28,
  curveStrength:         0,
  diagonals:             false,

  // Repel physics
  repelRadius:           100,
  force:                 14,
  easeSpeed:             0.1,
  damping:               0.85,
  springK:               0.08,

  // Idle motion
  waveAmplitude:         0,
  waveSpeed:             1,
  ambientNoise:          false,
  ambientNoiseAmplitude: 4,
  ambientNoiseSpeed:     0.3,

  // Animation
  animationMode:         'none',
  animationSpeed:        1,
  animationIntensity:    1,

  // Line appearance
  lineWidth:             1.8,
  glowIntensity:         0.7,
  glowBlur:              0,

  // Colors
  lineColor:             '#a855f7',
  glowColor:             '#b8a0ff',
  backgroundColor:       'transparent',

  // Color mode
  colorMode:             'solid',
  gradientColors:        ['#5a4cff', '#d35af8'],
  gradientDirection:     'horizontal',
  rainbowSpeed:          0.2,
  rainbowSaturation:     0.7,
  rainbowLightness:      0.6,

  // Vignette
  vignette:              false,
  vignetteStrength:      0.6,

  // Interaction
  pulseOnClick:          true,

};

export const PROPS_DATA = [
  // Grid layout
  { name: 'gridSpacing',           type: 'number',   def: '28',                          desc: 'Pixel distance between grid intersection points.' },
  { name: 'curveStrength',         type: 'number',   def: '0',                           desc: 'Barrel-distortion amount applied to the resting grid (0 = flat).' },
  { name: 'diagonals',             type: 'boolean',  def: 'false',                       desc: 'Draw diagonal lines across each grid cell.' },


  // Repel physics
  { name: 'repelRadius',           type: 'number',   def: '100',                         desc: 'Cursor influence radius in pixels.' },
  { name: 'force',                 type: 'number',   def: '14',                          desc: 'Maximum pixel displacement applied at the cursor centre.' },
  { name: 'easeSpeed',             type: 'number',   def: '0.1',                         desc: 'Lerp factor per frame — higher = snappier response.' },
  { name: 'damping',               type: 'number',   def: '0.85',                        desc: 'Velocity damping per frame (0–1). Lower = bouncier.' },
  { name: 'springK',               type: 'number',   def: '0.08',                        desc: 'Spring constant that pulls nodes back to their origin.' },

  // Idle motion
  { name: 'waveAmplitude',         type: 'number',   def: '0',                           desc: 'Vertical wave offset amplitude in pixels (0 = disabled).' },
  { name: 'waveSpeed',             type: 'number',   def: '1',                           desc: 'Speed multiplier for the wave animation.' },
  { name: 'ambientNoise',          type: 'boolean',  def: 'false',                       desc: 'Add per-node sinusoidal noise for an organic breathing look.' },
  { name: 'ambientNoiseAmplitude', type: 'number',   def: '4',                           desc: 'Pixel amplitude of the ambient noise.' },
  { name: 'ambientNoiseSpeed',     type: 'number',   def: '0.3',                         desc: 'Speed multiplier of the ambient noise oscillation.' },

  // Animation
  { name: 'animationMode',         type: '"none" | "breathing" | "pulse-glow" | "shimmer" | "auto-ripple"', def: '"none"', desc: 'Idle animation applied to the grid continuously.' },
  { name: 'animationSpeed',        type: 'number',   def: '1',                           desc: 'Speed multiplier for the chosen animation mode.' },
  { name: 'animationIntensity',    type: 'number',   def: '1',                           desc: 'Intensity / amplitude multiplier for the chosen animation mode.' },

  // Line appearance
  { name: 'lineWidth',             type: 'number',   def: '1',                           desc: 'Base stroke width in pixels.' },
  { name: 'glowIntensity',         type: 'number',   def: '0.7',                         desc: 'Glow brightness near the cursor (0–1).' },
  { name: 'glowBlur',              type: 'number',   def: '0',                           desc: 'Canvas shadowBlur radius for a soft bloom effect (0 = disabled).' },

  // Colors
  { name: 'lineColor',             type: 'string',   def: '"#5a4cff"',                   desc: 'Base line colour (hex / rgb / CSS variable).' },
  { name: 'glowColor',             type: 'string',   def: '"#b8a0ff"',                   desc: 'Line colour at maximum glow intensity.' },
  { name: 'backgroundColor',       type: 'string',   def: '"transparent"',               desc: 'Canvas background. Use "transparent" to inherit the parent background.' },

  // Color mode
  { name: 'colorMode',             type: '"solid" | "gradient" | "rainbow"', def: '"solid"', desc: 'Line colour strategy.' },
  { name: 'gradientColors',        type: 'string[]', def: '["#5a4cff","#d35af8"]',       desc: 'Two or more hex stops used when colorMode is "gradient".' },
  { name: 'gradientDirection',     type: '"horizontal" | "vertical" | "diagonal" | "radial"', def: '"horizontal"', desc: 'Direction of the gradient or rainbow sweep.' },
  { name: 'rainbowSpeed',          type: 'number',   def: '0.2',                         desc: 'Hue cycle speed when colorMode is "rainbow".' },
  { name: 'rainbowSaturation',     type: 'number',   def: '0.7',                         desc: 'HSL saturation for rainbow mode (0–1).' },
  { name: 'rainbowLightness',      type: 'number',   def: '0.6',                         desc: 'HSL lightness for rainbow mode (0–1).' },

  // Vignette
  { name: 'vignette',              type: 'boolean',  def: 'false',                       desc: 'Overlay a radial vignette that fades toward the edges.' },
  { name: 'vignetteStrength',      type: 'number',   def: '0.6',                         desc: 'Vignette opacity (0–1).' },

  // Interaction
  { name: 'pulseOnClick',          type: 'boolean',  def: 'false',                       desc: 'Emit a ripple pulse outward from the click position.' },

  // Passthrough
  { name: 'className',             type: 'string',   def: '""',                          desc: 'Extra CSS classes forwarded to the wrapper div.' },
  { name: 'style',                 type: 'object',   def: '{}',                          desc: 'Inline styles forwarded to the wrapper div.' },
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: null,
  npm:  null,
  yarn: null,
  bun:  null,
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
  npm:  `npx shadcn@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
  yarn: `yarn shadcn@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
  bun:  `bunx shadcn@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
  npm:  `npx jsrepo@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
  yarn: `yarn jsrepo@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
  bun:  `bunx jsrepo@latest add https://reactbytes.dev/r/MouseRepelGrid-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/Backgrounds/MouseRepelGrid/MouseRepelGrid?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/MouseRepelGrid/MouseRepelGrid?raw';
import TS_CSS_CODE      from '../../variants/tsCss/Backgrounds/MouseRepelGrid/MouseRepelGrid?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/MouseRepelGrid/MouseRepelGrid?raw';

export { JS_CSS_CODE };
export { JS_TAILWIND_CODE };
export { TS_CSS_CODE };
export { TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css':       JS_CSS_CODE,
  'js-tailwind':  JS_TAILWIND_CODE,
  'ts-css':       TS_CSS_CODE,
  'ts-tailwind':  TS_TAILWIND_CODE,
};