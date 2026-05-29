export const ORBIT_PALETTES = [
  { hex: '#6366f1', grad: 'from-blue-400 via-indigo-400 to-purple-500' },
  { hex: '#a855f7', grad: 'from-purple-300 via-purple-400 to-purple-600' },
  { hex: '#06b6d4', grad: 'from-white via-cyan-300 to-cyan-500' },
  { hex: '#f43f5e', grad: 'from-white via-rose-300 to-rose-500' },
  { hex: '#f59e0b', grad: 'from-white via-yellow-300 to-amber-500' },
  { hex: '#14b8a6', grad: 'from-white via-teal-300 to-teal-500' }
];

export const ORBIT_PARAM_DEFAULTS = {
  globeHue: 190,
  globeSat: 70,
  globeLit: 65,
  particleCount: 1800,
  speed: 3
};

// Used by OrbitCodeMockup DragNumber rows
export const ORBIT_PARAM_CONFIG = [
  { key: 'globeHue', label: 'globeColor[0]', min: 0, max: 360, step: 1 },
  { key: 'globeSat', label: 'globeColor[1]', min: 0, max: 100, step: 1 },
  { key: 'globeLit', label: 'globeColor[2]', min: 20, max: 85, step: 1 },
  { key: 'particleCount', label: 'particleCount', min: 200, max: 3000, step: 100 },
  { key: 'speed', label: 'speedMultiplier', min: 0.1, max: 3, step: 0.1 }
];

export const ORBIT_ICONS_ALL = ['claude', 'figma', 'slack', 'openai', 'vercel', 'linear', 'supabase', 'stripe'];
