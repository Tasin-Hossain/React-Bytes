import{ useEffect, useRef, useState } from "react";

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
  uniform float uSpeed;
  uniform float uWaveCount;      // number of stacked wave rows
  uniform float uWavesPerWidth;  // horizontal periods across the width
  uniform float uAmplitude;      // fraction of row height
  uniform float uLineWidth;      // px, controls glow softness
  uniform float uPhaseOffset;    // radians shift per row (PI = fully interlocked)
  uniform vec3 uColor;
  uniform float uBrightness;
  uniform float uCoreStrength;
  uniform float uOpacity;

  float waveCenter(float row, float x, float rowH, float freq, float t) {
    float phase = row * uPhaseOffset;
    return (row + 0.5) * rowH + sin(x * freq + t * uSpeed + phase) * (uAmplitude * rowH);
  }

  void main() {
    vec2 px = gl_FragCoord.xy;
    float rowH = uResolution.y / uWaveCount;
    float freq = 6.2831853 * uWavesPerWidth / uResolution.x;

    float rowF = floor(px.y / rowH);
    float t = uTime;

    float sigma = max(uLineWidth, 0.5);
    float coreSigma = sigma * 0.18;

    float glowSum = 0.0;
    float coreSum = 0.0;

    for (int i = -1; i <= 1; i++) {
      float row = rowF + float(i);
      float cy = waveCenter(row, px.x, rowH, freq, t);
      float d = px.y - cy;
      float d2 = d * d;
      glowSum += exp(-d2 / (2.0 * sigma * sigma));
      coreSum += exp(-d2 / (2.0 * coreSigma * coreSigma));
    }

    glowSum = clamp(glowSum, 0.0, 1.6);
    coreSum = clamp(coreSum, 0.0, 1.0);

    vec3 col = uColor * glowSum * uBrightness;
    col += vec3(1.0) * coreSum * uBrightness * uCoreStrength;

    col *= uOpacity;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(
    clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean,
    16
  );
  return [
    ((bigint >> 16) & 255) / 255,
    ((bigint >> 8) & 255) / 255,
    (bigint & 255) / 255,
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

export function WaveWeave({
  speed = 0.6,
  waveCount = 14,
  wavesPerWidth = 6,
  amplitude = 0.55,
  lineWidth = 6,
  phaseOffset = Math.PI,
  color = "#6a5cff",
  brightness = 1.1,
  coreStrength = 0.9,
  opacity = 1,
  blur = 0,
  className = "",
}) {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanupFns = [];

    try {
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) throw new Error("WebGL not supported");

      const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
      const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
      }
      gl.useProgram(program);

      // additive blending so overlapping glows brighten instead of clipping
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      const quad = new Float32Array([-1, -1, 3, -1, -1, 3]);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

      const aPosition = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      const loc = (name) => gl.getUniformLocation(program, name);
      const uResolution = loc("uResolution");
      const uTime = loc("uTime");
      const uSpeed = loc("uSpeed");
      const uWaveCount = loc("uWaveCount");
      const uWavesPerWidth = loc("uWavesPerWidth");
      const uAmplitude = loc("uAmplitude");
      const uLineWidth = loc("uLineWidth");
      const uPhaseOffset = loc("uPhaseOffset");
      const uColor = loc("uColor");
      const uBrightness = loc("uBrightness");
      const uCoreStrength = loc("uCoreStrength");
      const uOpacity = loc("uOpacity");

      const rgb = hexToRgb(color);

      function resize() {
        const w = canvas.clientWidth || 800;
        const h = canvas.clientHeight || 500;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      resize();
      window.addEventListener("resize", resize);

      const startT = performance.now();
      let frameId;
      function render(now) {
        frameId = requestAnimationFrame(render);
        const t = (now - startT) / 1000;

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform1f(uTime, t);
        gl.uniform1f(uSpeed, speed);
        gl.uniform1f(uWaveCount, waveCount);
        gl.uniform1f(uWavesPerWidth, wavesPerWidth);
        gl.uniform1f(uAmplitude, amplitude);
        gl.uniform1f(uLineWidth, lineWidth);
        gl.uniform1f(uPhaseOffset, phaseOffset);
        gl.uniform3f(uColor, rgb[0], rgb[1], rgb[2]);
        gl.uniform1f(uBrightness, brightness);
        gl.uniform1f(uCoreStrength, coreStrength);
        gl.uniform1f(uOpacity, opacity);

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
      console.error("WaveWeave failed to init:", err);
      setError(err.message || String(err));
    }

    return () => cleanupFns.forEach((fn) => fn());
  }, [
    speed, waveCount, wavesPerWidth, amplitude, lineWidth, phaseOffset,
    color, brightness, coreStrength, opacity,
  ]);

  return (
    <div className={`relative w-full h-full ${className}`} style={{ minHeight: "300px" }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 text-xs font-mono p-4 bg-black">
          WebGL init error: {error}
        </div>
      )}
    </div>
  );
}

// --- Demo wrapper (default export) so the artifact renders self-contained ---
export default function WaveWeaveDemo() {
  const [speed, setSpeed] = useState(0.6);
  const [waveCount, setWaveCount] = useState(14);
  const [wavesPerWidth, setWavesPerWidth] = useState(6);
  const [amplitude, setAmplitude] = useState(0.55);
  const [lineWidth, setLineWidth] = useState(6);
  const [phaseOffset, setPhaseOffset] = useState(Math.PI);
  const [color, setColor] = useState("#6a5cff");
  const [brightness, setBrightness] = useState(1.1);
  const [coreStrength, setCoreStrength] = useState(0.9);
  const [blur, setBlur] = useState(0);

  return (
    <div className="relative w-screen bg-black" style={{ height: "100vh" }}>
      <div className="absolute inset-4 rounded-2xl overflow-hidden border border-white/10">
        <WaveWeave
          speed={speed}
          waveCount={waveCount}
          wavesPerWidth={wavesPerWidth}
          amplitude={amplitude}
          lineWidth={lineWidth}
          phaseOffset={phaseOffset}
          color={color}
          brightness={brightness}
          coreStrength={coreStrength}
          blur={blur}
        />
      </div>

      <div className="absolute top-8 left-8 flex flex-col gap-3 bg-black/50 backdrop-blur-md rounded-xl p-4 text-white text-xs font-mono w-60 border border-white/10 max-h-[85vh] overflow-y-auto">
        <div className="text-sm font-semibold mb-1 tracking-wide">WaveWeave</div>

        <label className="flex flex-col gap-1">
          speed {speed.toFixed(2)}
          <input type="range" min="0" max="3" step="0.05" value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))} />
        </label>

        <label className="flex flex-col gap-1">
          waveCount (rows) {waveCount}
          <input type="range" min="4" max="40" step="1" value={waveCount}
            onChange={(e) => setWaveCount(parseFloat(e.target.value))} />
        </label>

        <label className="flex flex-col gap-1">
          wavesPerWidth {wavesPerWidth}
          <input type="range" min="1" max="20" step="0.5" value={wavesPerWidth}
            onChange={(e) => setWavesPerWidth(parseFloat(e.target.value))} />
        </label>

        <label className="flex flex-col gap-1">
          amplitude {amplitude.toFixed(2)}
          <input type="range" min="0" max="1.2" step="0.01" value={amplitude}
            onChange={(e) => setAmplitude(parseFloat(e.target.value))} />
        </label>

        <label className="flex flex-col gap-1">
          lineWidth (glow) {lineWidth.toFixed(1)}
          <input type="range" min="1" max="20" step="0.5" value={lineWidth}
            onChange={(e) => setLineWidth(parseFloat(e.target.value))} />
        </label>

        <label className="flex flex-col gap-1">
          phaseOffset {phaseOffset.toFixed(2)}
          <input type="range" min="0" max="6.28" step="0.01" value={phaseOffset}
            onChange={(e) => setPhaseOffset(parseFloat(e.target.value))} />
        </label>

        <label className="flex flex-col gap-1">
          brightness {brightness.toFixed(2)}
          <input type="range" min="0" max="3" step="0.05" value={brightness}
            onChange={(e) => setBrightness(parseFloat(e.target.value))} />
        </label>

        <label className="flex flex-col gap-1">
          coreStrength {coreStrength.toFixed(2)}
          <input type="range" min="0" max="2" step="0.05" value={coreStrength}
            onChange={(e) => setCoreStrength(parseFloat(e.target.value))} />
        </label>

        <label className="flex flex-col gap-1">
          blur {blur.toFixed(1)}px
          <input type="range" min="0" max="20" step="0.5" value={blur}
            onChange={(e) => setBlur(parseFloat(e.target.value))} />
        </label>

        <label className="flex items-center gap-2">
          color
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
      </div>
    </div>
  );
}
