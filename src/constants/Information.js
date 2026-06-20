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
 'TextAnimations/MagneticText': {
    name: 'MagneticText',
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
  'Backgrounds/MouserepelDots': {
    name: 'MouserepelDots',
    description: 'Interactive dot-grid background where dots repel from the cursor, creating smooth physics-based motion, dynamic scaling, gradients, waves, and sparkle effects.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'http://localhost:5173/backgrounds/mouserepel-dots',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/MouserepelGrid': {
    name: 'MouserepelGrid',
    description: 'Interactive WebGL-powered grid background with mouse repulsion, animated waves, glow effects, gradients, rainbow modes, ambient motion, and dynamic pulse interactions.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'http://localhost:5173/backgrounds/mouserepel-grid',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/BlinkingSquares': {
    name: 'BlinkingSquares',
    description: 'Generate a mesmerizing background of softly twinkling squares with directional fading, customizable glow intensity, and smooth canvas-based performance.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'http://localhost:5173/backgrounds/blinking-squares',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/HalfTone': {
    name: 'HalfTone',
    description: 'A customizable animated halftone background with multiple dot shapes, wave modes, directional motion, and color controls, rendered with React Three Fiber shaders.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'http://localhost:5173/backgrounds/half-tone',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/Vortex': {
    name: 'Vortex',
    description: 'An animated vortex shader background with swirling gradients, customizable colors, noise intensity, and fluid motion effects.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'http://localhost:5173/backgrounds/vortex',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/AsciiWave': {
    name: 'AsciiWave',
    description: 'A dynamic ASCII shader background featuring animated wave patterns, customizable characters, cursor interaction, and optional video-to-ASCII conversion.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'http://localhost:5173/backgrounds/ascii-wave',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/EmojiWave': {
    name: 'EmojiWave',
    description: 'A dynamic Emoji shader background featuring animated wave patterns, customizable characters, cursor interaction, and optional video-to-ASCII conversion.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'http://localhost:5173/backgrounds/emoji-wave',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },


};

export default componentMetadata;
