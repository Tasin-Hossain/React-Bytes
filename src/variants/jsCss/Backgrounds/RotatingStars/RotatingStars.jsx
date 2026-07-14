// JS-CSS variant
import { useEffect, useRef, useState } from "react";

const VERT_SRC = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAG_SRC = `
  precision highp float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform float uSpeed;
  uniform float uThickness;
  uniform float uRoundness;
  uniform float uOpacity;
  uniform vec3 uColor;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
    uv -= uCenter;

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float spacing = 1.0 / max(uRadius, 0.001);
    float rn = r / spacing;
    float idxCenter = floor(rn);

    vec3 col = vec3(0.0);
    float alpha = 0.0;

    for (int k = -1; k <= 1; k++) {
      float idx = idxCenter + float(k);
      if (idx < 0.0) continue;

      float h1 = hash(idx * 1.37 + 0.5);
      float h2 = hash(idx * 2.71 + 4.0);
      float h3 = hash(idx * 3.14 + 8.0);

      float actualR = (idx + 0.5) * spacing;
      float arcLen = mix(0.4, 1.8, h2);
      float angOffset = uTime * uSpeed + h3 * 6.2831853;
      float ang = mod(a - angOffset, 6.2831853);

      float capSoft = clamp(mix(0.004, 0.5, uRoundness) * arcLen, 0.0008, arcLen * 0.49);
      float edge0 = smoothstep(0.0, capSoft, ang);
      float edge1 = smoothstep(0.0, capSoft, arcLen - ang);
      float arcMask = edge0 * edge1;

      float d = abs(r - actualR);
      float halfThickness = uThickness * 0.5;
      float coreEpsilon = 0.0008;
      float lineMask = 1.0 - smoothstep(halfThickness - coreEpsilon, halfThickness + coreEpsilon, d);

      float trailFade = 1.0 - smoothstep(0.0, arcLen, ang);

      float intensity = lineMask * arcMask * trailFade;

      vec3 tint = mix(uColor, uColor * vec3(0.55, 0.6, 1.5), h1);
      col += tint * intensity;
      alpha = max(alpha, intensity);
    }

    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`;

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean, 16);
  return [
    ((bigint >> 16) & 255) / 255,
    ((bigint >> 8)  & 255) / 255,
    (bigint & 255)         / 255,
  ];
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(info || "Shader compile failed");
  }
  return shader;
}

export default function RotatingStars({
  x = 0,
  y = 0,
  radius = 15,
  speed = 1.5,
  thickness = 0.01,
  roundness = 1,
  blur = 0,
  opacity = 1,
  color = "#8b5cf6",
  className = "",
}) {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanupFns = [];

    try {
      const gl =
        canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false }) ||
        canvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: false });
      if (!gl) throw new Error("WebGL not supported");

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);

      const vs = compileShader(gl, gl.VERTEX_SHADER,   VERT_SRC);
      const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
      }
      gl.useProgram(program);

      const quad   = new Float32Array([-1, -1, 3, -1, -1, 3]);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

      const aPosition = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      const uResolution = gl.getUniformLocation(program, "uResolution");
      const uTime       = gl.getUniformLocation(program, "uTime");
      const uCenter     = gl.getUniformLocation(program, "uCenter");
      const uRadius     = gl.getUniformLocation(program, "uRadius");
      const uSpeed      = gl.getUniformLocation(program, "uSpeed");
      const uThickness  = gl.getUniformLocation(program, "uThickness");
      const uRoundness  = gl.getUniformLocation(program, "uRoundness");
      const uOpacity    = gl.getUniformLocation(program, "uOpacity");
      const uColor      = gl.getUniformLocation(program, "uColor");

      const rgb = hexToRgb(color);

      function resize() {
        const w   = canvas.clientWidth  || 800;
        const h   = canvas.clientHeight || 500;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width  = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      resize();
      window.addEventListener("resize", resize);

      const start = performance.now();
      let frameId;
      function render(now) {
        frameId = requestAnimationFrame(render);
        const t = (now - start) / 1000;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform1f(uTime,       t);
        gl.uniform2f(uCenter,     x, y);
        gl.uniform1f(uRadius,     radius);
        gl.uniform1f(uSpeed,      speed);
        gl.uniform1f(uThickness,  thickness);
        gl.uniform1f(uRoundness,  roundness);
        gl.uniform1f(uOpacity,    opacity);
        gl.uniform3f(uColor,      rgb[0], rgb[1], rgb[2]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      frameId = requestAnimationFrame(render);

      cleanupFns.push(() => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", resize);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buffer);
      });
    } catch (err) {
      console.error("RotatingStars failed to init:", err);
      setError(err.message || String(err));
    }

    return () => cleanupFns.forEach((fn) => fn());
  }, [x, y, radius, speed, thickness, roundness, opacity, color]);

  const style = {
    wrapper: {
      position:  "relative",
      width:     "100%",
      height:    "100%",
      minHeight: "300px",
    },
    canvas: {
      width:   "100%",
      height:  "100%",
      display: "block",
      filter:  blur > 0 ? `blur(${blur}px)` : "none",
    },
    error: {
      position:   "absolute",
      inset:      0,
      display:    "flex",
      alignItems: "center",
      justifyContent: "center",
      color:      "#f87171",
      fontSize:   "0.75rem",
      fontFamily: "monospace",
      padding:    "1rem",
    },
  };

  const classes = `${className}`;

  return (
    <div style={style.wrapper} className={classes}>
      <canvas ref={canvasRef} style={style.canvas} />
      {error && (
        <div style={style.error}>
          WebGL init error: {error}
        </div>
      )}
    </div>
  );
}