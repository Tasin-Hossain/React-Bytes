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
    description:'A customizable React magnetic text animation powered by GSAP, featuring interactive cursor attraction, smooth color transitions, responsive sizing, and configurable entrance effects for modern UI designs.',
    category: 'TextAnimations',
    dependencies: ['gsap@^3.15.0'],
    docsUrl: 'https://reactbytes.online/text-animations/magnetic-text',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },

  'TextAnimations/CurtainText': {
    name: 'CurtainText',
    description: 'A customizable React text animation where each character slides away on hover to reveal a second text layer, creating a smooth curtain-style reveal effect for modern interfaces.',
    category: 'TextAnimations',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/text-animations/curtain-text',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },

  'TextAnimations/CursorTrail': {
    name: 'CursorTrail',
    description:'A customizable React cursor trail component that creates animated floating text or symbol particles with configurable colors, motion styles, particle sizing, and interactive mouse effects.',
    category: 'TextAnimations',
    dependencies: ['motion@^12.40.0'],
    docsUrl: 'https://reactbytes.online/text-animations/cursor-trail',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },

  'TextAnimations/BlurText': {
    name: 'BlurText',
    description:'A customizable React text animation powered by GSAP, featuring smooth blur, scale, and staggered letter or word reveals with adjustable timing, gradients, and repeat controls.',
    category: 'TextAnimations',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/text-animations/blur-text',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'TextAnimations/MeltGlitchText': {
    name: 'MeltGlitchText',
    description:'A customizable React hover text animation featuring GSAP-powered melt effects, RGB glitch layers, interactive mouse tracking, smooth character distortion, and configurable colors, typography, and motion.',
    category: 'TextAnimations',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/text-animations/meltglitch-text',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'TextAnimations/NeonFlicker': {
    name: 'NeonFlicker',
    description:'A customizable React neon text animation featuring GSAP-powered flicker effects, glowing shadows, per-character animations, adjustable glow intensity, custom colors, and looping neon sign effects for modern UI designs.',
    category: 'TextAnimations',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/text-animations/neon-flicker',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'TextAnimations/SmokeAway': {
    name: 'SmokeAway',
    description:'A customizable React smoke text animation featuring GSAP-powered hover effects, character-by-character disappearance, blur transitions, scaling, vertical motion, and smooth restoration for modern UI designs.',
    category: 'TextAnimations',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/text-animations/smoke-away',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'TextAnimations/SpotlightText': {
    name: 'SpotlightText',
    description:'A customizable React spotlight text animation featuring GSAP-powered sequential character highlights, smooth color transitions, adjustable timing, opacity controls, and looping effects for modern UI and hero sections.',
    category: 'TextAnimations',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/text-animations/spotlight-text',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'TextAnimations/StaticNoiseText': {
    name: 'StaticNoiseText',
    description:'A customizable React static noise text animation featuring animated scanline distortion, glitch-inspired effects, adjustable intensity, responsive canvas rendering, and configurable typography for modern UI designs.',
    category: 'TextAnimations',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/text-animations/staticnoise-text',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },


  // Components
  'Components/RotatingCards': {
    name: 'RotatingCards',
    description:'A customizable React rotating card carousel powered by GSAP, featuring smooth orbit animations, draggable controls, autoplay, hover effects, mouse wheel navigation, and animated card entrances.',
    category: 'Components',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/components/rotating-cards',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Components/RotatingCarousel': {
    name: 'RotatingCarousel',
    description:'A customizable React 3D carousel component featuring GSAP-powered rotation, draggable interactions, inertia physics, autoplay, responsive image cards, hover effects, dynamic shading, and configurable entrance animations for modern UI designs.',
    category: 'Components',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/components/rotating-carousel',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },

  // Backgrounds Animations
  'Backgrounds/MouseRepelDots': {
    name: 'MouseRepelDots',
    description: 'A customizable React interactive dot background featuring mouse repulsion, smooth physics-based motion, animated gradients, wave effects, sparkle animations, and high-performance canvas rendering.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/backgrounds/mouserepel-dots',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/MouseRepelGrid': {
    name: 'MouseRepelGrid',
    description: 'A customizable WebGL-powered React grid background featuring mouse repulsion, animated waves, glowing effects, gradients, rainbow modes, ambient motion, and interactive pulse animations.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/backgrounds/mouserepel-grid',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/BlinkingSquares': {
    name: 'BlinkingSquares',
    description: 'A customizable React animated square background featuring softly twinkling squares, directional fading, glow effects, adjustable brightness, and high-performance canvas rendering.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/backgrounds/blinking-squares',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/HalfTone': {
    name: 'HalfTone',
    description: 'A customizable React Three Fiber halftone background featuring animated dot patterns, multiple shape styles, directional wave motion, color controls, and shader-powered WebGL rendering.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/backgrounds/half-tone',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/Vortex': {
    name: 'Vortex',
    description: 'A customizable React Three Fiber vortex background featuring animated swirling gradients, fluid shader motion, adjustable colors, noise intensity, opacity, and WebGL-powered visual effects.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/backgrounds/vortex',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/AsciiWave': {
    name: 'AsciiWave',
    description: 'A customizable React Three Fiber ASCII shader background featuring animated wave patterns, interactive cursor effects, custom character sets, procedural noise, and optional video-to-ASCII rendering.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/backgrounds/ascii-wave',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/EmojiWave': {
    name: 'EmojiWave',
    description: 'A customizable React Three Fiber emoji shader background featuring animated wave motion, interactive cursor effects, custom emoji sets, procedural animation, and optional video-based rendering.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/backgrounds/emoji-wave',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },
  'Backgrounds/ShapesDots': {
    name: 'ShapesDots',
    description: 'A customizable React canvas background featuring animated geometric shapes, interactive cursor effects, ripple bursts, multiple animation modes, gradient colors, and responsive motion.',
    category: 'Backgrounds',
    dependencies: [],
    docsUrl: 'https://reactbytes.online/backgrounds/shapes-dots',
    variants: ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'],
    tags: []
  },


};

export default componentMetadata;
