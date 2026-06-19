// JS-TW variant
import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function buildCharAtlas(characters, color, invert) {
  const chars = invert ? characters.split("").reverse().join("") : characters;
  const n = chars.length;
  const cell = 64;
  const canvas = document.createElement("canvas");
  canvas.width = cell * n;
  canvas.height = cell;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.font = `bold ${cell * 0.8}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < n; i++) {
    ctx.fillText(chars[i], i * cell + cell / 2, cell / 2 + cell * 0.05);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return { texture: tex, count: n };
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uNoiseScale;
  uniform float uElementSize;
  uniform float uTension;
  uniform float uTwist;
  uniform float uIntensity;
  uniform float uCharCount;
  uniform sampler2D uAtlas;
  uniform vec2 uMouse;
  uniform float uHasCursor;
  uniform float uInteractionIntensity;
  uniform float uHasVideo;
  uniform sampler2D uVideo;
  uniform vec2 uVideoRes;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 fragCoord = vUv * uResolution;
    vec2 grid = vec2(uElementSize);
    vec2 cell = floor(fragCoord / grid);
    vec2 cellUv = fract(fragCoord / grid);
    vec2 cellCenter = (cell + 0.5) * grid;

    vec2 p = cellCenter * (uNoiseScale * 0.01);
    float twistAngle = uTwist * sin(p.x * 1.3 + uTime * 0.3);
    vec2 tp = vec2(
      p.x * cos(twistAngle) - p.y * sin(twistAngle),
      p.x * sin(twistAngle) + p.y * cos(twistAngle)
    );

    float wave = sin(tp.x * 2.0 + uTime) * cos(tp.y * uTension * 2.0 - uTime * 0.7);
    float n = noise(tp * 2.0 + uTime * 0.15) - 0.5;
    float value = (wave + n) * uIntensity * 0.5 + 0.5;

    if (uHasCursor > 0.5) {
      float d = distance(cellCenter, uMouse);
      float falloff = smoothstep(grid.x * 8.0, 0.0, d);
      value += falloff * uInteractionIntensity;
    }

    if (uHasVideo > 0.5) {
      vec2 vUvCoord = vUv;
      vec3 vcol = texture2D(uVideo, vUvCoord).rgb;
      float luma = dot(vcol, vec3(0.299, 0.587, 0.114));
      value = mix(value, luma, 0.85);
    }

    value = clamp(value, 0.0, 1.0);

    float charIndex = floor(value * (uCharCount - 1.0) + 0.5);
    vec2 atlasUv = vec2((charIndex + cellUv.x) / uCharCount, cellUv.y);
    vec4 glyph = texture2D(uAtlas, atlasUv);

    gl_FragColor = vec4(glyph.rgb, glyph.a);
    if (glyph.a < 0.05) discard;
  }
`;

function WavePlane({
  characters,
  color,
  waveTension,
  waveTwist,
  invert,
  noiseScale,
  elementSize,
  speed,
  hasCursorInteraction,
  intensity,
  interactionIntensity,
  videoUrl,
}) {
  const meshRef = useRef();
  const matRef = useRef();
  const mouse = useRef(new THREE.Vector2(-9999, -9999));
  const { size, gl } = useThree();

  const atlas = useMemo(
    () => buildCharAtlas(characters, color, invert),
    [characters, color, invert]
  );

  const videoRef = useRef(null);
  const videoTextureRef = useRef(null);

  useEffect(() => {
    if (!videoUrl) {
      videoTextureRef.current = null;
      return;
    }
    const video = document.createElement("video");
    video.src = videoUrl;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.play().catch(() => {});
    videoRef.current = video;

    const tex = new THREE.VideoTexture(video);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    videoTextureRef.current = tex;

    if (matRef.current) {
      matRef.current.uniforms.uVideo.value = tex;
      matRef.current.uniforms.uHasVideo.value = 1;
    }

    return () => {
      video.pause();
      tex.dispose();
      videoTextureRef.current = null;
    };
  }, [videoUrl]);

  const mouseActive = useRef(false);

  useEffect(() => {
    const dom = gl.domElement;

    const handleMove = (e) => {
      const rect = dom.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      if (lx < 0 || ly < 0 || lx > rect.width || ly > rect.height) {
        mouseActive.current = false;
        return;
      }
      mouse.current.x = lx;
      mouse.current.y = rect.height - ly;
      mouseActive.current = true;
    };
    const handleLeave = () => {
      mouseActive.current = false;
      mouse.current.set(-9999, -9999);
    };

    document.addEventListener("mousemove", handleMove);
    dom.addEventListener("mouseleave", handleLeave);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      dom.removeEventListener("mouseleave", handleLeave);
    };
  }, [gl, size]);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime * speed;
    matRef.current.uniforms.uMouse.value.copy(mouse.current);
    matRef.current.uniforms.uResolution.value.set(size.width, size.height);
    matRef.current.uniforms.uHasCursor.value =
      hasCursorInteraction && mouseActive.current ? 1 : 0;
    if (videoTextureRef.current) videoTextureRef.current.needsUpdate = true;
  });

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uTime: { value: 0 },
      uNoiseScale: { value: noiseScale },
      uElementSize: { value: elementSize },
      uTension: { value: waveTension },
      uTwist: { value: waveTwist },
      uIntensity: { value: intensity },
      uCharCount: { value: atlas.count },
      uAtlas: { value: atlas.texture },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uHasCursor: { value: hasCursorInteraction ? 1 : 0 },
      uInteractionIntensity: { value: interactionIntensity },
      // eslint-disable-next-line react-hooks/refs
      uHasVideo: { value: videoTextureRef.current ? 1 : 0 },
      // eslint-disable-next-line react-hooks/refs
      uVideo: { value: videoTextureRef.current },
      uVideoRes: { value: new THREE.Vector2(1, 1) },
    }),
    [
      atlas.count,
      atlas.texture,
      elementSize,
      hasCursorInteraction,
      intensity,
      interactionIntensity,
      noiseScale,
      size.height,
      size.width,
      waveTension,
      waveTwist,
    ]
  );

  useEffect(() => {
    if (!matRef.current) return;
    matRef.current.uniforms.uNoiseScale.value = noiseScale;
    matRef.current.uniforms.uElementSize.value = elementSize;
    matRef.current.uniforms.uTension.value = waveTension;
    matRef.current.uniforms.uTwist.value = waveTwist;
    matRef.current.uniforms.uIntensity.value = intensity;
    matRef.current.uniforms.uHasCursor.value = hasCursorInteraction ? 1 : 0;
    matRef.current.uniforms.uInteractionIntensity.value = interactionIntensity;
    matRef.current.uniforms.uAtlas.value = atlas.texture;
    matRef.current.uniforms.uCharCount.value = atlas.count;
  }, [
    noiseScale,
    elementSize,
    waveTension,
    waveTwist,
    intensity,
    hasCursorInteraction,
    interactionIntensity,
    atlas,
  ]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[size.width, size.height]} />
      <shaderMaterial
        ref={matRef}
        transparent
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function AsciiWave({
  characters = " .:-+*=%@#",
  color = "#ffffff",
  waveTension = 0.5,
  waveTwist = 0.1,
  invert = false,
  noiseScale = 1.0,
  elementSize = 16.0,
  speed = 1.0,
  hasCursorInteraction = true,
  intensity = 1.0,
  interactionIntensity = 1.0,
  className = "",
  videoUrl = "",
  bgColor = "transparent",
}) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <Canvas
        className="absolute! inset-0 w-full h-full"
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        gl={{ alpha: bgColor === "transparent", antialias: false }}
        style={{ background: bgColor === "transparent" ? "transparent" : bgColor }}
      >
        <WavePlane
          characters={characters}
          color={color}
          waveTension={waveTension}
          waveTwist={waveTwist}
          invert={invert}
          noiseScale={noiseScale}
          elementSize={elementSize}
          speed={speed}
          hasCursorInteraction={hasCursorInteraction}
          intensity={intensity}
          interactionIntensity={interactionIntensity}
          videoUrl={videoUrl}
        />
      </Canvas>
    </div>
  );
}