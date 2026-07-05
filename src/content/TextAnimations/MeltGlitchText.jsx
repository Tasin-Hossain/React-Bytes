import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * MeltGlitchText
 * Responsive notes:
 *  - fontSize scales with the viewport via CSS clamp() instead of a fixed px value.
 *  - radius / dropAmount scale proportionally to the *actual rendered* font size,
 *    so the glitch effect feels consistent whether the text is huge on desktop
 *    or shrunk down on a phone.
 *  - Pointer Events (not mouse-only) are used so touch/pen devices trigger the
 *    effect too, with position tracked on drag instead of hover.
 *  - Text is allowed to wrap on narrow screens instead of forcing nowrap +
 *    horizontal overflow.
 */
export default function MeltGlitchText({
  text = "Glitchy on hover.",
  fontSize = 42,
  fontWeight = 800,
  color = "#ffffff",
  cyanColor = "#5ce1ff",
  magentaColor = "#ff5cf0",
  radius = 110,
  dropAmount = 16,
  className = "",
}) {
  const wrapRef = useRef(null);
  const charsRef = useRef([]);
  const settersRef = useRef([]);
  const mouseXRef = useRef(-9999);
  const activeRef = useRef(false);
  const rafRef = useRef(null);
  const scaleRef = useRef(1);

  // Track the wrapper's actual rendered font-size (post clamp()) so the
  // pointer radius and drop amount can be scaled to match.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;

    const updateScale = () => {
      const rendered = parseFloat(getComputedStyle(wrap).fontSize) || fontSize;
      scaleRef.current = rendered / fontSize;
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(wrap);

    return () => ro.disconnect();
  }, [fontSize]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    wrap.innerHTML = "";
    charsRef.current = [];
    settersRef.current = [];

    text.split("").forEach((ch) => {
      const holder = document.createElement("span");
      holder.style.display = "inline-block";
      holder.style.position = "relative";
      holder.style.fontWeight = String(fontWeight);

      const base = document.createElement("span");
      base.style.position = "relative";
      base.style.zIndex = "3";
      base.style.color = color;
      base.style.display = "inline-block";
      base.textContent = ch === " " ? "\u00A0" : ch;

      const cyan = document.createElement("span");
      cyan.style.position = "absolute";
      cyan.style.left = "0";
      cyan.style.top = "0";
      cyan.style.color = cyanColor;
      cyan.style.opacity = "0";
      cyan.style.zIndex = "1";
      cyan.style.filter = "blur(0.5px)";
      cyan.textContent = ch === " " ? "\u00A0" : ch;

      const magenta = document.createElement("span");
      magenta.style.position = "absolute";
      magenta.style.left = "0";
      magenta.style.top = "0";
      magenta.style.color = magentaColor;
      magenta.style.opacity = "0";
      magenta.style.zIndex = "2";
      magenta.style.filter = "blur(0.5px)";
      magenta.textContent = ch === " " ? "\u00A0" : ch;

      holder.appendChild(cyan);
      holder.appendChild(magenta);
      holder.appendChild(base);
      wrap.appendChild(holder);

      charsRef.current.push({ holder, base, cyan, magenta });
    });

    settersRef.current = charsRef.current.map((c) => ({
      baseY: gsap.quickTo(c.base, "y", { duration: 0.45, ease: "power3.out" }),
      cyanY: gsap.quickTo(c.cyan, "y", { duration: 0.65, ease: "power3.out" }),
      cyanX: gsap.quickTo(c.cyan, "x", { duration: 0.6, ease: "power3.out" }),
      magY: gsap.quickTo(c.magenta, "y", { duration: 0.8, ease: "power3.out" }),
      magX: gsap.quickTo(c.magenta, "x", { duration: 0.75, ease: "power3.out" }),
      cyanOp: gsap.quickTo(c.cyan, "opacity", { duration: 0.35 }),
      magOp: gsap.quickTo(c.magenta, "opacity", { duration: 0.35 }),
    }));

    const setPointer = (clientX) => {
      mouseXRef.current = clientX;
      activeRef.current = true;
    };
    const clearPointer = () => {
      activeRef.current = false;
    };

    const handlePointerMove = (e) => setPointer(e.clientX);
    const handlePointerLeave = () => clearPointer();
    const handlePointerDown = (e) => setPointer(e.clientX);
    const handlePointerUp = () => clearPointer();

    wrap.addEventListener("pointermove", handlePointerMove);
    wrap.addEventListener("pointerleave", handlePointerLeave);
    wrap.addEventListener("pointerdown", handlePointerDown);
    wrap.addEventListener("pointerup", handlePointerUp);
    wrap.addEventListener("pointercancel", clearPointer);

    const tick = () => {
      const scale = scaleRef.current;
      const scaledRadius = radius * scale;
      const scaledDrop = dropAmount * scale;

      charsRef.current.forEach((c, i) => {
        const rect = c.holder.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const dist = mouseXRef.current - cx;
        const proximity = activeRef.current
          ? Math.max(0, 1 - Math.abs(dist) / scaledRadius)
          : 0;
        const eased = Math.sin(proximity * Math.PI * 0.5);
        const side = dist < 0 ? 1 : -1;

        const s = settersRef.current[i];
        s.baseY(eased * scaledDrop);
        s.cyanY(eased * scaledDrop * 1.9);
        s.cyanX(side * eased * 4 * scale);
        s.magY(eased * scaledDrop * 2.6);
        s.magX(-side * eased * 4 * scale);
        s.cyanOp(eased * 0.9);
        s.magOp(eased * 0.9);
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      wrap.removeEventListener("pointermove", handlePointerMove);
      wrap.removeEventListener("pointerleave", handlePointerLeave);
      wrap.removeEventListener("pointerdown", handlePointerDown);
      wrap.removeEventListener("pointerup", handlePointerUp);
      wrap.removeEventListener("pointercancel", clearPointer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [text, fontWeight, color, cyanColor, magentaColor, radius, dropAmount]);

  return (
    <div
      ref={wrapRef}
      className={"relative whitespace-normal wrap-break-word leading-tight touch-none " + className}
      style={{
        // Scales between ~55% and 100% of the requested fontSize depending on
        // viewport width, instead of a fixed px value that overflows on mobile.
        fontSize: `clamp(${(fontSize * 0.55).toFixed(1)}px, ${(fontSize / 16).toFixed(2)}vw, ${fontSize}px)`,
      }}
    />
  );
}
