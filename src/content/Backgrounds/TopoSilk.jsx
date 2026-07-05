
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { forwardRef, useRef, useMemo, useLayoutEffect } from 'react';
import { Vector3 } from 'three';

// ─── helpers ────────────────────────────────────────────────────────────────

const hexToRGB = (hex) => {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
};

// ─── shaders ────────────────────────────────────────────────────────────────

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
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uLayers;
uniform float uDepth;
uniform vec3  uColorDark;
uniform vec3  uColorLight;

const float E = 2.71828182845904523536;

float hash(vec2 p) {
  vec2 r = E * sin(E * p);
  return fract(r.x * r.y * (1.0 + p.x));
}

vec2 rotateUV(vec2 uv, float a) {
  return mat2(cos(a), -sin(a), sin(a), cos(a)) * uv;
}

float fbm(vec2 p, float t) {
  float v = 0.0;
  float a = 0.52;
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    v += a * (0.5 + 0.5 * sin(
      p.x * (1.1 + fi * 0.2) +
      p.y * (0.8 + fi * 0.15) +
      t + fi * 1.37
    ));
    p  = p * 2.07 + vec2(1.91 + fi * 0.3, 2.17 - fi * 0.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2  uv = rotateUV(vUv - 0.5, uRotation) + 0.5;
  vec2  p  = uv * uScale;
  float t  = uTime * uSpeed * 0.04;

  p.y += 0.045 * sin(6.5 * p.x - t * 9.0);
  p.x += 0.030 * cos(5.0 * p.y - t * 6.5);

  float h = fbm(p, t);
  h += 0.28 * fbm(p * 1.6 - t * 0.7 + 3.14, t * 0.5);
  h  = clamp(h, 0.0, 1.0);

  float n     = hash(gl_FragCoord.xy);
  float edge  = fract(h * uLayers);
  float layer = floor(h * uLayers) / uLayers;

  float shadow = smoothstep(0.0,  0.22, edge);
  float hilit  = smoothstep(0.80, 1.0,  edge);

  float lum = layer * uDepth + (1.0 - uDepth) * 0.04;
  lum += shadow * 0.14 - hilit * 0.05;
  lum -= n / 16.0 * uNoiseIntensity;
  lum  = clamp(lum, 0.0, 1.0);

  vec3 col = mix(uColorDark, uColorLight, lum);
  gl_FragColor = vec4(col, 1.0);
}
`;

// ─── inner plane (runs inside Canvas) ───────────────────────────────────────

const TopoPlane = forwardRef(function TopoPlane({ uniforms }, ref) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});

TopoPlane.displayName = 'TopoPlane';

// ─── exported component ──────────────────────────────────────────────────────

/**
 * TopoSilk — dark topographic paper-cut background animation
 *
 * Props
 * ─────
 * speed          {number}  animation speed              default 3.5
 * scale          {number}  pattern zoom                 default 2.4
 * layers         {number}  number of topo layers        default 8
 * depth          {number}  layer darkness contrast      default 0.6
 * noiseIntensity {number}  film-grain amount            default 0.8
 * rotation       {number}  pattern rotation in radians  default 0
 * colorDark      {string}  hex color for dark areas     default '#050505'
 * colorLight     {string}  hex color for light areas    default '#b8b8b8'
 */
const TopoSilk = ({
  speed          = 3.5,
  scale          = 2.4,
  layers         = 8,
  depth          = 0.6,
  noiseIntensity = 0.8,
  rotation       = 0,
  colorDark      = '#050505',
  colorLight     = '#b8b8b8',
}) => {
  const meshRef = useRef();

  const [dr, dg, db] = hexToRGB(colorDark);
  const [lr, lg, lb] = hexToRGB(colorLight);

  const uniforms = useMemo(
    () => ({
      uTime:           { value: 0 },
      uSpeed:          { value: speed },
      uScale:          { value: scale },
      uLayers:         { value: layers },
      uDepth:          { value: depth },
      uNoiseIntensity: { value: noiseIntensity },
      uRotation:       { value: rotation },
      uColorDark:      { value: new Vector3(dr, dg, db) },
      uColorLight:     { value: new Vector3(lr, lg, lb) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [speed, scale, layers, depth, noiseIntensity, rotation,
     colorDark, colorLight]
  );

  return (
    <Canvas dpr={[1, 2]} frameloop="always">
      <TopoPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  );
};

export default TopoSilk;
