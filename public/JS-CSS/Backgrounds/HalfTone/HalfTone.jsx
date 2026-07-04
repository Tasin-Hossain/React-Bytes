// JS-CSS variant
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { forwardRef, useRef, useMemo, useLayoutEffect, useEffect } from 'react';
import { Color, Vector2 } from 'three';

const hexToNormalizedRGB = hex => {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uBgColor;
uniform float uHasBg;
uniform float uSpeed;
uniform float uScale;
uniform float uDotSize;
uniform float uShape;
uniform float uDir;
uniform float uWaveFreq;
uniform float uOpacity;
uniform float uAngle;

void main() {
  vec2 uv = vUv;
  uv.x *= uResolution.x / uResolution.y;
  float t = uTime * uSpeed;

  float cosA = cos(uAngle);
  float sinA = sin(uAngle);
  vec2 center = vec2(uResolution.x / uResolution.y * 0.5, 0.5);
  vec2 ruv = uv - center;
  ruv = vec2(cosA * ruv.x - sinA * ruv.y, sinA * ruv.x + cosA * ruv.y) + center;

  vec2 grid = uv * uScale * 28.0;
  vec2 id = floor(grid);
  vec2 gv = fract(grid) - 0.5;

  vec2 rgrid = ruv * uScale * 28.0;
  vec2 rid = floor(rgrid);

  float wave;
  if (uDir < 1.5) {
    wave = sin(id.x * 0.35 + id.y * 0.35 - t * 2.2) * 0.5 + 0.5;
  } else if (uDir < 2.5) {
    wave = sin(id.x * 0.5 * uWaveFreq - t * 2.2) * 0.5 + 0.5;
  } else if (uDir < 3.5) {
    wave = sin(id.y * 0.5 * uWaveFreq - t * 2.2) * 0.5 + 0.5;
  } else if (uDir < 4.5) {
    float r = length(id * 0.04);
    wave = sin(r * uWaveFreq * 6.0 - t * 2.2) * 0.5 + 0.5;
  } else if (uDir < 5.5) {
    wave = sin(rid.x * 0.5 * uWaveFreq - t * 2.2) * 0.5 + 0.5;
  } else if (uDir < 6.5) {
    float r2 = length(id * 0.04);
    float a2 = atan(id.y, id.x);
    wave = sin(r2 * uWaveFreq * 5.0 - a2 * 2.0 - t * 2.2) * 0.5 + 0.5;
  } else if (uDir < 7.5) {
    float chk = mod(id.x + id.y, 2.0);
    wave = sin(chk * 3.14159 - t * 2.2) * 0.5 + 0.5;
  } else {
    wave = sin(id.x * 0.35 * uWaveFreq - t * 2.2) * 0.5 + 0.5;
    wave = mix(wave, sin(id.y * 0.35 * uWaveFreq - t * 2.2) * 0.5 + 0.5, 0.5);
  }

  float maxD = uDotSize * 0.46;
  float minD = 0.04;
  float dotSz = mix(minD, maxD, wave);

  float d;
  if (uShape < 0.5) {
    d = length(gv);
  } else if (uShape < 1.5) {
    d = max(abs(gv.x), abs(gv.y));
  } else if (uShape < 2.5) {
    d = abs(gv.x) + abs(gv.y);
  } else if (uShape < 3.5) {
    float tri = max(abs(gv.x) * 0.866 + gv.y * 0.5, -gv.y * 0.5);
    d = tri * 1.5;
  } else if (uShape < 4.5) {
    float a3 = atan(gv.y, gv.x);
    float r3 = length(gv);
    float star = r3 * (0.8 + 0.2 * abs(sin(a3 * 3.0)));
    d = star;
  } else if (uShape < 5.5) {
    float cx = min(abs(gv.x), abs(gv.y));
    float mx = max(abs(gv.x), abs(gv.y));
    d = mx - smoothstep(0.0, 0.15, cx) * 0.25;
  } else if (uShape < 6.5) {
    d = abs(length(gv) - 0.25);
  } else {
    vec2 hgv = abs(gv);
    d = max(hgv.x * 0.866 + hgv.y * 0.5, hgv.y) * 1.15;
  }

  float dot = smoothstep(dotSz, dotSz - 0.06, d);

  vec3 bg = uHasBg > 0.5 ? uBgColor : vec3(0.02, 0.02, 0.045);
  vec3 col = mix(bg, uColor, dot);
  float alpha = uHasBg > 0.5 ? uOpacity : dot * uOpacity;

  gl_FragColor = vec4(col, alpha);
}
`;

const DIRECTION_MAP = {
  diagonal:    1.0,
  horizontal:  2.0,
  vertical:    3.0,
  radial:      4.0,
  angled:      5.0,
  spiral:      6.0,
  checker:     7.0,
  ripple:      8.0,
};

const SHAPE_MAP = {
  circle:   0.0,
  square:   1.0,
  diamond:  2.0,
  triangle: 3.0,
  star:     4.0,
  cross:    5.0,
  ring:     6.0,
  hexagon:  7.0,
};

const HalftonePlane = forwardRef(function HalftonePlane({ uniforms }, ref) {
  const { viewport, size } = useThree();

  useLayoutEffect(() => {
    if (ref.current) ref.current.scale.set(viewport.width, viewport.height, 1);
  }, [ref, viewport]);

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [uniforms, size]);

  useFrame((_, delta) => {
    ref.current.material.uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
});
HalftonePlane.displayName = 'HalftonePlane';

const Halftone = ({
  color       = '#d35af8',
  bgColor     = 'transparent',
  speed       = 0.7,
  direction   = 'angled',
  angle       = 45,
  scale       = 1.0,
  dotSize     = 0.5,
  shape       = 'circle',
  waveFreq    = 1.0,
  opacity     = 1.0,
  className   = '',
}) => {
  const meshRef = useRef();
  const isTransparent = bgColor === 'transparent';

  const uniforms = useMemo(() => {
    const bgRGB = isTransparent ? [0, 0, 0] : hexToNormalizedRGB(bgColor);
    return {
      uSpeed:      { value: speed },
      uScale:      { value: scale },
      uDotSize:    { value: dotSize },
      uShape:      { value: SHAPE_MAP[shape] ?? 0.0 },
      uDir:        { value: DIRECTION_MAP[direction] ?? 1.0 },
      uAngle:      { value: (angle * Math.PI) / 180 },
      uWaveFreq:   { value: waveFreq },
      uOpacity:    { value: opacity },
      uColor:      { value: new Color(...hexToNormalizedRGB(color)) },
      uBgColor:    { value: new Color(...bgRGB) },
      uHasBg:      { value: isTransparent ? 0.0 : 1.0 },
      uResolution: { value: new Vector2(1, 1) },
      uTime:       { value: 0 },
    };
  }, [color, bgColor, speed, direction, angle, scale, dotSize, shape, waveFreq, opacity, isTransparent]);

  const style = {
    wrapper: { position: 'absolute', inset: 0, zIndex: -10 },
    canvas:  { width: '100% !important', height: '100% !important' },
  };

  const classes = `${className}`;

  return (
    <div style={style.wrapper} className={classes}>
      <Canvas dpr={[1, 2]} frameloop="always" style={style.canvas} gl={{ alpha: true }}>
        <HalftonePlane ref={meshRef} uniforms={uniforms} />
      </Canvas>
    </div>
  );
};

export default Halftone;