
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { forwardRef, useRef, useMemo, useLayoutEffect } from 'react';
import { Color } from 'three';

const hexToNormalizedRGB = hex => {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255
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
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uBgColor;
uniform float uSpeed;
uniform float uScale;
uniform float uNoiseIntensity;
uniform float uBlend;
uniform float uOpacity;
uniform vec2  uResolution;

const float e = 2.71828182845904523536;

/* Silk-style noise */
float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

void main() {
  vec2 uv = (vUv - 0.5) * uScale;
  uv.x   *= uResolution.x / uResolution.y;
  float t  = uTime * uSpeed;

  float angle  = atan(uv.y, uv.x);
  float radius = length(uv);

  float spiral = sin(angle * 4.0 + radius * 9.0 - t * 2.2) * 0.5 + 0.5;
  float swirl  = sin(radius * 16.0 - t * 3.0 + angle * 2.0) * 0.5 + 0.5;

  vec3 col = mix(uColorA, uColorB, spiral);
  col *= 0.55 + 0.45 * swirl;

  float glow = exp(-radius * 2.2);
  col += uColorB * glow * 0.5;

  float vig = smoothstep(1.4, 0.3, radius);
  col *= vig;

  /* noiseIntensity — Silk: rnd / 15.0 * uNoiseIntensity */
  float rnd = noise(gl_FragCoord.xy);
  col -= rnd / 15.0 * uNoiseIntensity;

  /* blend — Aurora: smoothstep alpha blend with bg */
  float intensity = dot(col, vec3(0.299, 0.587, 0.114));
  float midPoint  = 0.20;
  float alpha     = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  col = mix(uBgColor, col, alpha);

  gl_FragColor = vec4(col, uOpacity);
}
`;

// ─── Inner plane ────────────────────────────────────────────────────────────

const VortexPlane = forwardRef(function VortexPlane({ uniforms }, ref) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

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


// ─── Main export ─────────────────────────────────────────────────────────────

const Vortex = ({
  speed          = 0.8,
  scale          = 2.0,
  colorA         = '#1B0F33',
  colorB         = '#FF5DA2',
  noiseIntensity = 1.5,
  blend          = 0.5,
  opacity        = 1.0,
  bgColor        = '#000000',
  className      = '',
}) => {
  const meshRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime:          { value: 0 },
      uSpeed:         { value: speed },
      uScale:         { value: scale },
      uColorA:        { value: new Color(...hexToNormalizedRGB(colorA)) },
      uColorB:        { value: new Color(...hexToNormalizedRGB(colorB)) },
      uBgColor:       { value: new Color(...hexToNormalizedRGB(bgColor)) },
      uNoiseIntensity:{ value: noiseIntensity },
      uBlend:         { value: blend },
      uOpacity:       { value: opacity },
      uResolution:    { value: [1, 1] },
    }),
    [speed, scale, colorA, colorB, bgColor, noiseIntensity, blend, opacity]
  );

  return (
    <div
      className={`absolute inset-0 -z-10 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop="always"
        className="w-full! h-full!"
        onCreated={({ gl }) => {
          gl.setSize(
            gl.domElement.parentElement.clientWidth,
            gl.domElement.parentElement.clientHeight
          );
        }}
      >
        <VortexPlane ref={meshRef} uniforms={uniforms} />
      </Canvas>
    </div>
  );
};

export default Vortex;


