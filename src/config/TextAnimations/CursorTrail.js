import CursorTrailPrompt from '../../prompts/TextAnimations/CursorTrail.txt?raw';
export { CursorTrailPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const STYLE_OPTIONS = [
  { value: 'fade',    label: 'Fade'    },
  { value: 'float',   label: 'Float'   },
  { value: 'shrink',  label: 'Shrink'  },
  { value: 'spin',    label: 'Spin'    },
  { value: 'scatter', label: 'Scatter' },
];

export const SPACING_OPTIONS = [
  { value: 15, label: '15px' },
  { value: 30, label: '30px' },
  { value: 50, label: '50px' },
  { value: 80, label: '80px' },
];

export const EXIT_DURATION_OPTIONS = [
  { value: 0.2, label: '0.2s' },
  { value: 0.4, label: '0.4s' },
  { value: 0.6, label: '0.6s' },
  { value: 1,   label: '1s'   },
];

export const REMOVAL_INTERVAL_OPTIONS = [
  { value: 20,  label: '20ms'  },
  { value: 30,  label: '30ms'  },
  { value: 50,  label: '50ms'  },
  { value: 100, label: '100ms' },
];

export const MAX_POINTS_OPTIONS = [
  { value: 6,  label: '6'  },
  { value: 12, label: '12' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
];

export const MIN_SIZE_OPTIONS = [
  { value: 12, label: '12px' },
  { value: 16, label: '16px' },
  { value: 20, label: '20px' },
  { value: 28, label: '28px' },
  { value: 36, label: '36px' },
];

export const MAX_SIZE_OPTIONS = [
  { value: 32, label: '32px' },
  { value: 48, label: '48px' },
  { value: 64, label: '64px' },
  { value: 80, label: '80px' },
  { value: 96, label: '96px' },
];

export const INITIAL_PROPS = {
  trailText:           '✦',
  style:               'shrink',
  color:               '#ffffff',
  colors:              ['#ff6b6b', '#f7c948', '#4ecdc4', '#a78bfa'],
  spacing:             60,
  minSize:             20,
  maxSize:             48,
  exitDuration:        0.4,
  removalInterval:     30,
  maxPoints:           12,
  followMouseDirection: false,
  randomFloat:         false,
};

export const PROPS_DATA = [
  { name: 'trailText',            type: 'string',    def: '"✦"',    desc: 'Characters or emojis that spawn as trail particles.'                              },
  { name: 'style',       type: '"fade" | "float" | "shrink" | "spin" | "scatter"', def: '"fade"',  desc: 'Particle animation style.' },
  { name: 'color',                type: 'string',    def: '"#a889c7"', desc: 'Fallback color for particles when colors array is not provided.'               },
  { name: 'colors',               type: 'string[]',  def: 'undefined', desc: 'Array of colors cycled through particles. Overrides color when provided.'     },
  { name: 'spacing',              type: 'number',    def: '30',     desc: 'Minimum distance in px the cursor must travel before a new particle spawns.'      },
  { name: 'minSize',              type: 'number',    def: '20',     desc: 'Minimum font size (px) of spawned particles.'                                     },
  { name: 'maxSize',              type: 'number',    def: '48',     desc: 'Maximum font size (px) of spawned particles.'                                     },
  { name: 'exitDuration',         type: 'number',    def: '0.4',    desc: 'Duration in seconds for each particle fade-out animation.'                       },
  { name: 'removalInterval',      type: 'number',    def: '30',     desc: 'Interval in ms between removing trail items when the cursor stops moving.'        },
  { name: 'maxPoints',            type: 'number',    def: '12',     desc: 'Maximum number of trail particles visible at once.'                               },
  { name: 'followMouseDirection', type: 'boolean',   def: 'false',  desc: 'When true, each particle rotates to match the direction the cursor is moving.'   },
  { name: 'randomFloat',          type: 'boolean',   def: 'true',   desc: 'When true, particles drift with a random floating offset after spawning.'        },
  { name: 'className',            type: 'string',    def: '""',     desc: 'Extra classes forwarded to the wrapper element.'                                  },
  { name: 'children',             type: 'ReactNode', def: 'undefined', desc: 'Content to wrap. The trail activates anywhere inside this area.'              },
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: null,
  npm:  null,
  yarn: null,
  bun:  null,
};

export const getShadcnCmds = (variant) => ({
  pnpm: `pnpm dlx shadcn@latest add https://reactbytes.dev/r/CursorTrail-${variant}`,
  npm:  `npx shadcn@latest add https://reactbytes.dev/r/CursorTrail-${variant}`,
  yarn: `yarn shadcn@latest add https://reactbytes.dev/r/CursorTrail-${variant}`,
  bun:  `bunx shadcn@latest add https://reactbytes.dev/r/CursorTrail-${variant}`,
});

export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add https://reactbytes.dev/r/CursorTrail-${variant}`,
  npm:  `npx jsrepo@latest add https://reactbytes.dev/r/CursorTrail-${variant}`,
  yarn: `yarn jsrepo@latest add https://reactbytes.dev/r/CursorTrail-${variant}`,
  bun:  `bunx jsrepo@latest add https://reactbytes.dev/r/CursorTrail-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/CursorTrail/CursorTrail';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/CursorTrail/CursorTrail';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/CursorTrail/CursorTrail';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/CursorTrail/CursorTrail';

export { JS_CSS_CODE };
export { JS_TAILWIND_CODE };
export { TS_CSS_CODE };
export { TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js':          JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css':      TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE,
};