// TS-CSS variant
import { memo, useEffect, useRef, useState, CSSProperties } from "react";
import { gsap } from "gsap";

const FILTER_STYLE = "grayscale(100%) brightness(0.55) contrast(1.15)";

type EntranceType =
  | "pop" | "fade" | "bottom" | "top" | "left" | "right"
  | "flip" | "scatter" | "spin" | "zoomBlur";

function getEntranceVars(type: EntranceType) {
  switch (type) {
    case "fade":     return { opacity: 0 };
    case "bottom":   return { opacity: 0, y: "+=140" };
    case "top":      return { opacity: 0, y: "-=140" };
    case "left":     return { opacity: 0, x: "-=180" };
    case "right":    return { opacity: 0, x: "+=180" };
    case "flip":     return { opacity: 0, scaleX: 0 };
    case "spin":     return { opacity: 0, scale: 0, rotation: "+=360" };
    case "zoomBlur": return { opacity: 0, scale: 2.4, filter: "blur(14px)" };
    case "scatter":
      return {
        opacity: 0, scale: 0.3,
        x: () => gsap.utils.random(-300, 300),
        y: () => gsap.utils.random(-300, 300),
        rotation: () => gsap.utils.random(-180, 180),
      };
    case "pop":
    default:
      return { opacity: 0, scale: 0, rotation: 0 };
  }
}

interface RotatingCarouselProps {
  images?:                  string[];
  faceCount?:               number;
  faceWidth?:               number;
  faceHeight?:              number;
  maxFaceWidth?:            number;
  minFaceWidth?:            number;
  responsive?:              boolean;
  cardGap?:                 number;
  draggable?:               boolean;
  dragSensitivity?:         number;
  shadeIntensity?:          number;
  shadeBase?:               number;
  autoRotate?:              boolean;
  autoRotateSpeed?:         number;
  autoRotateDirection?:     number;
  smoothness?:              number;
  inertia?:                 boolean;
  inertiaResistance?:       number;
  pauseAutoRotateOnHover?:  boolean;
  initialRotation?:         number;
  faceFit?:                 string;
  onFaceChange?:            (index: number) => void;
  entranceAnimation?:       boolean;
  entranceType?:            EntranceType;
  entranceDuration?:        number;
  entranceStagger?:         number;
  entranceEase?:            string;
  filterOnHover?:           boolean;
  defaultFiltered?:         boolean;
  className?:               string;
  cardClassName?:           string;
}

const RotatingCarousel = memo(function RotatingCarousel({
  images = [
    "https://picsum.photos/id/37/300/300",
    "https://picsum.photos/id/38/300/300",
    "https://picsum.photos/id/39/300/300",
    "https://picsum.photos/id/40/300/300",
    "https://picsum.photos/id/42/300/300",
    "https://picsum.photos/id/43/300/300",
  ],
  faceCount = 6,
  faceWidth = 300,
  faceHeight = 300,
  maxFaceWidth,
  minFaceWidth = 120,
  responsive = true,
  cardGap = 0,
  draggable = true,
  dragSensitivity = 1,
  shadeIntensity = 0.85,
  shadeBase = 0.15,
  autoRotate = false,
  autoRotateSpeed = 12,
  autoRotateDirection = 1,
  smoothness = 0.25,
  inertia = true,
  inertiaResistance = 7,
  pauseAutoRotateOnHover = true,
  initialRotation = 0,
  faceFit = "cover",
  onFaceChange,
  entranceAnimation = true,
  entranceType = "spin",
  entranceDuration = 0.9,
  entranceStagger = 0.07,
  entranceEase = "back.out(1.4)",
  filterOnHover = true,
  defaultFiltered = true,
  className = "",
  cardClassName = "",
}: RotatingCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef     = useRef<HTMLDivElement>(null);
  const stageRef     = useRef<HTMLDivElement>(null);
  const autoTween    = useRef<gsap.core.Tween | null>(null);
  const smoothTween  = useRef<gsap.core.Tween | null>(null);
  const facesRef     = useRef<HTMLDivElement[]>([]);
  const isHovering   = useRef(false);
  const lastFace     = useRef<number | null>(null);
  const dragRef      = useRef({ active: false, startX: 0, vel: 0 });

  const [filteredFaces, setFilteredFaces] = useState<Set<number>>(() => {
    if (!defaultFiltered) return new Set();
    const c = Math.min(Math.max(faceCount, 3), 12);
    return new Set(Array.from({ length: c }, (_, i) => i));
  });

  const aspect   = faceHeight / faceWidth;
  const capWidth = maxFaceWidth || faceWidth;

  const [computedWidth, setComputedWidth] = useState(
    responsive ? Math.min(faceWidth, capWidth) : faceWidth
  );

  useEffect(() => {
    if (!responsive) { setComputedWidth(faceWidth); return; }
    const el = containerRef.current;
    if (!el) return;
    const recalc = (w: number) => setComputedWidth(Math.max(minFaceWidth, Math.min(w, capWidth)));
    recalc(el.clientWidth);
    const ro = new ResizeObserver(entries => recalc(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [responsive, faceWidth, capWidth, minFaceWidth]);

  const computedHeight = Math.round(computedWidth * aspect);

  const setFaceFiltered = (index: number, value: boolean) => {
    setFilteredFaces(prev => {
      const next = new Set(prev);
      value ? next.add(index) : next.delete(index);
      return next;
    });
  };

  useEffect(() => {
    const wheel     = wheelRef.current;
    const stage     = stageRef.current;
    const container = containerRef.current;
    if (!wheel || !stage || !container) return;

    const clampedCount = Math.min(Math.max(faceCount, 3), 12);
    const angleStep    = 360 / clampedCount;
    const baseRadius   = Math.round((computedWidth / 2) / Math.tan(Math.PI / clampedCount));
    const radius       = Math.max(0, baseRadius + cardGap);

    stage.style.perspective = Math.round(radius * 3.5) + "px";

    wheel.innerHTML = "";
    facesRef.current = [];

    for (let i = 0; i < clampedCount; i++) {
      const face = document.createElement("div");
      if (cardClassName) face.className = `rc-face ${cardClassName}`;
      face.style.cssText = `
        position:absolute;
        width:${computedWidth}px;
        height:${computedHeight}px;
        background-image:url(${images[i % images.length]});
        background-size:${faceFit};
        border-radius:15px;
        background-position:center;
        transition:filter 0.25s ease;
        filter:${filteredFaces.has(i) ? FILTER_STYLE : "none"};
        pointer-events:auto;
      `;

      face.addEventListener("pointerenter", () => {
        if (!filterOnHover) return;
        face.style.filter = defaultFiltered ? "none" : FILTER_STYLE;
        setFaceFiltered(i, !defaultFiltered);
      });
      face.addEventListener("pointerleave", () => {
        if (!filterOnHover) return;
        face.style.filter = defaultFiltered ? FILTER_STYLE : "none";
        setFaceFiltered(i, defaultFiltered);
      });

      wheel.appendChild(face);
      facesRef.current.push(face);

      gsap.set(face, {
        rotateY: i * angleStep,
        transformOrigin: `50% 50% -${radius}px`,
        z: radius,
        backfaceVisibility: "hidden",
      });
    }

    gsap.set(wheel, { rotationY: initialRotation });

    const shade = () => {
      const rot = gsap.getProperty(wheel, "rotationY") as number;
      facesRef.current.forEach((f, i) => {
        const angle = rot + i * angleStep;
        const w = gsap.utils.wrapYoyo(0, 90, Math.abs(angle % 180));
        f.style.opacity = String(shadeBase + (1 - w / 90) * shadeIntensity);
      });
      if (onFaceChange) {
        const normalized = ((-( gsap.getProperty(wheel, "rotationY") as number) % 360) + 360) % 360;
        const nearest = Math.round(normalized / angleStep) % clampedCount;
        if (nearest !== lastFace.current) {
          lastFace.current = nearest;
          onFaceChange(nearest);
        }
      }
    };

    if (entranceAnimation) {
      gsap.from(facesRef.current, {
        ...getEntranceVars(entranceType),
        duration: entranceDuration,
        ease: entranceEase,
        stagger: entranceStagger,
        overwrite: "auto",
        onUpdate: shade,
        onComplete: shade,
      });
    } else {
      shade();
    }

    const onPointerDown = (e: PointerEvent | TouchEvent) => {
      if (!draggable) return;
      dragRef.current.active  = true;
      dragRef.current.startX  = "touches" in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
      dragRef.current.vel     = 0;
      autoTween.current?.pause();
      smoothTween.current?.kill();
    };

    const onPointerMove = (e: PointerEvent | TouchEvent) => {
      if (!dragRef.current.active) return;
      const clientX = "touches" in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
      const delta   = (clientX - dragRef.current.startX) * dragSensitivity;
      dragRef.current.vel = delta;
      smoothTween.current?.kill();
      smoothTween.current = gsap.to(wheel, {
        rotationY: `+=${delta}`,
        duration: smoothness,
        ease: "power1.out",
        onUpdate: shade,
        overwrite: "auto",
      });
      dragRef.current.startX = clientX;
    };

    const onPointerUp = () => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      if (inertia && Math.abs(dragRef.current.vel) > 1) {
        smoothTween.current?.kill();
        smoothTween.current = gsap.to(wheel, {
          rotationY: `+=${dragRef.current.vel * inertiaResistance}`,
          duration: 1.5,
          ease: "power3.out",
          onUpdate: shade,
          overwrite: "auto",
        });
      }
      if (autoRotate && !isHovering.current) autoTween.current?.resume();
    };

    const onContainerEnter = () => {
      isHovering.current = true;
      if (pauseAutoRotateOnHover) autoTween.current?.pause();
    };
    const onContainerLeave = () => {
      isHovering.current = false;
      if (pauseAutoRotateOnHover && autoRotate && !dragRef.current.active)
        autoTween.current?.resume();
    };

    container.addEventListener("pointerdown",  onPointerDown as EventListener);
    container.addEventListener("touchstart",   onPointerDown as EventListener, { passive: true });
    container.addEventListener("pointerenter", onContainerEnter);
    container.addEventListener("pointerleave", onContainerLeave);
    window.addEventListener("pointermove", onPointerMove as EventListener);
    window.addEventListener("pointerup",   onPointerUp);
    window.addEventListener("touchmove",   onPointerMove as EventListener, { passive: true });
    window.addEventListener("touchend",    onPointerUp);

    return () => {
      autoTween.current?.kill();
      smoothTween.current?.kill();
      gsap.killTweensOf(wheel);
      container.removeEventListener("pointerdown",  onPointerDown as EventListener);
      container.removeEventListener("touchstart",   onPointerDown as EventListener);
      container.removeEventListener("pointerenter", onContainerEnter);
      container.removeEventListener("pointerleave", onContainerLeave);
      window.removeEventListener("pointermove", onPointerMove as EventListener);
      window.removeEventListener("pointerup",   onPointerUp);
      window.removeEventListener("touchmove",   onPointerMove as EventListener);
      window.removeEventListener("touchend",    onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    images, faceCount, computedWidth, computedHeight, cardGap,
    draggable, dragSensitivity, shadeBase, shadeIntensity, smoothness,
    inertia, inertiaResistance, pauseAutoRotateOnHover, initialRotation,
    faceFit, onFaceChange, entranceAnimation, entranceType,
    entranceDuration, entranceStagger, entranceEase,
    filterOnHover, defaultFiltered, cardClassName,
  ]);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    autoTween.current?.kill();
    autoTween.current = null;
    if (autoRotate) {
      autoTween.current = gsap.to(wheel, {
        rotationY: `+=${360 * autoRotateDirection}`,
        duration: autoRotateSpeed,
        repeat: -1,
        ease: "none",
        onUpdate: () => {
          const rot          = gsap.getProperty(wheel, "rotationY") as number;
          const clampedCount = Math.min(Math.max(faceCount, 3), 12);
          const angleStep    = 360 / clampedCount;
          facesRef.current.forEach((f, i) => {
            const angle = rot + i * angleStep;
            const w = gsap.utils.wrapYoyo(0, 90, Math.abs(angle % 180));
            f.style.opacity = String(shadeBase + (1 - w / 90) * shadeIntensity);
          });
        },
      });
      if (isHovering.current && pauseAutoRotateOnHover) autoTween.current.pause();
    }
    return () => { autoTween.current?.kill(); autoTween.current = null; };
  }, [autoRotate, autoRotateSpeed, autoRotateDirection, faceCount, shadeBase, shadeIntensity, pauseAutoRotateOnHover]);

  const style = {
    container: {
      position:  "relative",
      width:     "100%",
      height:    "100%",
      minHeight: computedHeight,
      cursor:    draggable ? "grab" : "default",
    } as CSSProperties,
    stage: {
      position:  "absolute",
      left:      "50%",
      top:       "50%",
      width:     computedWidth,
      height:    computedHeight,
      transform: "translate(-50%, -50%)",
    } as CSSProperties,
    wheel: {
      position:      "absolute",
      width:         "100%",
      height:        "100%",
      transformStyle:"preserve-3d",
    } as CSSProperties,
  };

  const classes = `${className}`;

  return (
    <div ref={containerRef} style={style.container} className={classes}>
      <div ref={stageRef} style={style.stage}>
        <div ref={wheelRef} style={style.wheel} />
      </div>
    </div>
  );
});

export default RotatingCarousel;