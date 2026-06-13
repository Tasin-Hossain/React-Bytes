/**
 * @typedef {'TextAnimations'} Category
 */

/**
 * The supported code/component variants for the registry system.
 * @type {readonly ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW']}
 */
export const VARIANTS = ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'];

/**
 * @typedef {'JS-CSS' | 'JS-TW' | 'TS-CSS' | 'TS-TW'} Variant
 */

/**
 * @typedef {Object} ComponentMetadata
 * @property {string} description
 * @property {Category} category
 * @property {string} name
 * @property {string} docsUrl
 * @property {string[]} tags
 * @property {string[]} [dependencies]
 * @property {Variant[]} [variants]
 */

/**
 * @type {Record<string, ComponentMetadata>}
 */
export const componentMetadata = {

  // Text Animations
 'TextAnimations/Magnetictext': {
    name: 'Magnetictext',
    description:'Interactive GSAP-powered magnetic text with cursor attraction, color transitions, responsive sizing, and customizable entrance animations.',
    category: 'TextAnimations',
    dependencies: ['gsap@^3.15.0'],
    docsUrl: 'http://localhost:5173/text-animations/magnetic-text',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },

  'TextAnimations/CurtainText': {
    name: 'CurtainText',
    description: 'A hover-triggered text animation where each character slides out and reveals a new layer underneath, like a curtain being pulled.',
    category: 'TextAnimations',
    dependencies: [],
    docsUrl: 'http://localhost:5173/text-animations/curtain-text',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },

  'TextAnimations/CursorTrail': {
    name: 'CursorTrail',
    description:'Interactive cursor trail animation component that creates floating text or symbol particles following the mouse. Supports custom characters, colors, particle sizing, directional movement, random floating effects, multiple animation styles, and fully customizable trail behavior.',
    category: 'TextAnimations',
    dependencies: ['motion@^12.40.0'],
    docsUrl: 'http://localhost:5173/text-animations/cursor-trail',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },

  // Backgrounds Animations
  'Backgrounds/MouseRepelDots': {
    name: 'MouseRepelDots',
    description: 'Interactive dot-grid background where dots repel from the cursor, creating smooth physics-based motion, dynamic scaling, gradients, waves, and sparkle effects.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'http://localhost:5173/backgrounds/mouserepel-dots',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },


};

export default componentMetadata;
