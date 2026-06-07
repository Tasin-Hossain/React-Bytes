import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';
import { CATEGORIES } from '../constants/Categories';
import { COMPONENT_VIDEOS } from '../constants/ComponentVideos';
import { EmptyState } from '../components/shared/EmptyState';
import { Input, InputGroup } from '../components/ui/Input/Input';
import CategoryDropdown from '../components/shared/CategoryDropdown';

//  helpers
const slug = str => str.replace(/\s+/g, '-').toLowerCase();

const SKIP_CATEGORIES = ['Get Started'];

const getSaved = () => {
  try {
    return JSON.parse(localStorage.getItem('savedComponents') || '[]');
  } catch {
    return [];
  }
};

// Build a lookup: "text-animations/magnetic-text" → { name, category, path, videoKey }
const buildComponentMap = () => {
  const map = {};
  for (const cat of CATEGORIES) {
    if (SKIP_CATEGORIES.includes(cat.name)) continue;
    for (const sub of cat.subcategories) {
      const key = `${slug(cat.name)}/${slug(sub)}`;
      map[key] = {
        name: sub,
        category: cat.name,
        path: `/${slug(cat.name)}/${slug(sub)}`,
        videoKey: key
      };
    }
  }
  return map;
};

const COMPONENT_MAP = buildComponentMap();

// All unique category names (excluding Get Started)
const ALL_CATEGORIES = [
  'All Components',
  ...CATEGORIES.filter(c => !SKIP_CATEGORIES.includes(c.name)).map(c => c.name)
];

// GradientPlaceholder
const GRADIENTS = [
  'linear-gradient(135deg, #1a1025 0%, #2d1b4e 50%, #0d0d1a 100%)',
  'linear-gradient(135deg, #0d1a2e 0%, #1a3a5c 50%, #0a0f1a 100%)',
  'linear-gradient(135deg, #1a0d2e 0%, #3d1a5c 50%, #0d0a1a 100%)',
  'linear-gradient(135deg, #0d1a1a 0%, #1a4a3a 50%, #0a1212 100%)',
  'linear-gradient(135deg, #1a1a0d 0%, #3a3a1a 50%, #0d0d08 100%)'
];

const getGradient = key => GRADIENTS[key.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length];

// VideoCard
const VideoCard = ({ item, onRemove }) => {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const videoSrc = COMPONENT_VIDEOS[item.videoKey];

  const handleMouseEnter = () => {
    setHovered(true);
    if (videoRef.current && videoSrc) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current && videoSrc) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleRemove = e => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(item.videoKey);
  };

  return (
    <Link to={item.path}>
       <title>Favorites | React Bytes</title>
      <div
        className="group relative rounded-md overflow-hidden border border-(--border-secondary)
          bg-(--bg-card) cursor-pointer transition-all duration-200
          hover:border-(--border-secondary) hover:scale-[1.02]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnail / Video area */}
        <div className="relative w-full aspect-4/3 overflow-hidden" style={{ background: getGradient(item.videoKey) }}>
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300
                ${hovered ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : (
            /* placeholder shimmer dots */
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-(--bg-white)/20"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleRemove}
            className="absolute top-2.5 right-2.5 z-10 w-7 h-7 flex items-center justify-center
              rounded-md bg-black/60 border border-white/10 text-(--text-muted)
              opacity-0 group-hover:opacity-100 transition-all duration-150
              hover:bg-red-400/80 hover:text-(--text-primary) cursor-pointer"
          >
            <RiCloseLine size={15} />
          </button>
        </div>

        {/* Info */}
        <div className="px-3.5 py-3">
          <p className="text-sm font-medium text-(--text-primary) truncate mb-2">{item.name}</p>
          <p className="text-xs text-(--text-muted) mt-0.5">{item.category}</p>
        </div>
      </div>
    </Link>
  );
};

// ── FavoritesPage 
const Favorites = () => {
  const [savedKeys, setSavedKeys] = useState(getSaved);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Components');

  // Sync with localStorage (FavoriteButton dispatches 'favorites:updated')
  useEffect(() => {
    const sync = () => setSavedKeys(getSaved());
    window.addEventListener('favorites:updated', sync);
    return () => window.removeEventListener('favorites:updated', sync);
  }, []);

  const handleRemove = key => {
    const next = savedKeys.filter(k => k !== key);
    localStorage.setItem('savedComponents', JSON.stringify(next));
    window.dispatchEvent(new Event('favorites:updated'));
    setSavedKeys(next);
  };

  // Build item list from saved keys
  const allItems = savedKeys.map(k => COMPONENT_MAP[k]).filter(Boolean);

  // Filter
  const filtered = allItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All Components' || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 text-(--text-primary)  flex flex-col">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <h1 className="title-two">Favorites</h1>

        <div className="flex items-center gap-3 ml-auto">
          {/* Search */}
          <InputGroup startElement={<RiSearchLine size={14} className="text-(--text-muted)" />} className="w-48">
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              startElement={true}
            />
          </InputGroup>

          {/* Category dropdown */}
          <CategoryDropdown value={categoryFilter} onChange={setCategoryFilter} options={ALL_CATEGORIES} />
        </div>
      </div>

      {/* Grid or Empty */}
      {allItems.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-24 gap-2">
          <p className="text-(--text-primary)">No results for"{search}"</p>
          <p className="text-sm text-(--text-muted)">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <VideoCard key={item.videoKey} item={item} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
