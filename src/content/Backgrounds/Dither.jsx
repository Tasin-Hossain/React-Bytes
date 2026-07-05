import { useEffect, useRef } from "react";
import * as THREE from "three";

// npm install three

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULTS = {
  animationMode:  "flow",      // "flow" | "pulse" | "wave" | "spiral"
  animationSpeed: 0.4,         // 0 – 3
  gradientAngle:  45,          // 0 – 360 (degrees)
  pixelSize:      3,           // 1 – 16 (CSS px per dither block)
  colorLevels:    2,           // 2 – 8
  colorDark:      "#000000",
  colorLight:     "#00d4ff",
  opacity:        1.0,         // 0 – 1
  backgroundColor: "transparent",
  dpr:            1.0,         // keep 1 for pixel-perfect retro look
};

const ANIM_MODES = { flow: 0, pulse: 1, wave: 2, spiral: 3 };

// ─── hex → THREE.Vector3 (0–1) ───────────────────────────────────────────────
function hex2v3(h) {
  const c = h.replace("#", "");
  return new THREE.Vector3(
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255
  );
}

// ─── GLSL shaders ─────────────────────────────────────────────────────────────
const VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2  uResolution;
uniform float uGradientAngle;
uniform float uAnimSpeed;
uniform int   uAnimMode;
uniform float uPixelSize;
uniform float uColorLevels;
uniform vec3  uColorDark;
uniform vec3  uColorLight;
uniform float uOpacity;

float bayer(int x, int y) {
  int i = y * 4 + x;
  if(i==0)  return  0.0/16.0; if(i==1)  return  8.0/16.0;
  if(i==2)  return  2.0/16.0; if(i==3)  return 10.0/16.0;
  if(i==4)  return 12.0/16.0; if(i==5)  return  4.0/16.0;
  if(i==6)  return 14.0/16.0; if(i==7)  return  6.0/16.0;
  if(i==8)  return  3.0/16.0; if(i==9)  return 11.0/16.0;
  if(i==10) return  1.0/16.0; if(i==11) return  9.0/16.0;
  if(i==12) return 15.0/16.0; if(i==13) return  7.0/16.0;
  if(i==14) return 13.0/16.0; return    5.0/16.0;
}

void main() {
  vec2 snapped  = floor(gl_FragCoord.xy / uPixelSize) * uPixelSize + uPixelSize * 0.5;
  vec2 uv       = snapped / uResolution;
  vec2 centered = uv - 0.5;

  float rad = uGradientAngle * 3.14159265 / 180.0;
  vec2  dir = vec2(cos(rad), -sin(rad));
  float t   = uTime * uAnimSpeed;
  float raw;

  if (uAnimMode == 0) {
    // Flow — sweeps along gradient direction
    raw = fract(dot(centered, dir) + 0.5 + t * 0.12);

  } else if (uAnimMode == 1) {
    // Pulse — radial breathe from center
    float pulse = 0.5 + 0.5 * sin(t * 3.14159 * 2.0);
    raw = fract(length(centered) * 2.0 - pulse);

  } else if (uAnimMode == 2) {
    // Wave — sine ripple across gradient
    float along = dot(centered, dir) + 0.5;
    float perp  = dot(centered, vec2(-dir.y, dir.x));
    raw = fract(along + 0.3 * sin(perp * 8.0 + t * 4.0) + t * 0.1);

  } else {
    // Spiral — rotating angle + radius
    float angle = atan(centered.y, centered.x);
    raw = fract((angle / (2.0 * 3.14159)) + length(centered) * 2.0 - t * 0.3);
  }

  // smooth ordered-dither quantization — no banding
  float levels    = max(2.0, uColorLevels);
  float scaled    = raw * (levels - 1.0);
  float lo        = floor(scaled);
  float hi        = min(lo + 1.0, levels - 1.0);
  float frac      = scaled - lo;

  int bx = int(mod(floor(gl_FragCoord.x / uPixelSize), 4.0));
  int by = int(mod(floor(gl_FragCoord.y / uPixelSize), 4.0));
  float threshold = bayer(bx, by);
  float useLo     = step(frac, threshold);

  float t01 = mix(hi, lo, useLo) / (levels - 1.0);
  vec3  col = mix(uColorDark, uColorLight, t01);

  gl_FragColor = vec4(col, uOpacity);
}
`;

// ─── Core hook ────────────────────────────────────────────────────────────────
function useDither(canvasRef, cfg) {
  const threeRef = useRef(null);
  const rafRef   = useRef(null);
  const cfgRef   = useRef(cfg);
  // eslint-disable-next-line react-hooks/refs
  cfgRef.current = cfg;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── setup Three.js ───────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, cfg.dpr));

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime:          { value: 0.0 },
      uResolution:    { value: new THREE.Vector2(800, 450) },
      uGradientAngle: { value: cfg.gradientAngle },
      uAnimSpeed:     { value: cfg.animationSpeed },
      uAnimMode:      { value: ANIM_MODES[cfg.animationMode] ?? 0 },
      uPixelSize:     { value: cfg.pixelSize },
      uColorLevels:   { value: cfg.colorLevels },
      uColorDark:     { value: hex2v3(cfg.colorDark) },
      uColorLight:    { value: hex2v3(cfg.colorLight) },
      uOpacity:       { value: cfg.opacity },
    };

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-1, -1, 3, -1, -1, 3]), 2)
    );

    const mat = new THREE.RawShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
    });

    scene.add(new THREE.Mesh(geo, mat));
    threeRef.current = { renderer, scene, camera, uniforms };

    // ── resize ───────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = canvas.offsetWidth  || 800;
      const h = canvas.offsetHeight || 450;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
    });
    ro.observe(canvas);

    // ── render loop ──────────────────────────────────────────────────────────
    function loop(ts) {
      rafRef.current = requestAnimationFrame(loop);
      const c = cfgRef.current;
      const u = uniforms;
      u.uTime.value          = ts * 0.001;
      u.uGradientAngle.value = c.gradientAngle;
      u.uAnimSpeed.value     = c.animationSpeed;
      u.uAnimMode.value      = ANIM_MODES[c.animationMode] ?? 0;
      u.uPixelSize.value     = c.pixelSize;
      u.uColorLevels.value   = c.colorLevels;
      u.uColorDark.value     = hex2v3(c.colorDark);
      u.uColorLight.value    = hex2v3(c.colorLight);
      u.uOpacity.value       = c.opacity;
      renderer.render(scene, camera);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      mat.dispose();
      geo.dispose();
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);
}

// ─── Dither component ─────────────────────────────────────────────────────────
export default function Dither({
  animationMode   = DEFAULTS.animationMode,
  animationSpeed  = DEFAULTS.animationSpeed,
  gradientAngle   = DEFAULTS.gradientAngle,
  pixelSize       = DEFAULTS.pixelSize,
  colorLevels     = DEFAULTS.colorLevels,
  colorDark       = DEFAULTS.colorDark,
  colorLight      = DEFAULTS.colorLight,
  opacity         = DEFAULTS.opacity,
  backgroundColor = DEFAULTS.backgroundColor,
  dpr             = DEFAULTS.dpr,
  className       = "",
  style           = {},
  children,
}) {
  const canvasRef = useRef(null);
  useDither(canvasRef, {
    animationMode, animationSpeed, gradientAngle,
    pixelSize, colorLevels, colorDark, colorLight,
    opacity, backgroundColor, dpr,
  });

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: backgroundColor !== "transparent" ? backgroundColor : undefined, ...style }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

// ─── Props reference ──────────────────────────────────────────────────────────
// export const PROPS_DATA = [
//   { name: "animationMode",  type: '"flow" | "pulse" | "wave" | "spiral"', def: '"flow"',        desc: "Animation pattern. flow = directional sweep, pulse = radial breathe, wave = sine ripple, spiral = rotating spiral." },
//   { name: "animationSpeed", type: "number",  def: "0.4",           desc: "Animation playback speed (0–3). 0 = frozen." },
//   { name: "gradientAngle",  type: "number",  def: "45",            desc: "Direction of the gradient in degrees (0–360). Used by flow and wave modes." },
//   { name: "pixelSize",      type: "number",  def: "3",             desc: "Dither block size in CSS px (1–16). Larger = chunkier retro look." },
//   { name: "colorLevels",    type: "number",  def: "2",             desc: "Quantization steps (2–8). Higher = more gradient bands, smooth via Bayer dither." },
//   { name: "colorDark",      type: "string",  def: '"#000000"',     desc: "Dark end of the dither palette (hex)." },
//   { name: "colorLight",     type: "string",  def: '"#00d4ff"',     desc: "Light end of the dither palette (hex)." },
//   { name: "opacity",        type: "number",  def: "1.0",           desc: "Master alpha of the canvas layer (0–1)." },
//   { name: "backgroundColor",type: "string",  def: '"transparent"', desc: "Wrapper background. Transparent by default so parent bg shows through." },
//   { name: "dpr",            type: "number",  def: "1.0",           desc: "Device pixel ratio cap (1–3). Keep at 1 for pixel-perfect retro look." },
//   { name: "className",      type: "string",  def: '""',            desc: "Tailwind / CSS classes on the wrapper div." },
//   { name: "style",          type: "React.CSSProperties", def: "{}", desc: "Inline styles on the wrapper div." },
//   { name: "children",       type: "React.ReactNode", def: "undefined", desc: "Content rendered on top of the canvas inside a relative z-10 div." },
// ];
