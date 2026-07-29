// components/shared/Templates/TemplateCard.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';

const PriceBadge = ({ price }) => {
  if (price.type === 'free') {
    return (
      <span className="shrink-0 font-mono text-[10px] font-semibold uppercase leading-none tracking-wide px-2 py-1 rounded-md text-emerald-400 border border-emerald-400/40 bg-emerald-400/10 backdrop-blur-md shadow-[0_1px_8px_-2px_rgba(16,185,129,0.4)]">
        Free
      </span>
    );
  }
  return (
    <span className="shrink-0 font-mono text-[10px] font-semibold uppercase leading-none tracking-wide px-2 py-1 rounded-md text-(--brand) border border-(--brand)/50 bg-(--brand)/15 backdrop-blur-md shadow-[0_1px_8px_-2px_var(--brand)]">
      {price.amount}
    </span>
  );
};

const PlayGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
    <path d="M7 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
  </svg>
);

const TemplateCard = ({ template }) => {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [touched, setTouched] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
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

  return (
    <Link
      to={`/templates/${template.id}`}
      onTouchStart={() => setTouched(true)}
      onTouchEnd={() => setTimeout(() => setTouched(false), 2000)}
      className="block outline-none"
    >
      <div
        className="
          group relative rounded-2xl overflow-hidden
          border border-white/4 bg-(--bg-card) cursor-pointer
          p-1.5
          transition-all duration-300 ease-out
          hover:border-(--brand)/25 hover:-translate-y-1
          hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.55)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-secondary)
        "
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Thumbnail / video ─────────────────────────────────── */}
        <div className="relative w-full overflow-hidden rounded-xl bg-(--bg)" style={{ aspectRatio: '4/3' }}>
          {/* Shimmer placeholder while the image loads */}
          {!template.previewVideo && !imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.03] via-white/[0.06] to-white/[0.03]" />
          )}

          {template.previewVideo ? (
            <video
              ref={videoRef}
              src={template.previewVideo}
              loop
              muted
              playsInline
              preload="metadata"
              onLoadedMetadata={e => (e.target.currentTime = 0.1)}
              className="absolute inset-0 w-full! h-full! object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              style={{ pointerEvents: 'none' }}
            />
          ) : (
            <img
              src={template.thumbnail}
              alt={template.name}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Bottom scrim for legibility + depth, brightens slightly on hover */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

          {/* New badge */}
          {template.isNew && (
            <div className="absolute top-2 left-2 z-10">
              <span className="shrink-0 font-mono text-[10px] font-semibold uppercase leading-none tracking-wide px-2 py-1 rounded-md text-(--brand) border border-(--brand)/70 bg-(--brand)/25 backdrop-blur-md">
                New
              </span>
            </div>
          )}

          {/* Price badge */}
          <div className="absolute top-2 right-2 z-10">
            <PriceBadge price={template.price} />
          </div>

          {/* Live-preview indicator for video templates */}
          {template.previewVideo && (
            <div
              className={`absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-white/90 bg-black/40 backdrop-blur-md transition-opacity duration-200 ${
                isActive ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <PlayGlyph />
              <span className="text-[10px] font-medium tracking-wide">Preview</span>
            </div>
          )}
        </div>

        {/* ── Card footer ───────────────────────────────────────── */}
        <div className="px-2 pt-3 pb-1.5">
          <div className="flex items-center justify-between gap-2">
            <p
              className="text-sm text-(--text-primary) truncate transition-colors duration-200 group-hover:text-white"
              style={{ fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.2px' }}
            >
              {template.name}
            </p>
            {template.rating != null && (
              <span className="shrink-0 flex items-center gap-0.5 text-xs text-(--text-muted)">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-amber-400">
                  <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.9l-5.2 2.62.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
                </svg>
                {template.rating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-xs text-(--text-muted) mt-0.5 truncate">{template.tagline}</p>
        </div>
      </div>
    </Link>
  );
};

export default TemplateCard;