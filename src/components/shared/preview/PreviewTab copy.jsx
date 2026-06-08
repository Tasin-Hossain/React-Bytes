import { useRef, useState, useEffect, useCallback } from "react";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { FaDesktop, FaTabletAlt, FaMobileAlt } from "react-icons/fa";
import { RiDraggable } from "react-icons/ri";

const DEVICES = [
  { key: "desktop", icon: FaDesktop, label: "Desktop" },
  { key: "tablet", icon: FaTabletAlt, label: "Tablet", width: 480 },
  { key: "mobile", icon: FaMobileAlt, label: "Mobile", width: 375 },
];

const PreviewTab = ({
  children,
  showReplay = true,
  minHeight = 420,
  stageBg = "#0a0a0a",
  onReplay,
}) => {
  const wrapperRef = useRef(null);
  const [stageWidth, setStageWidth] = useState(null);
  const [activeDevice, setActiveDevice] = useState("desktop");
  const [isDragging, setIsDragging] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const dragStart = useRef({ x: 0, w: 0 });

  const getMaxWidth = useCallback(() => {
    if (!wrapperRef.current) return 800;
    return wrapperRef.current.offsetWidth;
  }, []);

  useEffect(() => {
    const init = () => setStageWidth(getMaxWidth());
    init();
    const id = requestAnimationFrame(init);
    return () => cancelAnimationFrame(id);
  }, [getMaxWidth]);

  useEffect(() => {
    const onResize = () => {
      if (activeDevice === "desktop") setStageWidth(getMaxWidth());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeDevice, getMaxWidth]);

  const applyWidth = useCallback(
    (w) => {
      const max = getMaxWidth();
      const clamped = Math.max(280, Math.min(w, max));
      setStageWidth(clamped);
      const matched = DEVICES.find((d) => d.width && Math.abs(d.width - clamped) < 20);
      setActiveDevice(matched ? matched.key : "custom");
    },
    [getMaxWidth]
  );

  const switchDevice = useCallback(
    (device) => {
      setActiveDevice(device.key);
      if (device.key === "desktop") {
        setStageWidth(getMaxWidth());
      } else {
        setStageWidth(device.width);
      }
    },
    [getMaxWidth]
  );

  const onMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, w: stageWidth };
    e.preventDefault();
  };

  const onTouchStart = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.touches[0].clientX, w: stageWidth };
  };

  useEffect(() => {
    const onMove = (x) =>
      applyWidth(dragStart.current.w + (x - dragStart.current.x));
    const onMouseMove = (e) => { if (isDragging) onMove(e.clientX); };
    const onTouchMove = (e) => { if (isDragging) onMove(e.touches[0].clientX); };
    const onUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [isDragging, applyWidth]);

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
    onReplay?.();
  };

  const handleLeft = stageWidth ?? 0;

  return (
    <div className="flex flex-col gap-2 w-full select-none mb-6">

      {/* Toolbar — right aligned */}
      <div className="flex items-center justify-end gap-2">
        <div className="flex gap-0.5 p-[3px] rounded-lg border border-(--border-secondary) bg-(--bg-white)/5">
          {DEVICES.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              title={label}
              onClick={() => switchDevice(DEVICES.find((d) => d.key === key))}
              className={`flex items-center justify-center w-8 h-7 rounded-md border transition-all duration-150 cursor-pointer
                ${
                  activeDevice === key
                    ? "bg-(--bg-white) border-(--border-secondary) text-(--text-primary)"
                    : "border-transparent text-(--text-muted) hover:text-(--text-primary)"
                }`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        {showReplay && (
          <button
            onClick={handleReplay}
            title="Replay"
            className="flex items-center justify-center w-8 h-7 rounded-md border border-(--border-button) bg-(--bg-button)
              text-(--text-muted) hover:text-(--text-primary) transition-all duration-150 cursor-pointer"
          >
            <FaArrowRotateLeft size={13} />
          </button>
        )}
      </div>

      {/* Outer wrapper — explicit height so absolute children work */}
      <div
        ref={wrapperRef}
        className="relative w-full rounded-md border border-(--border-secondary) overflow-hidden"
        style={{
          height: minHeight,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundColor: "#181818",
        }}
      >
        {/* Stage: solid bg, covers left portion */}
        <div
          className="absolute top-0 left-0 bottom-0 flex items-center justify-center overflow-hidden"
          style={{
            width: stageWidth ? `${stageWidth}px` : "100%",
            backgroundColor: stageBg,
            transition: isDragging
              ? "none"
              : "width 0.22s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <div
            key={replayKey}
            style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {children}
          </div>
        </div>

        {/* Drag handle */}
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          className="absolute top-0 bottom-0 flex items-center justify-center cursor-ew-resize group"
          style={{
            left: handleLeft,
            width: 20,
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
          aria-label="Drag to resize"
        >
          <div
            className={`w-[3px] h-10 rounded-full flex items-center justify-center transition-colors duration-150
              ${isDragging ? "bg-white/60" : "bg-white/25 group-hover:bg-white/55"}`}
          >
            <RiDraggable
              size={9}
              className={`transition-colors duration-150
                ${isDragging ? "text-white/80" : "text-white/40 group-hover:text-white/75"}`}
            />
          </div>
        </div>
      </div>

      {/* px label */}
      {stageWidth && (
        <span className="text-xs font-mono text-(--text-muted)">
          {stageWidth}px
        </span>
      )}
    </div>
  );
};

export default PreviewTab;
