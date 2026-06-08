const componentMap = {

  // ── get-started ────────────────────────────────────────────────────────────
  'get-started/introduction': () => import('../docs/Introduction.jsx'),
  'get-started/installation': () => import('../docs/Installation.jsx'),
  'get-started/mcp': () => import('../docs/MCP.jsx'),
  'get-started/all-components': () => import('../docs/AllComponents.jsx'),


  // ── text-animations ────────────────────────────────────────────────────────
  'text-animations/magnetic-text': () => import('../demo/TextAnimations/MagneticTextDemo.jsx'),


  'backgrounds/mouserepel-dots': () => import('../demo/Backgrounds/MouseRepelDotsDemo.jsx'),


};

export { componentMap };
