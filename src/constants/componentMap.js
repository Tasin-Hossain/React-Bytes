const componentMap = {

  // ── get-started ────────────────────────────────────────────────────────────
  'get-started/introduction': () => import('../docs/Introduction.jsx'),
  'get-started/installation': () => import('../docs/Installation.jsx'),
  'get-started/mcp':          () => import('../docs/McpServer.jsx'),

  // ── text-animations ────────────────────────────────────────────────────────
  'text-animations/split-text': () => import('../demo/TextAnimations/SplitTextDemo.jsx'),

  'animations/animated-content': () => import('../demo/TextAnimations/SplitTextDemo.jsx'),
  
  'components/animated-list': () => import('../demo/TextAnimations/SplitTextDemo.jsx'),

  'backgrounds/mouserepel-dots': () => import('../demo/Backgrounds/MouseRepelDotsDemo.jsx'),


};

export { componentMap };
