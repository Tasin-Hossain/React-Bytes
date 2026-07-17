import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function makePlaceholderTexture() {
  const c = document.createElement('canvas');
  c.width = 800;
  c.height = 1100;
  const ctx = c.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, c.height);
  grad.addColorStop(0, '#5b46b0');
  grad.addColorStop(1, '#1a1330');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.arc(c.width / 2, c.height / 2, 60 + i * 45, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 70px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('hover me', c.width / 2, c.height / 2 + 25);

  return c.toDataURL();
}

function PlaneHoverImage({
  imageUrl,
  width = 420,
  height = 560,
  backgroundColor = '#111111',
  planeWidth = 5,
  planeHeight = 7,
  zoomLevel = 0.2,
  rgbShiftStrength = 0.01,
  pixelDisplace = 0.05,
  tiltStrength = 0.3,
  scaleStrength = 0.1,
  followStrength = 1,
  opacity = 1,
  cameraFov = 60,
  cameraZ = 8,
  autoRotate = false,
  disabled = false,
  className = ''
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    try {
      const textureLoader = new THREE.TextureLoader();
      const lerp = (a, b, t) => a + (b - a) * t;

      class PlaneSubject {
        raycaster = new THREE.Raycaster();
        scene = null;
        targets = { hover: 0, scaleX: 1, scaleY: 1, posX: 0, rotX: 0, rotY: 0 };

        constructor(scene) {
          const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
          const material = new THREE.ShaderMaterial({
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              precision highp float;
              uniform sampler2D map;
              uniform float imageAspectRatio;
              uniform float aspectRatio;
              uniform float opacity;
              uniform float hover;
              uniform float zoomLevel;
              uniform float rgbShiftStrength;
              uniform float pixelDisplace;
              varying vec2 vUv;

              float exponentialInOut(float t) {
                return t == 0.0 || t == 1.0
                  ? t
                  : t < 0.5
                    ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
                    : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
              }

              void main() {
                vec2 uv = vUv;

                float u = imageAspectRatio / aspectRatio;
                if (imageAspectRatio > aspectRatio) {
                  u = 1.0 / u;
                }

                uv.y *= u;
                uv.y -= (u) / 2.0 - 0.5;

                float hoverLevel = exponentialInOut(min(1.0, (distance(vec2(0.5), uv) * hover) + hover));
                uv *= 1.0 - zoomLevel * hoverLevel;
                uv += zoomLevel / 2.0 * hoverLevel;
                uv = clamp(uv, 0.0, 1.0);
                vec4 color = texture2D(map, uv);
                if (hoverLevel > 0.0) {
                  hoverLevel = 1.0 - abs(hoverLevel - 0.5) * 2.0;
                  uv.y += color.r * hoverLevel * pixelDisplace;
                  color = texture2D(map, uv);
                  color.r = texture2D(map, uv + (hoverLevel) * rgbShiftStrength).r;
                  color.g = texture2D(map, uv - (hoverLevel) * rgbShiftStrength).g;
                }

                gl_FragColor = mix(vec4(1.0, 1.0, 1.0, opacity), color, opacity);
              }
            `,
            uniforms: {
              map: {
                value: textureLoader.load(
                  imageUrl,
                  (tex) => {
                    material.uniforms.imageAspectRatio.value = tex.image.width / tex.image.height;
                  },
                  undefined,
                  (err) => setError('texture failed to load: ' + err.message)
                )
              },
              imageAspectRatio: { value: 1.0 },
              aspectRatio: { value: width / height },
              opacity: { value: opacity },
              hover: { value: 0.0 },
              zoomLevel: { value: zoomLevel },
              rgbShiftStrength: { value: rgbShiftStrength },
              pixelDisplace: { value: pixelDisplace }
            }
          });
          material.transparent = true;
          const mesh = new THREE.Mesh(geometry, material);

          scene.add(mesh);
          this.scene = scene;
          this.mesh = mesh;
        }

        update(delta) {
          if (autoRotate) {
            this.mesh.rotation.y += delta * 0.15;
          }
          const t = 1 - Math.pow(0.001, delta);
          const u = this.mesh.material.uniforms;
          u.hover.value = lerp(u.hover.value, this.targets.hover, Math.min(1, delta * 2));
          this.mesh.scale.x = lerp(this.mesh.scale.x, this.targets.scaleX, t);
          this.mesh.scale.y = lerp(this.mesh.scale.y, this.targets.scaleY, t);
          this.mesh.position.x = lerp(this.mesh.position.x, this.targets.posX, t);
          this.mesh.rotation.x = lerp(this.mesh.rotation.x, this.targets.rotX, t);
          this.mesh.rotation.y = lerp(this.mesh.rotation.y, this.targets.rotY, t);
        }

        mouseHandler(mouse, camera) {
          this.raycaster.setFromCamera(mouse, camera);
          const intersects = this.raycaster.intersectObjects(this.scene.children);

          this.targets.hover = intersects.length ? 1 : 0;
          this.targets.scaleX = 1 - mouse.y * scaleStrength;
          this.targets.scaleY = 1 - mouse.y * scaleStrength;
          this.targets.posX = mouse.x * followStrength;
          this.targets.rotX = -mouse.y * (Math.PI / 3) * tiltStrength;
          this.targets.rotY = mouse.x * (Math.PI / 3) * tiltStrength;
        }
      }

      class SceneManager {
        clock = new THREE.Clock();
        mouse = new THREE.Vector2();

        buildScene() {
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(backgroundColor);
          return scene;
        }

        buildRender({ width, height }) {
          const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
          const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
          renderer.setPixelRatio(DPR);
          renderer.setSize(width, height);
          // r128-compatible color pipeline (outputColorSpace/SRGBColorSpace is r152+, didn't exist yet)
          renderer.outputEncoding = THREE.sRGBEncoding;
          return renderer;
        }

        buildCamera({ width, height }) {
          const aspectRatio = width / height;
          const camera = new THREE.PerspectiveCamera(cameraFov, aspectRatio, 1, 100);
          camera.position.z = cameraZ;
          return camera;
        }

        createSceneSubjects(scene) {
          return [new PlaneSubject(scene)];
        }

        constructor() {
          this.screenDimensions = { width: canvas.clientWidth, height: canvas.clientHeight };
          this.scene = this.buildScene();
          this.renderer = this.buildRender(this.screenDimensions);
          this.camera = this.buildCamera(this.screenDimensions);
          this.sceneSubjects = this.createSceneSubjects(this.scene);
        }

        update() {
          const delta = Math.min(this.clock.getDelta(), 0.1);
          this.sceneSubjects.forEach((s) => s.update && s.update(delta));
          this.renderer.render(this.scene, this.camera);
        }

        resizeHandler() {
          const w = canvas.clientWidth;
          const h = canvas.clientHeight;
          this.screenDimensions = { width: w, height: h };
          this.camera.aspect = w / h;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(w, h);
          this.sceneSubjects.forEach((s) => {
            if (s.mesh) s.mesh.material.uniforms.aspectRatio.value = w / h;
          });
        }

        mouseHandler(mousePos) {
          Object.assign(this.mouse, mousePos);
          this.sceneSubjects.forEach((s) => s.mouseHandler && s.mouseHandler(this.mouse, this.camera));
        }
      }

      const sceneManager = new SceneManager();
      let rafId;

      const resizeCanvas = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        sceneManager.resizeHandler();
      };

      const mouseHandler = (e) => {
        if (disabled) return;
        const rect = container.getBoundingClientRect();
        sceneManager.mouseHandler({
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: -((e.clientY - rect.top) / rect.height) * 2 + 1
        });
      };

      const render = () => {
        rafId = window.requestAnimationFrame(render);
        sceneManager.update();
      };

      const ro = new ResizeObserver(resizeCanvas);
      ro.observe(container);
      resizeCanvas();
      container.addEventListener('mousemove', mouseHandler);
      render();

      return () => {
        window.cancelAnimationFrame(rafId);
        ro.disconnect();
        container.removeEventListener('mousemove', mouseHandler);
        sceneManager.sceneSubjects.forEach((s) => {
          s.mesh?.geometry.dispose();
          s.mesh?.material.dispose();
        });
        sceneManager.renderer.dispose();
      };
    } catch (e) {
      setError(e.message);
    }
  }, [imageUrl, width, height, backgroundColor, planeWidth, planeHeight, zoomLevel, rgbShiftStrength, pixelDisplace, tiltStrength, scaleStrength, followStrength, opacity, cameraFov, cameraZ, autoRotate, disabled]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl bg-neutral-900 ${className}`}
      style={{ width, height }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-red-400 text-xs text-center bg-black/70">
          {error}
        </div>
      )}
    </div>
  );
}


export default function Demo() {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageUrl(makePlaceholderTexture());
  }, []);

  return (
    <div className="w-full min-h-150 flex flex-col items-center justify-center gap-4 bg-zinc-950 p-10 rounded-xl">
      <p className="text-zinc-500 text-sm">move your mouse over the plane</p>
      {imageUrl && (
        <PlaneHoverImage
          imageUrl={imageUrl}
          width={420}
          height={560}
          zoomLevel={0.25}
          rgbShiftStrength={0.015}
          pixelDisplace={0.06}
          tiltStrength={0.35}
        />
      )}
    </div>
  );
}