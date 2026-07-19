// JS-CSS variant
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
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform vec2  uResolution;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

void main() {
  vec2 uv = vUv * uScale;
  uv.x   *= uResolution.x / uResolution.y;

  // Rotate the sampling coordinates around the pattern center.
  vec2  center = vec2(uScale * 0.5 * (uResolution.x / uResolution.y), uScale * 0.5);
  float c = cos(uRotation);
  float s = sin(uRotation);
  vec2  cuv = uv - center;
  uv = vec2(cuv.x * c - cuv.y * s, cuv.x * s + cuv.y * c) + center;

  float t      = uTime * uSpeed;
  float tex_x  = uv.x;
  float tex_y  = uv.y + 0.03 * sin(8.0 * tex_x - t);

  float pattern = 0.6 + 0.4 * sin(
    5.0 * (tex_x + tex_y + cos(3.0 * tex_x + 5.0 * tex_y) + 0.02 * t) +
    sin(20.0 * (tex_x + tex_y - 0.1 * t))
  );

  vec3 col = uColor * pattern;

  // Same noise treatment as the Vortex shader: subtract straight from the
  // finished color channels rather than folding it into the pattern first.
  float rnd = noise(gl_FragCoord.xy);
  col -= rnd / 15.0 * uNoiseIntensity;

  gl_FragColor = vec4(col, 1.0);
}
`;

const SilkPlane = forwardRef(function SilkPlane({ uniforms }, ref) {
  const { viewport, size } = useThree();

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
      // update the material uniform directly via the mesh ref to avoid mutating the `uniforms` prop
      if (ref.current.material && ref.current.material.uniforms && ref.current.material.uniforms.uResolution) {
        ref.current.material.uniforms.uResolution.value = [size.width, size.height];
      }
    }
  }, [ref, viewport, size]);

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
      />
    </mesh>
  );
});
SilkPlane.displayName = 'SilkPlane';

const Silk = ({
  speed          = 5,
  scale          = 1,
  color          = '#7B7481',
  noiseIntensity = 1.5,
  rotation       = 0,
  className      = '',
}) => {
  const meshRef = useRef();

  // Keep the same friendly public numbers (speed=5, scale=1) as the canvas
  // version, normalized down to ranges that read well in the shader.
  const uniforms = useMemo(
    () => ({
      uTime:           { value: 0 },
      uSpeed:          { value: speed * 0.05 },
      uScale:          { value: scale * 2 },
      uColor:          { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation:       { value: rotation },
      uNoiseIntensity: { value: noiseIntensity },
      uResolution:     { value: [1, 1] },
    }),
    [speed, scale, color, rotation, noiseIntensity]
  );

  return (
    <div className={`silk-wrapper ${className}`}>
      <style>{`
        .silk-wrapper {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          background-color: #000000;
        }

        .silk-canvas-container {
          width: 100% !important;
          height: 100% !important;
        }

        .silk-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0) 50%,
            rgba(0, 0, 0, 0.5) 100%
          );
        }
      `}</style>

      <Canvas
        dpr={[1, 2]}
        frameloop="always"
        className="silk-canvas-container"
        onCreated={({ gl }) => {
          gl.setSize(
            gl.domElement.parentElement.clientWidth,
            gl.domElement.parentElement.clientHeight
          );
        }}
      >
        <SilkPlane ref={meshRef} uniforms={uniforms} />
      </Canvas>

      {/* Gradient overlay for depth, matching the canvas version */}
      <div className="silk-overlay" />
    </div>
  );
};

export default Silk;
