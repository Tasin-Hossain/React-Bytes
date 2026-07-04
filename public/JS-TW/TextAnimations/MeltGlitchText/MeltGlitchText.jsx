// JS-TW variant (identical to the uploaded source)
import { useEffect, useRef } from "react";
import gsap from "gsap";

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
      holder.style.fontSize = `${fontSize}px`;
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
      baseY: gsap.quickTo(c.base,    "y",       { duration: 0.45, ease: "power3.out" }),
      cyanY: gsap.quickTo(c.cyan,    "y",       { duration: 0.65, ease: "power3.out" }),
      cyanX: gsap.quickTo(c.cyan,    "x",       { duration: 0.6,  ease: "power3.out" }),
      magY:  gsap.quickTo(c.magenta, "y",       { duration: 0.8,  ease: "power3.out" }),
      magX:  gsap.quickTo(c.magenta, "x",       { duration: 0.75, ease: "power3.out" }),
      cyanOp:gsap.quickTo(c.cyan,    "opacity", { duration: 0.35 }),
      magOp: gsap.quickTo(c.magenta, "opacity", { duration: 0.35 }),
    }));

    const handleMove  = (e) => { mouseXRef.current = e.clientX; activeRef.current = true; };
    const handleLeave = ()  => { activeRef.current = false; };

    wrap.addEventListener("mousemove",  handleMove);
    wrap.addEventListener("mouseleave", handleLeave);

    const tick = () => {
      charsRef.current.forEach((c, i) => {
        const rect = c.holder.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const dist = mouseXRef.current - cx;
        const proximity = activeRef.current ? Math.max(0, 1 - Math.abs(dist) / radius) : 0;
        const eased = Math.sin(proximity * Math.PI * 0.5);
        const side = dist < 0 ? 1 : -1;

        const s = settersRef.current[i];
        s.baseY(eased * dropAmount);
        s.cyanY(eased * dropAmount * 1.9);
        s.cyanX(side * eased * 4);
        s.magY(eased * dropAmount * 2.6);
        s.magX(-side * eased * 4);
        s.cyanOp(eased * 0.9);
        s.magOp(eased * 0.9);
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      wrap.removeEventListener("mousemove",  handleMove);
      wrap.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [text, fontSize, fontWeight, color, cyanColor, magentaColor, radius, dropAmount]);

  return (
    <div
      ref={wrapRef}
      className={"relative whitespace-nowrap " + className}
    />
  );
}