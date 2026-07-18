// speed-lines-shader.jsx

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";

const MAX_COLORS = 8;

const hexToVec3 = (hex) => {
  const c = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return new THREE.Vector3(r, g, b);
};

// Resolves a pixel or CSS-length offset value (number | "12px" | "10%") into pixels,
// given the reference dimension (container width or height) it's relative to.
const resolveLength = (value, referencePx) => {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return value;
  const str = String(value).trim();
  if (str.endsWith("%")) {
    return (parseFloat(str) / 100) * referencePx;
  }
  if (str.endsWith("px")) {
    return parseFloat(str);
  }
  const n = parseFloat(str);
  return Number.isNaN(n) ? 0 : n;
};

const ANIMATION_TYPES = { rotate: 0, rotate3d: 1, hover: 2 };

function FullscreenShader({
  intensity,
  speed,
  animationType,
  colors,
  distort,
  paused,
  offset,
  hoverDampness,
  rayCount,
}) {
  const shaderRef = useRef(null);
  const { size, gl } = useThree();

  const elapsedRef = useRef(0);
  const hoverRef = useRef([0, 0]);

  const colorVectors = useMemo(() => {
    const list = (colors || []).slice(0, MAX_COLORS).map((hex) => hexToVec3(hex));
    // Pad up to MAX_COLORS so the uniform array is always fully sized.
    while (list.length < MAX_COLORS) {
      list.push(new THREE.Vector3(0, 0, 0));
    }
    return list;
  }, [colors]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector3(size.width, size.height, 1) },
      uIntensity: { value: intensity },
      uDistort: { value: distort },
      uRayCount: { value: rayCount || 0 },
      uAnimationType: { value: ANIMATION_TYPES[animationType] ?? ANIMATION_TYPES.rotate3d },
      uOffset: { value: new THREE.Vector2(0, 0) },
      uColors: { value: colorVectors },
      uColorCount: { value: Math.min(colors?.length || 0, MAX_COLORS) },
    }),
    [animationType, colorVectors, colors?.length, distort, intensity, rayCount, size.height, size.width]
  );

  useFrame(({ pointer }, delta) => {
    if (!shaderRef.current) return;
    const u = shaderRef.current.uniforms;

    if (!paused) {
      elapsedRef.current += delta * speed;
    }
    u.uTime.value = elapsedRef.current;

    const bufferSize = new THREE.Vector2();
    gl.getDrawingBufferSize(bufferSize);
    u.uResolution.value.set(bufferSize.x, bufferSize.y, 1);

    u.uIntensity.value = intensity;
    u.uDistort.value = distort;
    u.uRayCount.value = rayCount || 0;
    u.uAnimationType.value = ANIMATION_TYPES[animationType] ?? ANIMATION_TYPES.rotate3d;
    u.uColors.value = colorVectors;
    u.uColorCount.value = Math.min(colors?.length || 0, MAX_COLORS);

    // Static offset from props, converted from px/CSS-length into shader uv space.
    const staticX = resolveLength(offset?.x, size.width) / size.height;
    const staticY = resolveLength(offset?.y, size.height) / size.height;

    // Hover-driven offset: pointer is normalized (-1..1); smooth it with hoverDampness.
    let hoverX = 0;
    let hoverY = 0;
    if (animationType === "hover") {
      const targetX = pointer.x * 0.5;
      const targetY = pointer.y * 0.5;
      if (hoverDampness > 0) {
        const tau = hoverDampness;
        const factor = Math.min(1, 1 - Math.exp(-delta / tau));
        hoverRef.current[0] += (targetX - hoverRef.current[0]) * factor;
        hoverRef.current[1] += (targetY - hoverRef.current[1]) * factor;
      } else {
        hoverRef.current[0] = targetX;
        hoverRef.current[1] = targetY;
      }
      hoverX = hoverRef.current[0];
      hoverY = hoverRef.current[1];
    }

    u.uOffset.value.set(staticX + hoverX, staticY + hoverY);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderRef}
        depthWrite={false}
        depthTest={false}
        transparent={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;

          #define MAX_COLORS 8
          #define TWO_PI 6.28318530718

          uniform vec3 uResolution;
          uniform float uTime;
          uniform float uIntensity;
          uniform float uDistort;
          uniform float uRayCount;
          uniform int uAnimationType; // 0 rotate, 1 rotate3d, 2 hover
          uniform vec2 uOffset;
          uniform vec3 uColors[MAX_COLORS];
          uniform int uColorCount;

          float randVal(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

          float noise2d(vec2 p){
              vec2 i = floor(p);
              vec2 f = fract(p);
              vec2 u = f*f*(3.0-2.0*f);
              float a = randVal(i + vec2(0.0, 0.0));
              float b = randVal(i + vec2(1.0, 0.0));
              float c = randVal(i + vec2(0.0, 1.0));
              float d = randVal(i + vec2(1.0, 1.0));
              return (a + (b-a)*u.x + (c-a)*u.y + (a-b-c+d)*u.x*u.y) / 4.0;
          }

          float mirrored(float t, float shift){
              t = fract(t + shift);
              return 2.0*abs(t-0.5);
          }

          float radialLayer(float angle, float radius){
              const float SCALE = 45.0;
              radius = pow(radius, 0.01);
              float offset = -uTime * 0.07;
              vec2 pos = vec2(mirrored(angle, 0.1), radius + offset);
              float n1 = noise2d(pos * SCALE);
              pos = 2.1*vec2(mirrored(angle,0.4), radius+offset);
              float n2 = noise2d(pos * SCALE);
              pos = 3.7*vec2(mirrored(angle,0.8), radius+offset);
              float n3 = noise2d(pos * SCALE);
              pos = 5.8*vec2(mirrored(angle,0.0), radius+offset);
              float n4 = noise2d(pos * SCALE);
              return pow((n1 + 0.5*n2 + 0.25*n3 + 0.125*n4) * 3.0, 1.0);
          }

          vec3 applyColor(float v){
              v = clamp(v, 0.0, 1.0);
              vec3 col = mix(vec3(0.0,0.0,1.1), vec3(0.0,1.0,1.0), v);
              col = mix(col, vec3(1.0,1.0,1.0), v*4.0-3.0) * v;
              col = max(col, vec3(0.0));
              col = mix(col, vec3(1.0, 0.25, 1.0), smoothstep(1.0, 0.2, v) * smoothstep(0.15, 0.9, v));
              return col;
          }

          vec3 colorFromGradient(float v){
              v = clamp(v, 0.0, 1.0);
              if (uColorCount <= 1) return uColors[0];
              float scaled = v * float(uColorCount - 1);
              int idx = int(floor(scaled));
              float frac = fract(scaled);
              vec3 c0 = uColors[idx];
              vec3 c1 = uColors[idx + 1];
              return mix(c0, c1, frac);
          }

          void renderMain(out vec4 fragColor, in vec2 fragCoord){
              vec2 uv = (fragCoord * 2.0 - uResolution.xy) / uResolution.y * 0.5;

              // focal-origin offset (static prop offset + hover tracking, both already
              // converted to this same uv space on the CPU side)
              uv -= uOffset;

              // motion style
              if (uAnimationType == 0) {
                  // rotate: simple planar rotation
                  float a = uTime * 0.15;
                  float ca = cos(a);
                  float sa = sin(a);
                  uv = mat2(ca, -sa, sa, ca) * uv;
              } else if (uAnimationType == 1) {
                  // rotate3d: lift into 3D, rotate on two axes, project back down
                  vec3 p3 = vec3(uv, sqrt(max(0.0, 1.0 - dot(uv, uv))));
                  float ax = uTime * 0.21;
                  float ay = uTime * 0.33;
                  mat3 rotX = mat3(
                      1.0, 0.0, 0.0,
                      0.0, cos(ax), -sin(ax),
                      0.0, sin(ax), cos(ax)
                  );
                  mat3 rotY = mat3(
                      cos(ay), 0.0, sin(ay),
                      0.0, 1.0, 0.0,
                      -sin(ay), 0.0, cos(ay)
                  );
                  p3 = rotY * rotX * p3;
                  uv = p3.xy;
              }
              // uAnimationType == 2 (hover): no auto-rotation, uv already tracks the pointer

              float dist = dot(uv, uv);
              float ang = atan(uv.y, uv.x) / TWO_PI;

              // organic domain-warp distortion
              if (uDistort > 0.0) {
                  float d = noise2d(vec2(ang * 3.0, dist * 3.0) + uTime * 0.05);
                  ang += (d - 0.5) * uDistort * 0.6;
                  dist += (d - 0.5) * uDistort * 0.3;
              }

              float val = radialLayer(ang, dist);
              val = val * 2.5 - 1.4;
              val = mix(0.0, val, 0.8 * smoothstep(0.0, 0.8, dist));

              // angular comb filter -> discrete ray spokes
              if (uRayCount > 0.0) {
                  float spoke = fract(ang * uRayCount);
                  float comb = smoothstep(0.0, 0.12, spoke) * smoothstep(1.0, 0.88, spoke);
                  val *= mix(0.15, 1.0, comb);
              }

              vec3 col = (uColorCount > 0) ? colorFromGradient(val) : applyColor(val);
              col *= uIntensity;

              fragColor = vec4(col, 1.0);
          }

          void main(){
            vec4 outColor;
            renderMain(outColor, gl_FragCoord.xy);
            gl_FragColor = outColor;
          }
        `}
      />
    </mesh>
  );
}

export const PrismaticBurst = ({
  intensity = 2,
  speed = 0.5,
  animationType = "rotate3d",
  colors = [],
  distort = 0,
  paused = false,
  offset = { x: 0, y: 0 },
  hoverDampness = 0,
  rayCount = undefined,
  mixBlendMode = "lighten",
  className,
}) => {
  return (
    <div
      className={(
        "flex flex-col items-center gap-4 p-0 rounded-lg w-full h-screen",
        className
      )}
      style={{ mixBlendMode: mixBlendMode === "none" ? "normal" : mixBlendMode }}
    >
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} dpr={[1, 2]}>
        <color attach="background" args={["#000000"]} />
        <FullscreenShader
          intensity={intensity}
          speed={speed}
          animationType={animationType}
          colors={colors}
          distort={distort}
          paused={paused}
          offset={offset}
          hoverDampness={hoverDampness}
          rayCount={rayCount}
        />
      </Canvas>
    </div>
  );
};

export default PrismaticBurst;
