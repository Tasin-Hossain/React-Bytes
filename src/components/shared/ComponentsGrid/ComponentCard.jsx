// components/shared/ComponentGrid/ComponentCard.jsx

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { RiCloseLine } from 'react-icons/ri';
import { COMPONENT_VIDEOS } from '../../../constants/ComponentVideos';



const ComponentCard = ({ item, onRemove }) => {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [touched, setTouched] = useState(false);
  const videoSrc = COMPONENT_VIDEOS[item.videoKey];

  // mobile: treat tap as hover
  const isActive = hovered || touched;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0.1;
    }
  }, [isActive]);

  const handleLoadedMetadata = e => {
    e.target.currentTime = 0.1;
  };

  const handleRemove = e => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.(item.videoKey);
  };

  // mobile tap: toggle preview, second tap follows the link
  const handleTouchStart = () => {
    if (!touched) setTouched(true);
  };

  const handleTouchEnd = () => {
    // reset after a delay so the video plays briefly
    setTimeout(() => setTouched(false), 2000);
  };

  return (
    <Link
      to={item.path}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="
          group relative rounded-md overflow-hidden
          border border-(--border-secondary) bg-(--bg-card) cursor-pointer
          transition-all duration-200
          hover:scale-[1.02] active:scale-[0.99]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-secondary)
        "
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Thumbnail / video ─────────────────────────────────── */}
        <div
          className="relative w-full overflow-hidden bg-transparent!"
          style={{
            // fluid aspect ratio: taller on mobile, standard 4/3 on sm+
            aspectRatio: '4/3',
          }}
        >
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              loop muted playsInline
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
              className="absolute inset-0 w-full! h-full! object-cover  "
              style={{ pointerEvents: 'none' }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 pointer-events-none">
              <p className="text-xs sm:text-sm font-semibold text-(--text-muted) text-center leading-tight">
                {item.name}
              </p>
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-(--bg-white)/20" />
                ))}
              </div>
            </div>
          )}

          {/* remove button — always visible on touch devices */}
          {onRemove && (
            <button
              onClick={handleRemove}
              className="
                absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10
                w-7 h-7 flex items-center justify-center
                rounded-md bg-black/60 border border-white/10 text-(--text-muted)
                transition-all duration-150
                hover:bg-red-400/80 hover:text-(--text-primary) cursor-pointer
                opacity-100 sm:opacity-0 sm:group-hover:opacity-100
              "
            >
              <RiCloseLine size={15} />
            </button>
          )}
        </div>

        {/* ── Card footer ───────────────────────────────────────── */}
        <div className="px-3 py-2.5 sm:px-3.5 sm:py-3">
          <p className="text-xs sm:text-sm font-medium text-(--text-primary) truncate mb-0.5 sm:mb-2">
            {item.name}
          </p>
          <p className="text-[11px] sm:text-xs text-(--text-muted)">
            {item.category}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ComponentCard;
