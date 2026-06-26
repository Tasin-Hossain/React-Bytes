export const DEFAULT_STYLE = {
  // Fill
  fillType: 'solid', // 'solid' | 'linear' | 'radial'
  fill: '#ffffff',
  fillColor2: '#a855f7',
  gradientAngle: 135,

  // Stroke (rendered as a clean outer outline of the merged silhouette)
  strokeEnabled: false,
  strokeColor: '#0d0716',
  strokeWidth: 4,

  // Drop shadow (cast from the merged silhouette)
  shadowEnabled: false,
  shadowColor: '#000000',
  shadowBlur: 24,
  shadowOffsetX: 0,
  shadowOffsetY: 14,
  shadowOpacity: 0.35,

  // Global
  opacity: 1,

  // Canvas / export background
  backgroundEnabled: false,
  backgroundColor: '#d35af8'
};

export const DEFAULT_GLOBAL_RADIUS = 32;
export const DEFAULT_SMOOTHING = 0.6;
export const DEFAULT_TOLERANCE = 1;
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;
export const DEFAULT_GRID_SIZE = 20;

let shapeCounter = 0;
const uid = () => {
  shapeCounter += 1;
  return `shape-${Date.now()}-${shapeCounter}-${Math.random().toString(36).slice(2, 8)}`;
};

export const createShape = (x = 100, y = 100, w = 120, h = 80) => ({
  id: uid(),
  x,
  y,
  w,
  h,
  r: undefined
});

export const createInitialState = () => ({
  shapes: [
    { id: 'shape-1', x: 300, y: 150, w: 200, h: 280, r: undefined },
    { id: 'shape-2', x: 500, y: 220, w: 200, h: 140, r: undefined }
  ],
  style: { ...DEFAULT_STYLE },
  globalRadius: DEFAULT_GLOBAL_RADIUS,
  smoothing: DEFAULT_SMOOTHING,
  tolerance: DEFAULT_TOLERANCE,
  selectedIds: [],
  canvasWidth: DEFAULT_CANVAS_WIDTH,
  canvasHeight: DEFAULT_CANVAS_HEIGHT,
  snapToGrid: true,
  gridSize: DEFAULT_GRID_SIZE
});

// One-click layout templates. Each returns a fresh set of shapes (with unique ids)
// laid out around a common origin so "Fit to view" frames them nicely.
const make = (x, y, w, h) => ({ id: uid(), x, y, w, h, r: undefined });

export const PRESETS = [
  {
    // Chat bubble: a rounded body with a small tail block overhanging below
    // its bottom-left corner -> 1 bridge.
    id: 'message',
    name: 'Message',
    radius: 36,
    build: () => [make(220, 180, 320, 220), make(230, 380, 56, 64)]
  },

  {
    // Key: a square head, a long thin shaft, and two teeth hanging below the
    // shaft near its end -> 3 bridges.
    id: 'key',
    name: 'Key',
    radius: 24,
    build: () => [
      make(240, 220, 120, 120),
      make(360, 264, 320, 32),
      make(560, 296, 36, 50),
      make(640, 296, 36, 70)
    ]
  },

  {
    // Folder: a back panel with a smaller tab overhanging above its top-left
    // corner -> 1 bridge.
    id: 'folder',
    name: 'Folder',
    radius: 20,
    build: () => [make(240, 260, 360, 220), make(240, 220, 140, 40)]
  },
  {
    // Bar chart: four ascending bars sharing a common baseline, each touching
    // its neighbour along a vertical edge -> 3 bridges.
    id: 'bar-chart',
    name: 'Bar Chart',
    radius: 10,
    build: () => [
      make(260, 380, 80, 120),
      make(340, 320, 80, 180),
      make(420, 260, 80, 240),
      make(500, 200, 80, 300)
    ]
  },
  {
    // Skyline: five buildings of varying height on a shared baseline, each
    // touching its neighbour -> 4 bridges.
    id: 'skyline',
    name: 'Skyline',
    radius: 8,
    build: () => [
      make(240, 320, 70, 180),
      make(310, 260, 70, 240),
      make(380, 200, 70, 300),
      make(450, 280, 70, 220),
      make(520, 340, 70, 160)
    ]
  },


];