import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const SHAPES = ['rectangle', 'circle', 'diamond', 'hexagon'];

const CLIP_PATH = {
  rectangle: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)',
  circle: 'circle(45% at 50% 50%)',
  diamond: 'polygon(50% 0%,14.1% 50%,50% 100%,85.9% 50%)',
  hexagon: 'polygon(25% 6.7%,75% 6.7%,100% 50%,75% 93.3%,25% 93.3%,0% 50%)'
};

const DEFAULTS = {
  layerImages: [],
  layerCount: 10,
  shapes: SHAPES,
  defaultShape: 'rectangle',
  width: 600,
  height: 600,
  tiltMax: 45,
  rounded: 20,
  panMax: 88,
  depthStep: 36,
  scale3D: 0.07,
  opacityFalloff: 0.1,
  moveAmplify: 0.54,
  tiltBoost: 1.25,
  panBoost: 1.25,
  className: ''
};

const debounce = (fn, d) => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, a), d);
  };
};

export default function ImageCardHover(props) {
  // Merge caller props over DEFAULTS so nothing is ever undefined downstream.
  const {
    image,
    layerImages,
    layerCount,
    defaultShape,
    width,
    height,
    initialRotation = false,
    initialBlur = false,
    initialColor = false,
    initialOpacity = false,
    initialParallax = false,
    initial3D = false,
    tiltMax,
    rounded,
    panMax,
    depthStep,
    scale3D,
    opacityFalloff,
    moveAmplify,
    tiltBoost,
    panBoost,
    className
  } = { ...DEFAULTS, ...props };

  if (!image) {
    // Fail loudly in dev rather than silently rendering a blank stack —
    // this is the one prop that genuinely has no sane default.
    console.warn('LayeredImageHover: the `image` prop is required.');
  }

  const containerRef = useRef(null);
  const stackRef = useRef(null);
  const layerRefs = useRef([]);
  // eslint-disable-next-line react-hooks/refs
  layerRefs.current = [];
  const addLayerRef = useCallback(el => {
    if (el) layerRefs.current.push(el);
  }, []);

  const controllerRef = useRef(null);

  const [shape] = useState(defaultShape);
  const [rotationOn] = useState(initialRotation);
  const [blurOn] = useState(initialBlur);
  const [colorOn] = useState(initialColor);
  const [opacityOn] = useState(initialOpacity);
  const [parallaxOn] = useState(initialParallax);
  const [is3DOn] = useState(initial3D);

  const [tunerValues] = useState({
    tilt: tiltMax,
    pan: panMax,
    depth: depthStep,
    amp: moveAmplify
  });

  const layers = Array.from({ length: Math.max(1, layerCount) });

  // ---- one-time controller setup (mirrors the original initImageHover) ----
  useEffect(() => {
    const container = containerRef.current;
    const stackEl = stackRef.current;
    const layerEls = layerRefs.current;
    if (!container || !stackEl || layerEls.length === 0) return;

    const duration = 0.8,
      ease = 'power2.inOut',
      scaleInterval = 0.06,
      opacityInterval = 0.05,
      rotationInterval = 15;
    const blurSeq = [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1.0, 1.3, 1.6];
    const stagger = 0.1,
      followStrength = 0.15;

    const state = {
      isRotation: rotationOn,
      isBlur: blurOn,
      isColor: colorOn,
      isOpacity: opacityOn,
      isParallax: parallaxOn,
      is3D: is3DOn,
      isHovered: false,
      isTransitioning: false
    };

    let cssVarCache = {
      depthStep,
      scale3D,
      tiltMax,
      panMax,
      opacityFalloff,
      moveAmplify,
      tiltBoost,
      panBoost
    };

    const updateCSSCache = () => {
      const css = getComputedStyle(container);
      cssVarCache.depthStep = parseFloat(css.getPropertyValue('--lih-depth-step')) || depthStep;
      cssVarCache.scale3D = parseFloat(css.getPropertyValue('--lih-scale-3d')) || scale3D;
      cssVarCache.tiltMax = parseFloat(css.getPropertyValue('--lih-tilt-max')) || tiltMax;
      cssVarCache.panMax = parseFloat(css.getPropertyValue('--lih-pan-max')) || panMax;
      cssVarCache.opacityFalloff = parseFloat(css.getPropertyValue('--lih-opacity-falloff')) || opacityFalloff;
      cssVarCache.moveAmplify = parseFloat(css.getPropertyValue('--lih-move-amplify')) || moveAmplify;
      cssVarCache.tiltBoost = parseFloat(css.getPropertyValue('--lih-tilt-boost')) || tiltBoost;
      cssVarCache.panBoost = parseFloat(css.getPropertyValue('--lih-pan-boost')) || panBoost;
    };
    updateCSSCache();

    let timeline = null;
    let rect = container.getBoundingClientRect();

    let rafId = null;
    let pendingMouseEvent = null;

    const onResize = debounce(() => {
      rect = container.getBoundingClientRect();
    }, 50);
    window.addEventListener('resize', onResize);

    const quickTos = layerEls
      .map((layer, i) => {
        if (i === 0) return null;
        const sv = 1 - scaleInterval * i;
        const mult = sv > 0 ? (1 - sv) * 3 + 0.2 : 1;
        return {
          layer,
          mult,
          xTo: gsap.quickTo(layer, 'x', { duration: 0.6, ease: 'power3' }),
          yTo: gsap.quickTo(layer, 'y', { duration: 0.6, ease: 'power3' })
        };
      })
      .filter(Boolean);

    const getScale = i => Math.max(1 - scaleInterval * i, 0);
    const getOpacity = i => (!state.isOpacity ? 1 : Math.max(1 - opacityInterval * i, 0.1));
    const getRotVal = i => rotationInterval * i * (i % 2 === 0 ? 1 : -1);
    const getBlur = i => (!state.isBlur || i === 0 ? 0 : blurSeq[Math.min(i, blurSeq.length - 1)]);
    const getColor = i => {
      if (!state.isColor) return 'none';
      if (i === 0) return 'grayscale(1)';
      const ci = Math.min(i * 0.15, 1),
        sat = 1 + ci * 0.5;
      return `grayscale(${1 - ci}) saturate(${sat})`;
    };

    function applyFilters() {
      layerEls.forEach((l, i) => {
        const b = getBlur(i),
          c = getColor(i);
        let f = '';
        if (b > 0) f += `blur(${b}px) `;
        if (c !== 'none') f += c;
        l.style.filter = f.trim() || 'none';
      });
    }

    function reset2D() {
      gsap.killTweensOf(stackEl);
      gsap.set(layerEls, {
        scale: (i, t) => (t === layerEls[0] ? 1 : 0.95),
        opacity: (i, t) => (t === layerEls[0] ? 1 : 0),
        rotation: 0,
        rotationZ: 0,
        x: 0,
        y: 0,
        z: 0
      });
      layerEls.forEach(l => (l.style.filter = 'none'));
      gsap.set(stackEl, {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        x: 0,
        y: 0,
        z: 0,
        scale: 1
      });
    }

    function createTimeline() {
      if (timeline) timeline.kill();
      const rev = [...layerEls].reverse();
      timeline = gsap.timeline({ paused: true }).to(rev, {
        scale: (i, t) => getScale(layerEls.indexOf(t)),
        opacity: (i, t) => {
          const idx = layerEls.indexOf(t);
          return idx === 0 ? 1 : getOpacity(idx);
        },
        rotation: (i, t) => {
          if (!state.isRotation) return 0;
          return getRotVal(layerEls.indexOf(t));
        },
        duration,
        ease,
        stagger
      });
      applyFilters();
    }

    function applyShape(newShape) {
      layerEls.forEach((l, i) => {
        if (i === 0) return;
        l.style.clipPath = CLIP_PATH[newShape] || CLIP_PATH.rectangle;
      });
    }

    function center2D() {
      quickTos.forEach(({ layer }) => gsap.to(layer, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' }));
    }

    function compute3DOpacity(i) {
      const base = Math.max(1 - cssVarCache.opacityFalloff * i, 0.25);
      return state.isOpacity ? Math.max(base - opacityInterval * i, 0.1) : base;
    }

    function layout3D(depthFactor = 1) {
      const d = cssVarCache.depthStep * depthFactor;
      layerEls.forEach((l, i) => {
        const z = Math.round(i * d) + i * 0.1;
        const s = Math.max(1 - i * cssVarCache.scale3D, 0.35);
        const o = compute3DOpacity(i);
        const rotZ = state.isRotation ? getRotVal(i) : 0;
        l.style.transform = `translateZ(${z}px) scale(${s}) rotateZ(${rotZ}deg)`;
        l.style.opacity = o;
      });
      applyFilters();
    }

    function pose3DFlat() {
      gsap.to(stackEl, {
        rotationX: 0,
        rotationY: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    function center3D() {
      gsap.to(stackEl, {
        rotationX: 0,
        rotationY: 0,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    }

    function enable3D() {
      state.is3D = true;
      if (timeline) timeline.pause(0);
      const rev = [...layerEls].reverse();
      gsap.to(rev, {
        scale: (i, t) => {
          const idx = layerEls.indexOf(t);
          return idx === 0 ? 1 : Math.max(1 - idx * cssVarCache.scale3D, 0.35);
        },
        opacity: (i, t) => {
          const idx = layerEls.indexOf(t);
          return idx === 0 ? 1 : compute3DOpacity(idx);
        },
        duration,
        ease,
        stagger,
        onComplete: () => {
          layout3D();
          if (state.isHovered) {
            container.classList.add('lih-is3d-active');
            pose3DFlat();
          }
        }
      });
    }

    function disable3D() {
      state.is3D = false;
      container.classList.remove('lih-is3d-active');
      gsap.killTweensOf(stackEl);
      gsap.to(stackEl, {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        duration: 0.28,
        ease: 'power2.out'
      });
      const rev = [...layerEls].reverse();
      gsap.to(rev, {
        scale: (i, t) => (layerEls.indexOf(t) === 0 ? 1 : 0.95),
        opacity: (i, t) => (layerEls.indexOf(t) === 0 ? 1 : 0),
        rotation: 0,
        duration,
        ease,
        stagger: -stagger,
        onComplete: () => {
          layerEls.forEach(l => (l.style.transform = ''));
          reset2D();
          createTimeline();
        }
      });
    }

    function tiltPan(e) {
      if (!state.is3D || !state.isHovered) return;
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      const d = Math.min(1, Math.hypot(nx, ny));
      const depthFactor = 0.9 + d * 0.2;
      layout3D(depthFactor);

      const t = cssVarCache.tiltMax * cssVarCache.tiltBoost * cssVarCache.moveAmplify;
      const p = cssVarCache.panMax * cssVarCache.panBoost * cssVarCache.moveAmplify;

      gsap.to(stackEl, {
        rotationY: nx * t,
        rotationX: -ny * t,
        x: nx * p,
        y: ny * p,
        scale: 1,
        duration: 0.18,
        ease: 'power2.out'
      });
    }

    function onEnter() {
      state.isHovered = true;
      if (state.is3D) {
        container.classList.add('lih-is3d-active');
        layout3D();
        pose3DFlat();
      } else if (timeline) {
        timeline.play();
      }
    }

    function onLeave() {
      state.isHovered = false;
      if (state.is3D) {
        center3D();
        container.classList.remove('lih-is3d-active');
      } else if (timeline && !state.isParallax) {
        timeline.reverse();
      }
      if (state.isParallax) center2D();
      setTimeout(() => {
        if (!state.isHovered && !state.is3D && !state.isParallax) center2D();
      }, duration * 1000);
    }

    function processMouseMove() {
      if (!pendingMouseEvent) {
        rafId = null;
        return;
      }
      const e = pendingMouseEvent;
      pendingMouseEvent = null;
      rafId = null;

      if (state.is3D) {
        const inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.left + rect.width &&
          e.clientY >= rect.top &&
          e.clientY <= rect.top + rect.height;
        if (inside) tiltPan(e);
        else center3D();
        return;
      }
      if (!state.isParallax || !state.isHovered) return;
      const rx = (e.clientX - rect.left) / rect.width - 0.5,
        ry = (e.clientY - rect.top) / rect.height - 0.5;
      quickTos.forEach(({ xTo, yTo, mult }) => {
        xTo(rx * 2 * rect.width * followStrength * mult);
        yTo(ry * 2 * rect.height * followStrength * mult);
      });
    }

    function onMove(e) {
      pendingMouseEvent = e;
      if (!rafId) rafId = requestAnimationFrame(processMouseMove);
    }

    document.addEventListener('mousemove', onMove);
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    controllerRef.current = {
      _changeShape(newShape) {
        if (state.isTransitioning) return;
        state.isTransitioning = true;
        if (timeline) timeline.pause();
        reset2D();
        applyShape(newShape);
        createTimeline();
        state.isTransitioning = false;
        if (state.is3D) layout3D();
      },
      _toggleRotation(v) {
        state.isRotation = v;
        if (state.is3D) {
          layout3D();
        } else {
          if (!v) layerEls.forEach(l => gsap.set(l, { rotation: 0 }));
          if (timeline) timeline.kill();
          createTimeline();
          timeline.progress(state.isHovered ? 1 : 0);
        }
      },
      _toggleBlur(v) {
        state.isBlur = v;
        applyFilters();
        if (state.is3D) layout3D();
      },
      _toggleColor(v) {
        state.isColor = v;
        applyFilters();
        if (state.is3D) layout3D();
      },
      _toggleOpacity(v) {
        state.isOpacity = v;
        if (state.is3D) {
          layout3D();
        } else {
          if (timeline) timeline.kill();
          createTimeline();
          timeline.progress(state.isHovered ? 1 : 0);
        }
      },
      _toggleParallax(v) {
        state.isParallax = v;
        if (!v) {
          center2D();
          if (timeline) {
            state.isHovered ? timeline.play() : timeline.reverse();
          }
        }
      },
      _toggle3D(v) {
        v ? enable3D() : disable3D();
      },
      _updateCSSCache: updateCSSCache
    };

    reset2D();
    createTimeline();
    applyShape(shape);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
      if (timeline) timeline.kill();
      gsap.killTweensOf(stackEl);
      gsap.killTweensOf(layerEls);
    };
    // controller is intentionally set up once per layerCount; toggles/shape
    // changes are driven imperatively through controllerRef, not by re-running
    // this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerCount]);

  const resolvedLayerImages = Array.isArray(layerImages) ? layerImages : [];

  const rootStyle = {
    '--lih-width': typeof width === 'number' ? `${width}px` : width,
    '--lih-height': typeof height === 'number' ? `${height}px` : height,
    '--lih-depth-step': `${tunerValues.depth}px`,
    '--lih-scale-3d': scale3D,
    '--lih-tilt-max': tunerValues.tilt,
    '--lih-pan-max': `${tunerValues.pan}px`,
    '--lih-opacity-falloff': opacityFalloff,
    '--lih-move-amplify': tunerValues.amp,
    '--lih-tilt-boost': tiltBoost,
    '--lih-pan-boost': panBoost,

  };

  return (
    <div className={`inline-flex flex-col items-center gap-7.5 ${className}`}>
      <div
        ref={containerRef}
        className={
          'relative cursor-pointer overflow-hidden ' +
          'w-(--lih-width) h-(--lih-height) ' +
          '[@media(max-width:768px)]:w-[min(var(--lih-width),400px)] [@media(max-width:768px)]:h-[min(var(--lih-height),400px)] ' +
          '[@media(max-width:480px)]:w-[min(var(--lih-width),300px)] [@media(max-width:480px)]:h-[min(var(--lih-height),300px)] ' +
          '[&.lih-is3d-active]:overflow-visible [&.lih-is3d-active]:isolate ' +
          '[&.lih-is3d-active]:perspective-[1600px] [&.lih-is3d-active]:perspective-origin-[50%_50%]'
        }
        style={rootStyle}
      >
        <div
          ref={stackRef}
          className="absolute inset-0 transform-flat will-change-transform in-[.lih-is3d-active]:transform-3d "
        >
          {layers.map((_, i) => {
            const src = resolvedLayerImages.length ? resolvedLayerImages[i % resolvedLayerImages.length] : image;
            return (
              <div
                key={i}
                ref={addLayerRef}
                className={
                  'absolute inset-0 bg-cover bg-center bg-no-repeat backface-hidden will-change-transform ' +
                  (i === 0 ? '' : 'opacity-0 scale-95')
                }
                style={{
                  backgroundImage: src ? `url("${src}")` : undefined,
                   borderRadius: `${rounded}px`,
                  clipPath: CLIP_PATH[i === 0 ? 'rectangle' : shape]
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
