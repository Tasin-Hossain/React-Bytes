// components/shared/ComponentGrid/ComponentCard.jsx

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { RiCloseLine } from 'react-icons/ri';
import { COMPONENT_VIDEOS } from '../../../constants/ComponentVideos';


const GRADIENTS = [
  'linear-gradient(135deg, #1a1025 0%, #2d1b4e 50%, #0d0d1a 100%)',
  'linear-gradient(135deg, #0d1a2e 0%, #1a3a5c 50%, #0a0f1a 100%)',
  'linear-gradient(135deg, #1a0d2e 0%, #3d1a5c 50%, #0d0a1a 100%)',
  'linear-gradient(135deg, #0d1a1a 0%, #1a4a3a 50%, #0a1212 100%)',
  'linear-gradient(135deg, #1a1a0d 0%, #3a3a1a 50%, #0d0d08 100%)',
];

const getGradient = key =>
  GRADIENTS[key.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length];

const ComponentCard = ({ item, onRemove }) => {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const videoSrc = COMPONENT_VIDEOS[item.videoKey];

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0.1;
    }
  }, [hovered]);

  const handleLoadedMetadata = e => {
    e.target.currentTime = 0.1;
  };

  const handleRemove = e => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.(item.videoKey);
  };

  return (
    <Link to={item.path}>
      <div
        className="group relative rounded-md overflow-hidden border border-(--border-secondary)
          bg-(--bg-card) cursor-pointer transition-all duration-200 hover:scale-[1.02]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="relative w-full aspect-4/3 overflow-hidden"
          style={{ background: getGradient(item.videoKey) }}
        >
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              loop muted playsInline
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ pointerEvents: 'none' }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 pointer-events-none">
              <p className="text-sm font-semibold text-white/60 text-center leading-tight">
                {item.name}
              </p>
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
                ))}
              </div>
            </div>
          )}

          {onRemove && (
            <button
              onClick={handleRemove}
              className="absolute top-2.5 right-2.5 z-10 w-7 h-7 flex items-center justify-center
                rounded-md bg-black/60 border border-white/10 text-(--text-muted)
                opacity-0 group-hover:opacity-100 transition-all duration-150
                hover:bg-red-400/80 hover:text-(--text-primary) cursor-pointer"
            >
              <RiCloseLine size={15} />
            </button>
          )}
        </div>

        <div className="px-3.5 py-3">
          <p className="text-sm font-medium text-(--text-primary) truncate mb-2">{item.name}</p>
          <p className="text-xs text-(--text-muted) mt-0.5">{item.category}</p>
        </div>
      </div>
    </Link>
  );
};

export default ComponentCard;