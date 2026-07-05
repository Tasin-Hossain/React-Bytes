import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const hexToRGB = hex => {
  const c = hex.replace('#', '').padEnd(6, '0');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const VioletStripes = ({
  className,
  dpr,
  paused = false,
  colorLight = '#e8d9ff',
  colorDark = '#06040f',
  angle = 0,
  noise = 0.4,
  blindCount = 28,
  blindMinWidth = 12,
  stripeWidth = 0.9,
  gapSoftness = 14,
  gradientPosition = 0.6,
  gradientSoftness = 0.55,
  depth = 0.5
}) => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const geometryRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1),
      alpha: false,
      antialias: true
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas;

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

    const fragment = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3  iResolution;
uniform float iTime;

uniform float uAngle;
uniform float uNoise;
uniform float uBlindCount;
uniform float uStripeWidth;
uniform float uGapSoftness;
uniform float uGradPos;
uniform float uGradSoftness;
uniform float uDepth;
uniform vec3  uColorLight;
uniform vec3  uColorDark;

varying vec2 vUv;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rotate2D(vec2 p, float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c) * p;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv0 = fragCoord.xy / iResolution.xy;

    float aspect = iResolution.x / iResolution.y;
    vec2 p = uv0 * 2.0 - 1.0;
    p.x *= aspect;
    vec2 pr = rotate2D(p, uAngle);
    pr.x /= aspect;
    vec2 uv = pr * 0.5 + 0.5;

    /* horizontal gradient between the two colors, smoothed */
    float g = smoothstep(uGradPos - uGradSoftness, uGradPos + uGradSoftness, uv.x);
    g = g*g*(3.0-2.0*g);
    vec3 base = mix(uColorDark, uColorLight, g);

    /* soft bloom bleeding from the light side */
    float glow = smoothstep(uGradPos + uGradSoftness*0.3, 1.0, uv.x);
    base += (uColorLight - uColorDark) * glow * 0.08;

    /* static vertical stripes */
    float local = fract(uv.x * max(uBlindCount, 1.0));
    float half_ = uStripeWidth * 0.5;
    float edge  = (1.0/max(uGapSoftness,1.0)) * 0.08;
    float mask  = smoothstep(0.5-half_-edge, 0.5-half_+edge, local)
                * smoothstep(0.5+half_+edge, 0.5+half_-edge, local);

    /* rounded ridge: highlight on one side, shadow on the other */
    float c = (local - 0.5) * 2.0;
    float ridgeShape = cos(c * 1.5707963);
    float lightSide = clamp(-c, 0.0, 1.0);
    float shadowSide = clamp(c, 0.0, 1.0);

    vec3 col = base;
    col += vec3(1.0) * lightSide * uDepth * 0.22 * ridgeShape;
    col -= vec3(1.0) * shadowSide * uDepth * 0.30 * ridgeShape;
    col *= mix(1.0 - uDepth*0.55, 1.0, mask);

    col += (rand(gl_FragCoord.xy + iTime) - 0.5) * uNoise * 0.1;

    vec2 vc = uv0 - 0.5;
    float vign = 1.0 - smoothstep(0.55, 1.05, length(vc*vec2(1.0,1.15)));
    col *= mix(0.88, 1.0, vign);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}

void main() {
    vec4 color;
    mainImage(color, vUv * iResolution.xy);
    gl_FragColor = color;
}
`;

    const uniforms = {
      iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
      iTime: { value: 0 },
      uAngle: { value: (angle * Math.PI) / 180 },
      uNoise: { value: noise },
      uBlindCount: { value: Math.max(1, blindCount) },
      uStripeWidth: { value: stripeWidth },
      uGapSoftness: { value: gapSoftness },
      uGradPos: { value: gradientPosition },
      uGradSoftness: { value: Math.max(gradientSoftness, 0.02) },
      uDepth: { value: depth },
      uColorLight: { value: hexToRGB(colorLight) },
      uColorDark: { value: hexToRGB(colorDark) }
    };

    const program = new Program(gl, { vertex, fragment, uniforms });
    programRef.current = program;

    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];

      if (blindMinWidth && blindMinWidth > 0) {
        const maxByMinWidth = Math.max(1, Math.floor(rect.width / blindMinWidth));
        const effective = blindCount ? Math.min(blindCount, maxByMinWidth) : maxByMinWidth;
        uniforms.uBlindCount.value = Math.max(1, effective);
      } else {
        uniforms.uBlindCount.value = Math.max(1, blindCount);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const loop = t => {
      rafRef.current = requestAnimationFrame(loop);
      uniforms.iTime.value = t * 0.001;
      if (!paused && programRef.current && meshRef.current) {
        try {
          renderer.render({ scene: meshRef.current });
        } catch (e) {
          console.error(e);
        }
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      const callIfFn = (obj, key) => {
        if (obj && typeof obj[key] === 'function') {
          obj[key].call(obj);
        }
      };
      callIfFn(programRef.current, 'remove');
      callIfFn(geometryRef.current, 'remove');
      callIfFn(meshRef.current, 'remove');
      callIfFn(rendererRef.current, 'destroy');
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [
    dpr,
    paused,
    colorLight,
    colorDark,
    angle,
    noise,
    blindCount,
    blindMinWidth,
    stripeWidth,
    gapSoftness,
    gradientPosition,
    gradientSoftness,
    depth
  ]);

  return <div ref={containerRef} className={`w-full h-full overflow-hidden relative ${className ?? ''}`} />;
};

export default VioletStripes;
