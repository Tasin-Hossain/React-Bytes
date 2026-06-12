
import CurtainTextPrompt from '../../prompts/TextAnimations/CurtainText.txt?raw';
export { CurtainTextPrompt };

// ─── Author 
export const AUTHOR_NAME = 'Mohammad Tasin';

// ─── Select Options

export const DIRECTION_OPTIONS = [
  { value: 'up',   label: 'Up'   },
  { value: 'down', label: 'Down' },
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
];

export const FONT_SIZE_OPTIONS = [
  { value: 'clamp(36px, 10vw, 72px)', label: 'Default (clamp)' },
  { value: '48px',  label: '48px'  },
  { value: '64px',  label: '64px'  },
  { value: '80px',  label: '80px'  },
  { value: '96px',  label: '96px'  },
  { value: '112px', label: '112px' },
];


export const STAGGER_OPTIONS = [
  { value: 0,   label: '0ms'   },
  { value: 30,  label: '30ms'  },
  { value: 60,  label: '60ms'  },
  { value: 90,  label: '90ms'  },
  { value: 120, label: '120ms' },
  { value: 160, label: '160ms' },
];

export const DURATION_OPTIONS = [
  { value: 200, label: '200ms' },
  { value: 300, label: '300ms' },
  { value: 400, label: '400ms' },
  { value: 500, label: '500ms' },
  { value: 600, label: '600ms' },
  { value: 800, label: '800ms' },
];

export const EASING_OPTIONS = [
  { value: 'cubic-bezier(.77,0,.18,1)',    label: 'Quart InOut' },
  { value: 'cubic-bezier(.34,1.56,.64,1)', label: 'Back Out'   },
  { value: 'cubic-bezier(.23,1,.32,1)',    label: 'Expo Out'   },
  { value: 'ease-in-out',                  label: 'Ease InOut' },
  { value: 'linear',                       label: 'Linear'     },
];



export const INITIAL_PROPS = {
  text:          'CURTAIN',
  direction:     'up',
  baseColor:     '#ff2d6b',
  activeColor:   '#ffffff',
  fontSize:      'clamp(36px, 10vw, 72px)',
  fontWeight:    '900',
  staggerMs:     60,
  durationMs:    400,
  easing:        'cubic-bezier(.34,1.56,.64,1)',
  resetOnLeave:  true,
  align:         'center',
};

// ─── Props Documentation 

export const PROPS_DATA = [
  // TEXT
  { name: 'text',           type: 'string',        def: '"CURTAIN"',                    desc: 'The text to display.'                                                  },
  // ANIMATION
  { name: 'direction',      type: '"up" | "down" | "left" | "right"', def: '"up"',                         desc: 'Direction chars slide OUT on hover. Reveal enters from opposite.'      },
  { name: 'resetOnLeave',   type: 'boolean',       def: 'true',                         desc: 'If false, the animation stays in its hovered state once triggered.'    },
  { name: 'staggerMs',      type: 'number',        def: '60',                           desc: 'Delay (ms) added per character for the stagger effect.'                },
  { name: 'durationMs',     type: 'number',        def: '400',                          desc: 'Duration (ms) of each character\'s slide transition.'                  },
  { name: 'easing',         type: 'string',        def: '"cubic-bezier(.77,0,.18,1)"',  desc: 'CSS easing / timing function string for the transition.'               },
  // COLORS
  { name: 'baseColor',      type: 'string',        def: '"#ffffff"',                    desc: 'CSS color value for the resting base layer.'                           },
  { name: 'activeColor',    type: 'string',        def: '"#a889c7"',                    desc: 'CSS color value for the incoming reveal layer.'                        },
  // TYPOGRAPHY
  { name: 'fontClass',      type: 'string',        def: '"font-black"',                 desc: 'Tailwind font-weight class applied to both layers. (TW variants only)' },
  { name: 'fontWeight',     type: 'string',        def: '"900"',                        desc: 'CSS font-weight applied to both layers. (CSS variants only)'           },
  { name: 'fontSize',       type: 'string',        def: '"clamp(1.5rem, 6vw, 5rem)"',  desc: 'CSS font-size value applied to both layers.'                           },
  { name: 'letterSpacing',  type: 'string',        def: '"0.1em"',                      desc: 'CSS letter-spacing value. (CSS variants only)'                         },
  { name: 'tracking',       type: 'string',        def: '"tracking-widest"',            desc: 'Tailwind letter-spacing class. (TW variants only)'                     },
  { name: 'textClassName',  type: 'string',        def: '""',                           desc: 'Extra classes for the base layer. Supports Tailwind gradients/animations. (TW variants only)' },
  { name: 'activeClassName',type: 'string',        def: '""',                           desc: 'Extra classes for the reveal layer. Falls back to textClassName if empty. (TW variants only)' },
  // LAYOUT
  { name: 'className',      type: 'string',        def: '""',                           desc: 'Extra classes forwarded to the wrapper element.'                       },
];

export const dep = []; 


export const PKG_CMDS = {
  pnpm: null,
  npm:  null,
  yarn: null,
  bun:  null,
}; 

export const getShadcnCmds = (variant) => ({
  pnpm: `pnpm dlx shadcn@latest add https://reactbytes.dev/r/CurtainText-${variant}`,
  npm:  `npx shadcn@latest add https://reactbytes.dev/r/CurtainText-${variant}`,
  yarn: `yarn shadcn@latest add https://reactbytes.dev/r/CurtainText-${variant}`,
  bun:  `bunx shadcn@latest add https://reactbytes.dev/r/CurtainText-${variant}`,
});

export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add https://reactbytes.dev/r/CurtainText-${variant}`,
  npm:  `npx jsrepo@latest add https://reactbytes.dev/r/CurtainText-${variant}`,
  yarn: `yarn jsrepo@latest add https://reactbytes.dev/r/CurtainText-${variant}`,
  bun:  `bunx jsrepo@latest add https://reactbytes.dev/r/CurtainText-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/CurtainText/CurtainText';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/CurtainText/CurtainText';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/CurtainText/CurtainText';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/CurtainText/CurtainText';


export { JS_CSS_CODE };
export { JS_TAILWIND_CODE };
export { TS_CSS_CODE };
export { TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js':      JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css':      TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE,
};
