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


  // ── Components
  'components/rotating-cards': () => import('../demo/Components/RotatingCardsDemo.jsx'),
  'components/rotating-carousel': () => import('../demo/Components/RotatingCarouselDemo.jsx'),

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
