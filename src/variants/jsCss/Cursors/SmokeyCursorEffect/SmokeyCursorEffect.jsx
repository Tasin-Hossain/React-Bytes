import { useRef, useEffect, useState } from "react";

function hexToRgb01(hex) {
  if (!hex) return null;
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

function FluidCursorEffect({
  simResolution = 128,
  dyeResolution = 1440,
  densityDissipation = 3.5,
  velocityDissipation = 2,
  pressure = 0.1,
  pressureIterations = 20,
  curl = 3,
  splatRadius = 0.2,
  splatForce = 6000,
  shading = true,
  colorUpdateSpeed = 10,
  color = null,
  className = "",
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationIdRef = useRef(null);
  const configRef = useRef({
    SIM_RESOLUTION: simResolution,
    DYE_RESOLUTION: dyeResolution,
    DENSITY_DISSIPATION: densityDissipation,
    VELOCITY_DISSIPATION: velocityDissipation,
    PRESSURE: pressure,
    PRESSURE_ITERATIONS: pressureIterations,
    CURL: curl,
    SPLAT_RADIUS: splatRadius,
    SPLAT_FORCE: splatForce,
    SHADING: shading,
    COLOR_UPDATE_SPEED: colorUpdateSpeed,
    COLOR: hexToRgb01(color),
  });
  const updateKeywordsRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const c = configRef.current;
    c.SPLAT_RADIUS = splatRadius;
    c.CURL = curl;
    c.DENSITY_DISSIPATION = densityDissipation;
    c.VELOCITY_DISSIPATION = velocityDissipation;
    c.PRESSURE = pressure;
    c.SPLAT_FORCE = splatForce;
    c.COLOR_UPDATE_SPEED = colorUpdateSpeed;
    c.SHADING = shading;
    c.COLOR = hexToRgb01(color);
    if (updateKeywordsRef.current) updateKeywordsRef.current();
  }, [splatRadius, curl, densityDissipation, velocityDissipation, pressure, splatForce, colorUpdateSpeed, shading, color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let gl, ext;
    const config = configRef.current;
    let pointers = [{
      id: -1, texcoordX: 0, texcoordY: 0, prevTexcoordX: 0, prevTexcoordY: 0,
      deltaX: 0, deltaY: 0, down: false, moved: false, color: { r: 0, g: 0, b: 0 },
    }];
    let dye, velocity, divergence, curlFBO, pressureFBO;
    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;

    let clearProgram, splatProgram, advectionProgram;
    let divergenceProgram, curlProgram, vorticityProgram, pressureProgram;
    let gradienSubtractProgram, displayMaterial;
    let blit;

    const initializeWebGL = () => {
      const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
      gl = canvas.getContext("webgl2", params) || canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params);
      if (!gl) throw new Error("Unable to initialize WebGL.");

      const isWebGL2 = "drawBuffers" in gl;
      // eslint-disable-next-line no-useless-assignment
      let supportLinearFiltering = false;
      let halfFloat = null;

      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = !!gl.getExtension("OES_texture_half_float_linear");
      }

      gl.clearColor(0, 0, 0, 1);

      const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloat && halfFloat.HALF_FLOAT_OES) || 0;
      let formatRGBA, formatRG, formatR;

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      ext = { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering };

      if (!ext.supportLinearFiltering) {
        config.DYE_RESOLUTION = 256;
        config.SHADING = false;
      }
      return true;
    };

    const getSupportedFormat = (gl, internalFormat, format, type) => {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        if ("drawBuffers" in gl) {
          switch (internalFormat) {
            case gl.R16F: return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
            case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
            default: return null;
          }
        }
        return null;
      }
      return { internalFormat, format };
    };

    const supportRenderTextureFormat = (gl, internalFormat, format, type) => {
      const texture = gl.createTexture();
      if (!texture) return false;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      if (!fbo) return false;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    };

    const compileShader = (type, source, keywords = null) => {
      let shaderSource = source;
      if (keywords) {
        let keywordsString = "";
        for (const keyword of keywords) keywordsString += `#define ${keyword}\n`;
        shaderSource = keywordsString + source;
      }
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(shader));
      return shader;
    };

    const createProgram = (vertexShader, fragmentShader) => {
      if (!vertexShader || !fragmentShader) return null;
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(program));
      return program;
    };

    const getUniforms = (program) => {
      let uniforms = {};
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const uniformInfo = gl.getActiveUniform(program, i);
        if (uniformInfo) uniforms[uniformInfo.name] = gl.getUniformLocation(program, uniformInfo.name);
      }
      return uniforms;
    };

    class Program {
      constructor(vertexShader, fragmentShader) {
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = this.program ? getUniforms(this.program) : {};
      }
      bind() { if (this.program) gl.useProgram(this.program); }
    }

    class Material {
      constructor(vertexShader, fragmentShaderSource) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = {};
        this.activeProgram = null;
        this.uniforms = {};
      }
      setKeywords(keywords) {
        let hash = 0;
        for (const kw of keywords) hash += this.hashCode(kw);
        let program = this.programs[hash];
        if (program == null) {
          const fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          program = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = program;
        }
        if (program === this.activeProgram) return;
        if (program) this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }
      hashCode(s) {
        if (!s.length) return 0;
        let hash = 0;
        for (let i = 0; i < s.length; i++) { hash = (hash << 5) - hash + s.charCodeAt(i); hash |= 0; }
        return hash;
      }
      bind() { if (this.activeProgram) gl.useProgram(this.activeProgram); }
    }

    const initializeShaders = () => {
      const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;
        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `);

      const clearShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;
        void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
      `);

      const displayShaderSource = `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uTexture;
        uniform vec2 texelSize;
        void main () {
            vec3 c = texture2D(uTexture, vUv).rgb;
            #ifdef SHADING
                vec3 lc = texture2D(uTexture, vL).rgb;
                vec3 rc = texture2D(uTexture, vR).rgb;
                vec3 tc = texture2D(uTexture, vT).rgb;
                vec3 bc = texture2D(uTexture, vB).rgb;
                float dx = length(rc) - length(lc);
                float dy = length(tc) - length(bc);
                vec3 n = normalize(vec3(dx, dy, length(texelSize)));
                vec3 l = vec3(0.0, 0.0, 1.0);
                float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
                c *= diffuse;
            #endif
            float a = max(c.r, max(c.g, c.b));
            gl_FragColor = vec4(c, a);
        }
      `;

      const splatShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;
        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `);

      const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;
        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);
            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }
        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `, ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]);

      const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;
            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }
            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `);

      const curlShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `);

      const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;
        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;
            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `);

      const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `);

      const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `);

      clearProgram = new Program(baseVertexShader, clearShader);
      splatProgram = new Program(baseVertexShader, splatShader);
      advectionProgram = new Program(baseVertexShader, advectionShader);
      divergenceProgram = new Program(baseVertexShader, divergenceShader);
      curlProgram = new Program(baseVertexShader, curlShader);
      vorticityProgram = new Program(baseVertexShader, vorticityShader);
      pressureProgram = new Program(baseVertexShader, pressureShader);
      gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
      displayMaterial = new Material(baseVertexShader, displayShaderSource);
    };

    const initializeBlit = () => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
      const elemBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      blit = (target, doClear = false) => {
        if (!gl) return;
        if (!target) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        if (doClear) { gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    };

    const createFBO = (w, h, internalFormat, format, type, param) => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const texelSizeX = 1 / w;
      const texelSizeY = 1 / h;
      return {
        texture, fbo, width: w, height: h, texelSizeX, texelSizeY,
        attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; },
      };
    };

    const createDoubleFBO = (w, h, internalFormat, format, type, param) => {
      const fbo1 = createFBO(w, h, internalFormat, format, type, param);
      const fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY,
        read: fbo1, write: fbo2,
        swap() { const tmp = this.read; this.read = this.write; this.write = tmp; },
      };
    };

    const getResolution = (resolution) => {
      const w = gl.drawingBufferWidth;
      const h = gl.drawingBufferHeight;
      const aspectRatio = w / h;
      let aspect = aspectRatio < 1 ? 1 / aspectRatio : aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspect);
      if (w > h) return { width: max, height: min };
      return { width: min, height: max };
    };

    const scaleByPixelRatio = (input) => Math.floor(input * (window.devicePixelRatio || 1));

    const initFramebuffers = () => {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);

      if (!dye) dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
      if (!velocity) velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

      divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      curlFBO = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      pressureFBO = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    };

    const updateKeywords = () => {
      const displayKeywords = [];
      if (config.SHADING) displayKeywords.push("SHADING");
      displayMaterial.setKeywords(displayKeywords);
    };
    updateKeywordsRef.current = updateKeywords;

    const HSVtoRGB = (h, s, v) => {
      let r = 0, g = 0, b = 0;
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
      }
      return { r, g, b };
    };

    const generateColor = () => {
      if (config.COLOR) {
        return {
          r: config.COLOR.r * 0.15,
          g: config.COLOR.g * 0.15,
          b: config.COLOR.b * 0.15,
        };
      }
      const c = HSVtoRGB(Math.random(), 1.0, 1.0);
      c.r *= 0.15; c.g *= 0.15; c.b *= 0.15;
      return c;
    };

    const wrap = (value, min, max) => {
      const range = max - min;
      if (range === 0) return min;
      return ((value - min) % range) + min;
    };

    const calcDeltaTime = () => {
      const now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastUpdateTime = now;
      return dt;
    };

    const resizeCanvas = () => {
      const width = scaleByPixelRatio(canvas.clientWidth);
      const height = scaleByPixelRatio(canvas.clientHeight);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width; canvas.height = height;
        return true;
      }
      return false;
    };

    const updateColors = (dt) => {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
        pointers.forEach((p) => { p.color = generateColor(); });
      }
    };

    const applyInputs = () => {
      for (const p of pointers) {
        if (p.moved) { p.moved = false; splatPointer(p); }
      }
    };

    const step = (dt) => {
      gl.disable(gl.BLEND);
      curlProgram.bind();
      if (curlProgram.uniforms.texelSize) gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (curlProgram.uniforms.uVelocity) gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      vorticityProgram.bind();
      if (vorticityProgram.uniforms.texelSize) gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (vorticityProgram.uniforms.uVelocity) gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      if (vorticityProgram.uniforms.uCurl) gl.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO.attach(1));
      if (vorticityProgram.uniforms.curl) gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      if (vorticityProgram.uniforms.dt) gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      if (divergenceProgram.uniforms.texelSize) gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (divergenceProgram.uniforms.uVelocity) gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      if (clearProgram.uniforms.uTexture) gl.uniform1i(clearProgram.uniforms.uTexture, pressureFBO.read.attach(0));
      if (clearProgram.uniforms.value) gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressureFBO.write);
      pressureFBO.swap();

      pressureProgram.bind();
      if (pressureProgram.uniforms.texelSize) gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (pressureProgram.uniforms.uDivergence) gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        if (pressureProgram.uniforms.uPressure) gl.uniform1i(pressureProgram.uniforms.uPressure, pressureFBO.read.attach(1));
        blit(pressureFBO.write);
        pressureFBO.swap();
      }

      gradienSubtractProgram.bind();
      if (gradienSubtractProgram.uniforms.texelSize) gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (gradienSubtractProgram.uniforms.uPressure) gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressureFBO.read.attach(0));
      if (gradienSubtractProgram.uniforms.uVelocity) gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      if (advectionProgram.uniforms.texelSize) gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!ext.supportLinearFiltering && advectionProgram.uniforms.dyeTexelSize) gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      let velocityId = velocity.read.attach(0);
      if (advectionProgram.uniforms.uVelocity) gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      if (advectionProgram.uniforms.uSource) gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      if (advectionProgram.uniforms.dt) gl.uniform1f(advectionProgram.uniforms.dt, dt);
      if (advectionProgram.uniforms.dissipation) gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!ext.supportLinearFiltering && advectionProgram.uniforms.dyeTexelSize) gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      if (advectionProgram.uniforms.uVelocity) gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      if (advectionProgram.uniforms.uSource) gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      if (advectionProgram.uniforms.dissipation) gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    };

    const drawDisplay = (target) => {
      const width = target ? target.width : gl.drawingBufferWidth;
      const height = target ? target.height : gl.drawingBufferHeight;
      displayMaterial.bind();
      if (config.SHADING && displayMaterial.uniforms.texelSize) gl.uniform2f(displayMaterial.uniforms.texelSize, 1 / width, 1 / height);
      if (displayMaterial.uniforms.uTexture) gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      blit(target, false);
    };

    const render = (target) => {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      drawDisplay(target);
    };

    const splatPointer = (pointer) => {
      const dx = pointer.deltaX * config.SPLAT_FORCE;
      const dy = pointer.deltaY * config.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    };

    const clickSplat = (pointer) => {
      const color = generateColor();
      color.r *= 10; color.g *= 10; color.b *= 10;
      const dx = 10 * (Math.random() - 0.5);
      const dy = 30 * (Math.random() - 0.5);
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    };

    const correctRadius = (radius) => {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    };

    const splat = (x, y, dx, dy, color) => {
      splatProgram.bind();
      if (splatProgram.uniforms.uTarget) gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      if (splatProgram.uniforms.aspectRatio) gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      if (splatProgram.uniforms.point) gl.uniform2f(splatProgram.uniforms.point, x, y);
      if (splatProgram.uniforms.color) gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      if (splatProgram.uniforms.radius) gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100));
      blit(velocity.write);
      velocity.swap();

      if (splatProgram.uniforms.uTarget) gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      if (splatProgram.uniforms.color) gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    };

    const updatePointerDownData = (pointer, id, posX, posY) => {
      pointer.id = id; pointer.down = true; pointer.moved = false;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1 - posY / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0; pointer.deltaY = 0;
      pointer.color = generateColor();
    };

    const correctDeltaX = (delta) => { const a = canvas.width / canvas.height; if (a < 1) delta *= a; return delta; };
    const correctDeltaY = (delta) => { const a = canvas.width / canvas.height; if (a > 1) delta /= a; return delta; };

    const updatePointerMoveData = (pointer, posX, posY, color) => {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1 - posY / canvas.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      pointer.color = color;
    };

    const updateFrame = () => {
      const dt = calcDeltaTime();
      if (resizeCanvas()) initFramebuffers();
      updateColors(dt);
      applyInputs();
      step(dt);
      render(null);
      animationIdRef.current = requestAnimationFrame(updateFrame);
    };

    const setupEventListeners = () => {
      const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const pointer = pointers[0];
        const posX = scaleByPixelRatio(e.clientX - rect.left);
        const posY = scaleByPixelRatio(e.clientY - rect.top);
        if (!pointer.down) { updatePointerDownData(pointer, -1, posX, posY); }
        updatePointerMoveData(pointer, posX, posY, pointer.color);
      };
      const handleMouseDown = (e) => {
        const rect = container.getBoundingClientRect();
        const pointer = pointers[0];
        const posX = scaleByPixelRatio(e.clientX - rect.left);
        const posY = scaleByPixelRatio(e.clientY - rect.top);
        updatePointerDownData(pointer, -1, posX, posY);
        clickSplat(pointer);
      };
      const handleTouchMove = (e) => {
        const rect = container.getBoundingClientRect();
        const touches = e.targetTouches;
        const pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) {
          const posX = scaleByPixelRatio(touches[i].clientX - rect.left);
          const posY = scaleByPixelRatio(touches[i].clientY - rect.top);
          if (!pointer.down) updatePointerDownData(pointer, touches[i].identifier, posX, posY);
          updatePointerMoveData(pointer, posX, posY, pointer.color);
        }
      };
      const handleTouchEnd = () => { pointers[0].down = false; };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("touchstart", handleTouchMove, false);
      container.addEventListener("touchmove", handleTouchMove, false);
      container.addEventListener("touchend", handleTouchEnd);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("touchstart", handleTouchMove);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      };
    };

    const init = () => {
      try {
        initializeWebGL();
        initializeShaders();
        initializeBlit();
        updateKeywords();
        initFramebuffers();
        const cleanupListeners = setupEventListeners();
        updateFrame();
        setIsInitialized(true);
        return cleanupListeners;
      } catch (e) {
        console.error("Failed to initialize fluid simulation:", e);
        setError(e.message);
        return null;
      }
    };

    const cleanup = init();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (cleanup) cleanup();
    };
  }, []);

  if (error) {
    return (
      <div className="fluid-cursor-error">
        <style>{FLUID_CURSOR_CSS}</style>
        <div className="fluid-cursor-error-inner">
          <h1 className="fluid-cursor-error-title">WebGL not supported</h1>
          <p className="fluid-cursor-error-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`fluid-cursor-container ${className}`}>
      <style>{FLUID_CURSOR_CSS}</style>
      <canvas ref={canvasRef} className="fluid-cursor-canvas" />
      {!isInitialized && (
        <div className="fluid-cursor-loading">Initializing WebGL...</div>
      )}
    </div>
  );
}

const FLUID_CURSOR_CSS = `
.fluid-cursor-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
}

.fluid-cursor-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.fluid-cursor-loading {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(59, 130, 246, 0.2);
  color: #bfdbfe;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(59, 130, 246, 0.3);
  font-size: 0.75rem;
  line-height: 1rem;
}

.fluid-cursor-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 18.75rem;
  background-color: transparent;
  color: #ffffff;
  border-radius: 0.75rem;
}

.fluid-cursor-error-inner {
  text-align: center;
  padding: 2rem;
}

.fluid-cursor-error-title {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.fluid-cursor-error-text {
  color: #d4d4d4;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
`;

export default FluidCursorEffect;
