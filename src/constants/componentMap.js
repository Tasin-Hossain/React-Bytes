const componentMap = {

  // ── get-started 
  'get-started/introduction': () => import('../docs/Introduction.jsx'),
  'get-started/installation': () => import('../docs/Installation.jsx'),
  'get-started/mcp': () => import('../docs/MCP.jsx'),
  'get-started/all-components': () => import('../docs/AllComponents.jsx'),


  // ── text-animations 
  'text-animations/magnetic-text': () => import('../demo/TextAnimations/MagneticTextDemo.jsx'),
  'text-animations/curtain-text': () => import('../demo/TextAnimations/CurtainTextDemo.jsx'),
  'text-animations/cursor-trail': () => import('../demo/TextAnimations/CursorTrailDemo.jsx'),
  'text-animations/blur-text': () => import('../demo/TextAnimations/BlurTextDemo.jsx'),
  'text-animations/meltglitch-text': () => import('../demo/TextAnimations/MeltGlitchTextDemo.jsx'),
  'text-animations/neon-flicker': () => import('../demo/TextAnimations/NeonFlickerDemo.jsx'),
  'text-animations/smoke-away': () => import('../demo/TextAnimations/SmokeAwayDemo.jsx'),
  'text-animations/spotlight-text': () => import('../demo/TextAnimations/SpotlightDemo.jsx'),
  'text-animations/staticnoise-text': () => import('../demo/TextAnimations/StaticNoiseDemo.jsx'),
  'text-animations/raindrop-text': () => import('../demo/TextAnimations/RainDropTextDemo.jsx'),
  'text-animations/shatter-text': () => import('../demo/TextAnimations/ShatterTextDemo.jsx'),


  // ── Components
  'components/rotating-cards': () => import('../demo/Components/RotatingCardsDemo.jsx'),
  'components/rotating-carousel': () => import('../demo/Components/RotatingCarouselDemo.jsx'),
  'components/scroll-stack': () => import('../demo/Components/ScrollStackDemo.jsx'),
  'components/imagecard-hover': () => import('../demo/Components/ImageCardHoverDemo.jsx'),

  // ── backgrounds 
  'backgrounds/mouserepel-dots': () => import('../demo/Backgrounds/MouseRepelDotsDemo.jsx'),
  'backgrounds/mouserepel-grid': () => import('../demo/Backgrounds/MouseRepelGridDemo.jsx'),
  'backgrounds/blinking-squares': () => import('../demo/Backgrounds/BlinkingSquaresDemo.jsx'),
  'backgrounds/half-tone': () => import('../demo/Backgrounds/HalftoneDemo.jsx'),
  'backgrounds/vortex': () => import('../demo/Backgrounds/VortexDemo.jsx'),
  'backgrounds/ascii-wave': () => import('../demo/Backgrounds/AsciiWaveDemo.jsx'),
  'backgrounds/emoji-wave': () => import('../demo/Backgrounds/EmojiWavedemo.jsx'),
  'backgrounds/shapes-dots': () => import('../demo/Backgrounds/ShapesDots.jsx'),



};

export { componentMap };
