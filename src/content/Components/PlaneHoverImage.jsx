import  { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * PlaneHoverImage
 *
 * Three.js + custom shader hover effect (zoom, pixel-displace, RGB-shift)
 * wrapped in a React component, styled with Tailwind.
 *
 * Dependencies:
 *   npm install three gsap
 *
 * Props:
 *   imageUrl          string   - texture url (required)
 *   width             number   - css width of wrapper, default 600
 *   height            number   - css height of wrapper, default 800
 *   backgroundColor   string   - scene background color, default '#111111'
 *   planeWidth        number   - plane geometry width, default 5
 *   planeHeight       number   - plane geometry height, default 7
 *   zoomLevel         number   - hover zoom intensity (0-1), default 0.2
 *   rgbShiftStrength  number   - chromatic-aberration strength on hover, default 0.01
 *   pixelDisplace     number   - vertical pixel-displace strength on hover, default 0.05
 *   hoverInDuration   number   - seconds for hover uniform to tween in/out, default 2
 *   tiltStrength      number   - max tilt rotation factor (xPI/3 * value), default 0.3
 *   scaleStrength     number   - how much mesh scales with vertical mouse pos, default 0.1
 *   followStrength    number   - how much mesh follows mouse.x horizontally, default 1
 *   opacity           number   - base mesh opacity, default 1
 *   cameraFov         number   - camera field of view, default 60
 *   cameraZ           number   - camera distance from plane, default 8
 *   autoRotate        boolean  - slow idle rotation when not hovered, default false
 *   disabled          boolean  - turns off all mouse interaction, default false
 *   className         string   - extra tailwind classes for the wrapper div
 *   onLoad            function - called once the texture has finished loading
 */
export default function PlaneHoverImage({
  imageUrl,
  width = 600,
  height = 800,
  backgroundColor = '#111111',
  planeWidth = 5,
  planeHeight = 7,
  zoomLevel = 0.2,
  rgbShiftStrength = 0.01,
  pixelDisplace = 0.05,
  hoverInDuration = 2,
  tiltStrength = 0.3,
  scaleStrength = 0.1,
  followStrength = 1,
  opacity = 1,
  cameraFov = 60,
  cameraZ = 8,
  autoRotate = false,
  disabled = false,
  className = '',
  onLoad
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const textureLoader = new THREE.TextureLoader()

    class PlaneSubject {
      raycaster = new THREE.Raycaster()
      scene = null

      constructor(scene) {
        const geometry = new THREE.PlaneBufferGeometry(planeWidth, planeHeight)
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
              value: textureLoader.load(imageUrl, (tex) => {
                material.uniforms.imageAspectRatio.value = tex.image.width / tex.image.height
                if (onLoad) onLoad(tex)
              })
            },
            imageAspectRatio: { value: 1.0 },
            aspectRatio: { value: width / height },
            opacity: { value: opacity },
            hover: { value: 0.0 },
            zoomLevel: { value: zoomLevel },
            rgbShiftStrength: { value: rgbShiftStrength },
            pixelDisplace: { value: pixelDisplace }
          }
        })
        material.transparent = true
        const mesh = new THREE.Mesh(geometry, material)

        scene.add(mesh)
        this.scene = scene
        this.mesh = mesh
      }

      update(delta) {
        if (autoRotate) {
          this.mesh.rotation.y += delta * 0.15
        }
      }

      mouseHandler(mouse, camera) {
        const { scene, mesh, raycaster } = this
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(scene.children)

        gsap.to(mesh.material.uniforms.hover, {
          duration: hoverInDuration,
          value: intersects.length
        })

        gsap.to(mesh.scale, {
          duration: 0.5,
          x: 1 - mouse.y * scaleStrength,
          y: 1 - mouse.y * scaleStrength
        })

        gsap.to(mesh.position, {
          duration: 0.5,
          x: mouse.x * followStrength
        })

        gsap.to(mesh.rotation, {
          duration: 0.5,
          x: -mouse.y * (Math.PI / 3) * tiltStrength,
          y: mouse.x * (Math.PI / 3) * tiltStrength
        })
      }
    }

    class SceneManager {
      clock = new THREE.Clock()
      mouse = new THREE.Vector2()

      buildScene() {
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(backgroundColor)
        return scene
      }

      buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true
        })
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1
        renderer.setPixelRatio(DPR)
        renderer.setSize(width, height)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        return renderer
      }

      buildCamera({ width, height }) {
        const aspectRatio = width / height
        const camera = new THREE.PerspectiveCamera(cameraFov, aspectRatio, 1, 100)
        camera.position.z = cameraZ
        return camera
      }

      createSceneSubjects(scene) {
        return [new PlaneSubject(scene)]
      }

      constructor() {
        this.screenDimensions = {
          width: canvas.clientWidth,
          height: canvas.clientHeight
        }
        this.scene = this.buildScene()
        this.renderer = this.buildRender(this.screenDimensions)
        this.camera = this.buildCamera(this.screenDimensions)
        this.sceneSubjects = this.createSceneSubjects(this.scene)
      }

      update() {
        const delta = this.clock.getDelta()
        const elapsed = this.clock.getElapsedTime()
        this.sceneSubjects.forEach((s) => s.update && s.update(delta, elapsed))
        this.renderer.render(this.scene, this.camera)
      }

      resizeHandler() {
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        this.screenDimensions = { width: w, height: h }
        this.camera.aspect = w / h
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(w, h)
      }

      mouseHandler(mousePos) {
        Object.assign(this.mouse, mousePos)
        this.sceneSubjects.forEach((s) => s.mouseHandler && s.mouseHandler(this.mouse, this.camera))
      }
    }

    const sceneManager = new SceneManager()
    let rafId

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      sceneManager.resizeHandler()
    }

    const mouseHandler = (e) => {
      if (disabled) return
      const rect = container.getBoundingClientRect()
      sceneManager.mouseHandler({
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1
      })
    }

    const render = () => {
      rafId = window.requestAnimationFrame(render)
      sceneManager.update()
    }

    const ro = new ResizeObserver(resizeCanvas)
    ro.observe(container)
    resizeCanvas()
    container.addEventListener('mousemove', mouseHandler)
    render()

    return () => {
      window.cancelAnimationFrame(rafId)
      ro.disconnect()
      container.removeEventListener('mousemove', mouseHandler)
      sceneManager.renderer.dispose()
    }
  }, [imageUrl, width, height, backgroundColor, planeWidth, planeHeight, zoomLevel, rgbShiftStrength, pixelDisplace, hoverInDuration, tiltStrength, scaleStrength, followStrength, opacity, cameraFov, cameraZ, autoRotate, disabled, onLoad])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl bg-neutral-900 ${className}`}
      style={{ width, height }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}