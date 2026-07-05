import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const hexToRGB = hex => {
  const c = hex.replace('#', '').padEnd(6, '0');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const bgToClearColor = bg => {
  if (!bg || bg === 'transparent') return [0, 0, 0, 0];
  const [r, g, b] = hexToRGB(bg);
  return [r, g, b, 1];
};

const FireStripes = ({
  className,
  dpr,
  paused = false,
  color = '#ffcc00',
  bgColor = 'transparent',
  angle = 0,
  speed = 4,
  flicker = 7,
  glow = 7,
  centerX = 33,
  spread = 26,
  distort = 3,
  noise = 2,
  blindCount = 24,
  stripeWidth = 0.5,
  sharpness = 6
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
      alpha: true,
      premultipliedAlpha: false,
      antialias: true
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const clearColor = bgToClearColor(bgColor);

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
uniform float uSharpness;
uniform float uSpeed;
uniform float uFlicker;
uniform float uGlow;
uniform float uCenterX;
uniform float uSpread;
uniform float uDistort;
uniform vec3  uColor;

varying vec2 vUv;

float hash(float n){ return fract(sin(n)*43758.5453); }
float noise1(float x){
  float i=floor(x); float f=fract(x);
  return mix(hash(i), hash(i+1.0), f*f*(3.0-2.0*f));
}
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

    float t = iTime * (uSpeed/4.0);

    float px = uv.x;
    if (uDistort > 0.0) {
      px += sin(uv.y * 6.0 + t*0.6) * 0.008 * uDistort;
    }

    float cx = uCenterX / 100.0;
    float sprN = uSpread / 100.0;

    float idx   = floor(px * uBlindCount);
    float local = fract(px * uBlindCount);

    float phase  = hash(idx * 7.3 + 1.5) * 6.2832;
    float fspeed = 0.8 + hash(idx * 3.1) * 1.4;
    float flick  = 1.0 + (noise1(t * fspeed * (uFlicker/5.0) + phase) - 0.5) * 0.55 * (uFlicker/5.0);

    float scx = (idx + 0.5) / uBlindCount;
    float dx  = scx - cx;
    float asym = dx > 0.0
      ? exp(-dx*dx/(sprN*sprN)*3.8)
      : exp(-dx*dx/(sprN*sprN)*1.5);
    float bright = clamp(asym * flick * (0.65 + hash(idx*5.7)*0.35) * (uGlow/5.0), 0.0, 1.0);

    float half_ = uStripeWidth * 0.5;
    float edge  = (1.0/max(uSharpness,1.0)) * 0.06;
    float mask  = smoothstep(0.5-half_-edge, 0.5-half_+edge, local)
                * smoothstep(0.5+half_+edge, 0.5+half_-edge, local);

    float rip = sin(uv.y*22.0 + t*(1.2+hash(idx)*0.9) + phase) * 0.015*(uFlicker/5.0);
    mask = clamp(mask + rip*mask, 0.0, 1.0);

    float intensity = bright * mask;

    vec3 col = uColor;
    float alpha = clamp(intensity, 0.0, 1.0);

    float bleed = exp(-dx*dx/(sprN*sprN*0.7)) * (uGlow*0.055);
    alpha = clamp(alpha + bleed, 0.0, 1.0);

    col += (rand(gl_FragCoord.xy + iTime) - 0.5) * (uNoise/10.0);

    float vign = 1.0 - smoothstep(0.3, 1.4, length((uv-0.5)*vec2(1.0,0.75)));
    alpha *= vign;

    fragColor = vec4(clamp(col, 0.0, 1.0), alpha);
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
      uSharpness: { value: sharpness },
      uSpeed: { value: speed },
      uFlicker: { value: flicker },
      uGlow: { value: glow },
      uCenterX: { value: centerX },
      uSpread: { value: spread },
      uDistort: { value: distort },
      uColor: { value: hexToRGB(color) }
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
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const loop = t => {
      rafRef.current = requestAnimationFrame(loop);
      uniforms.iTime.value = t * 0.001;
      if (!paused && programRef.current && meshRef.current) {
        try {
          gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
          gl.clear(gl.COLOR_BUFFER_BIT);
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
    color,
    bgColor,
    angle,
    speed,
    flicker,
    glow,
    centerX,
    spread,
    distort,
    noise,
    blindCount,
    stripeWidth,
    sharpness
  ]);

  return <div ref={containerRef} className={`w-full h-full overflow-hidden relative ${className ?? ''}`} />;
};

export default FireStripes;
