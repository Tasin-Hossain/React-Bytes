// components/shared/ComponentGrid/ComponentCard.jsx

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { RiCloseLine, RiHeartFill, RiHeartLine } from 'react-icons/ri';
import { COMPONENT_VIDEOS } from '../../../constants/ComponentVideos';
import { NEW, UPDATED } from '../../../constants/Categories';

const getSavedComponents = () => {
  try {
    return JSON.parse(localStorage.getItem('savedComponents') || '[]');
  } catch {
    return [];
  }
};

const isSaved = key => getSavedComponents().includes(key);

// Keeps a card's favorited state in sync with localStorage, even when it
// changes from another card / the sidebar / the favorites page.
const useIsFavorited = key => {
  const [favorited, setFavorited] = useState(() => isSaved(key));

  useEffect(() => {
    const sync = () => setFavorited(isSaved(key));
    sync();
    window.addEventListener('favorites:updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('favorites:updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, [key]);

  return [favorited, setFavorited];
};

const ComponentCard = ({ item, onRemove }) => {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [touched, setTouched] = useState(false);
  const videoSrc = COMPONENT_VIDEOS[item.videoKey];

  const [favorited, setFavorited] = useIsFavorited(item.videoKey);

  const isNew = NEW.includes(item.name);
  const isUpdated = UPDATED.includes(item.name);

  // mobile: treat tap as hover
  const isActive = hovered || touched;

  // Video plays on hover, pauses (and resets) on mouse-out.
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

  const handleToggleFavorite = e => {
    e.preventDefault();
    e.stopPropagation();
    const saved = new Set(getSavedComponents());
    if (saved.has(item.videoKey)) {
      saved.delete(item.videoKey);
    } else {
      saved.add(item.videoKey);
    }
    localStorage.setItem('savedComponents', JSON.stringify([...saved]));
    window.dispatchEvent(new Event('favorites:updated'));
    setFavorited(saved.has(item.videoKey));
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
    <Link to={item.path} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div
        className="
          group relative rounded-2xl overflow-hidden
          border border-white/4 bg-(--bg-card) cursor-pointer
          p-1.5
          transition-colors duration-200
          hover:border-white/10
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-secondary)
        "
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Thumbnail / video ─────────────────────────────────── */}
        <div
          className="relative w-full overflow-hidden rounded-xl bg-(--bg)"
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

          {/* New / Updated badge */}
          {(isNew || isUpdated) && (
            <div className="absolute top-2 left-2 z-10">
              {isNew ? (
                <span className="shrink-0 font-mono text-[10px] font-semibold uppercase leading-none tracking-wide px-2 py-0.75 rounded-md text-(--brand) border border-(--brand)/70 bg-(--brand)/25 backdrop-blur-sm">
                  New
                </span>
              ) : (
                <span className="shrink-0 font-mono text-[10px] font-semibold uppercase leading-none tracking-wide px-2 py-0.75 rounded-md text-(--text-muted) border border-white/10 bg-black/35 backdrop-blur-sm">
                  Updated
                </span>
              )}
            </div>
          )}

          {/* remove button — used on the Favorites page */}
          {onRemove && (
            <button
              onClick={handleRemove}
              className="
                absolute top-2 right-2 z-10
                w-7 h-7 flex items-center justify-center
                rounded-lg bg-black/35 border border-white/10 text-white/85
                backdrop-blur-sm
                transition-all duration-200
                hover:bg-black/55 hover:scale-110 hover:text-red-400 cursor-pointer
                opacity-100 sm:opacity-0 sm:group-hover:opacity-100
              "
            >
              <RiCloseLine size={15} />
            </button>
          )}

          {/* favorite toggle — shown on hover everywhere except the Favorites page itself */}
          {!onRemove && (
            <button
              onClick={handleToggleFavorite}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              className={`
                absolute top-2 right-2 z-10
                w-7 h-7 flex items-center justify-center
                rounded-lg bg-black/35 border border-white/10
                backdrop-blur-sm
                transition-all duration-200
                hover:bg-black/55 hover:scale-110 cursor-pointer
                ${favorited ? 'text-(--brand)' : 'text-white/85'}
                ${favorited ? 'opacity-100' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'}
              `}
            >
              {favorited ? <RiHeartFill size={15} /> : <RiHeartLine size={15} />}
            </button>
          )}
        </div>

        {/* ── Card footer ───────────────────────────────────────── */}
        <div className="px-2 pt-3 pb-1.5">
          <p
            className="text-sm text-(--text-primary) truncate"
            style={{ fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.2px' }}
          >
            {item.name}
          </p>
          <p className="text-xs text-(--text-muted) mt-0.5">
            {item.category}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ComponentCard;
