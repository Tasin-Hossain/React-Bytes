import { useRef, useState, useCallback, memo, forwardRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

// React Icons
import {
  RiHeartFill,
  RiArrowDownSLine,
  RiArrowRightUpLine,
  RiArrowLeftSLine,
  RiBookOpenLine,
  RiDownload2Line,
  RiPlugLine,
  RiApps2Line,
  RiFolderLine,
  RiListUnordered,
  RiGridLine
} from 'react-icons/ri';

import { CATEGORIES, DEFAULT_CATEGORY_ICON } from '../../constants/Categories';
import { TOOLS } from '../../constants/Tools';
import { COMPONENT_VIDEOS } from '../../constants/ComponentVideos';

// Helpers
const scrollToTop = () => window.scrollTo(0, 0);
const slug = str => str.replace(/\s+/g, '-').toLowerCase();

const getSavedComponents = () => {
  try {
    return JSON.parse(localStorage.getItem('savedComponents') || '[]');
  } catch {
    return [];
  }
};

// Icons for the "Get Started" flat doc links
const GET_STARTED_ICONS = {
  Introduction: RiBookOpenLine,
  Installation: RiDownload2Line,
  MCP: RiPlugLine,
  'All Components': RiApps2Line
};

// Custom Hooks
const useFavoritesSync = () => {
  const [savedSet, setSavedSet] = useState(() => new Set(getSavedComponents()));

  useEffect(() => {
    const update = () => setSavedSet(new Set(getSavedComponents()));
    const onStorage = e => {
      if (!e || e.key === 'savedComponents') update();
    };
    window.addEventListener('favorites:updated', update);
    window.addEventListener('storage', onStorage);
    update();
    return () => {
      window.removeEventListener('favorites:updated', update);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return savedSet;
};

const useScrolledToBottom = ref => {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    };
    el.addEventListener('scroll', handler);
    handler();
    return () => el.removeEventListener('scroll', handler);
  }, [ref]);

  return atBottom;
};

// ToolsLinks
const ToolsLinks = ({ onClose, location }) => {
  if (!TOOLS.length) return null;
  return (
    <>
      <p className="w-full pl-6 text-(--brand) pr-3 py-2 text-left">Tools</p>
      <div className="flex flex-col gap-0.5 pb-5 pl-3 ">
        {TOOLS.map(tool => (
          <Link
            key={tool.id}
            to={tool.comingSoon ? '/tools' : tool.path}
            onClick={onClose}
            style={{ opacity: tool.comingSoon ? 0.75 : 1 }}
          >
            <div
              className={`w-full flex items-center cursor-pointer gap-2 px-6 py-2 text-[13px] transition-all duration-150 text-left
                ${location?.pathname === tool.path ? 'text-(--brand)' : 'text-(--text-primary) hover:text-(--brand) hover:translate-x-1'}`}
            >
              <div className='w-full flex items-center justify-between'>
                <div className="flex gap-1 items-center justify-center">
                  {tool.icon && <tool.icon className="text-(--brand) " size={16} />}
                  <span className="truncate">{tool.label}</span>
                </div>
                {tool.comingSoon && (
                  <span className="shrink-0 text-[10px] font-bold px-1.5 py-px rounded-md bg-(--bg-button) text-(--text-muted) border border-(--border-button)">
                    Soon
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

// UsefulLinks
const UsefulLinks = ({ onClose }) => (
  <>
    <hr className="my-3 border-(--border-secondary)" />
    <p className="text-[11px] font-semibold tracking-widest uppercase text-(--text-muted) mb-2 px-3">Useful Links</p>
    <div className="flex flex-col gap-0.5">
      {[
        { to: 'https://github.com/', label: 'GitHub', external: true },
        { to: '/showcase', label: 'Showcase' }
      ].map(({ to, label, external }) => (
        <Link key={to} to={to} target={external ? '_blank' : undefined} onClick={onClose}>
          <div className="flex items-center gap-1 px-3 py-2 rounded-md text-[13px] text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-hover) transition-all duration-150">
            <span>{label}</span>
            <RiArrowRightUpLine size={14} />
          </div>
        </Link>
      ))}
    </div>
  </>
);

// FavoritesSection
const FavoritesSection = ({ savedSet, onClose, location }) => {
  const [open, setOpen] = useState(true);
  const count = savedSet?.size ?? 0;

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left"
      >
        <span className="text-[13px] font-semibold text-(--text-muted)">
          Favorites
          {count > 0 && (
            <span className="ml-2 text-[10px] font-bold px-1.5 py-px rounded-full bg-(--bg-hover) text-(--text-muted)">
              {count}
            </span>
          )}
        </span>
        <RiArrowDownSLine
          size={16}
          className={`text-(--text-muted) transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? '60px' : '0px' }}>
        <div className="flex flex-col gap-0.5 pb-1 px-1">
          <Link
            to="/favorites"
            onClick={onClose}
            className={`flex items-center gap-2 px-6 py-2 rounded-md text-[13px] transition-all duration-150
              ${
                location?.pathname === '/favorites'
                  ? 'text-(--text-primary) bg-(--bg-hover) font-medium'
                  : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-hover)'
              }`}
          >
            <RiHeartFill size={12} className="text-(--brand) shrink-0" />
            <span>View All Favorites</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// GetStartedLinks — flat, individual doc links (no accordion, no counts)
const GetStartedLinks = memo(({ category, onClose, location, onNavigation }) => (
  <div className="flex flex-col gap-0.5 pb-2">
    {category.subcategories.map(sub => {
      const path = `/${slug(category.name)}/${slug(sub)}`;
      const isActive = location.pathname === path;
      const Icon = GET_STARTED_ICONS[sub] || RiFolderLine;
      return (
        <button
          key={path}
          onClick={() => {
            onNavigation(path);
            onClose?.();
          }}
          className={`w-full flex items-center cursor-pointer gap-2 pl-6 pr-3 py-2 text-[13px] transition-all duration-150 text-left
            ${isActive ? 'text-(--brand) font-medium' : 'text-(--text-primary) hover:text-(--brand) hover:translate-x-1'}`}
        >
          <Icon size={15} className={isActive ? 'text-(--brand) shrink-0' : 'text-(--text-muted) shrink-0'} />
          <span className="truncate">{sub}</span>
        </button>
      );
    })}
  </div>
));
GetStartedLinks.displayName = 'GetStartedLinks';

// SubcategoryThumb — mini video-preview card used in the sidebar's "Grid" view.
// Video plays on hover, pauses (and resets) on mouse-out.
const SubcategoryThumb = forwardRef(({ name, path, videoKey, active, onNavigate, onClose }, ref) => {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const videoSrc = COMPONENT_VIDEOS[videoKey];

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

  return (
    <button
      ref={ref}
      onClick={() => {
        onNavigate(path);
        onClose?.();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-full text-left cursor-pointer rounded-lg overflow-hidden border transition-colors duration-150
        ${active ? 'border-(--brand)/20' : 'border-(--border-secondary) hover:border-(--bg-white)/15'}`}
    >
      <div className="relative w-full bg-(--bg) overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            loop
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={e => {
              e.target.currentTime = 0.1;
            }}
            className="absolute inset-0 w-full! h-full! object-cover"
            style={{ pointerEvents: 'none' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-2">
            <span className="text-[11px] text-(--text-muted) text-center leading-tight">{name}</span>
          </div>
        )}
      </div>
      <p className={`px-2 py-1.5 text-[12px] font-semibold truncate ${active ? 'text-(--brand)' : 'text-(--text-primary)'}`}>
        {name}
      </p>
    </button>
  );
});
SubcategoryThumb.displayName = 'SubcategoryThumb';

// ViewToggle — the "List / Grid" pill switch shown above a category's
// subcategory list.
const ViewToggle = ({ mode, onChange }) => (
  <div className="flex items-center gap-0.5 mx-3 mb-3 p-0.5 rounded-lg bg-(--bg-hover)">
    {[
      { key: 'list', label: 'List', Icon: RiListUnordered },
      { key: 'grid', label: 'Grid', Icon: RiGridLine }
    ].map(({ key, label, Icon }) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[12px] font-medium cursor-pointer transition-colors duration-150
          ${mode === key ? 'bg-(--bg-card) text-(--text-primary)' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
      >
        <Icon size={13} />
        {label}
      </button>
    ))}
  </div>
);

// CategoryFocusView — replaces the ENTIRE sidebar body while the user is
// inside a category (on one of its demo pages). Shows only: a back button
// (returns to the category's grid page), the List/Grid toggle, and that
// category's subcategories. Everything else (Get Started, Tools, other
// categories, Favorites, Useful Links) is hidden until the user backs out.
const CategoryFocusView = ({ category, location, onNavigation, onClose }) => {
  const path = `/${slug(category.name)}`;
  const [viewMode, setViewMode] = useState('list');
  const activeItemRef = useRef(null);

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [location.pathname, viewMode]);

  return (
    <div>
      <button
        onClick={() => {
          onNavigation(path);
          onClose?.();
        }}
        className="w-full flex items-center gap-1.5 px-3 py-3 text-left cursor-pointer group"
      >
        <RiArrowLeftSLine
          size={20}
          className="text-(--text-muted) group-hover:text-(--text-primary) transition-colors duration-150 shrink-0"
        />
        <span className="text-[13px] font-bold uppercase tracking-wide text-(--text-primary) truncate">
          {category.name}
        </span>
      </button>

      <hr className="border-(--border-secondary) mb-3" />

      <ViewToggle mode={viewMode} onChange={setViewMode} />

      {viewMode === 'list' ? (
        <div className="flex flex-col gap-0.5 pb-4">
          {category.subcategories.map(sub => {
            const subPath = `${path}/${slug(sub)}`;
            const subActive = location.pathname === subPath;
            return (
              <button
                key={subPath}
                ref={subActive ? activeItemRef : null}
                onClick={() => {
                  onNavigation(subPath);
                  onClose?.();
                }}
                className={`w-full flex items-center gap-2 pl-6 pr-3 py-2 text-[13px] cursor-pointer transition-all duration-150 text-left
                  ${subActive ? 'text-(--brand) font-medium' : 'text-(--text-muted) hover:text-(--brand) hover:translate-x-1'}`}
              >
                <span className="truncate">{sub}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-3 pb-4">
          {category.subcategories.map(sub => {
            const subPath = `${path}/${slug(sub)}`;
            const subActive = location.pathname === subPath;
            return (
              <SubcategoryThumb
                key={subPath}
                ref={subActive ? activeItemRef : null}
                name={sub}
                path={subPath}
                videoKey={`${slug(category.name)}/${slug(sub)}`}
                active={subActive}
                onNavigate={onNavigation}
                onClose={onClose}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// CategoryRow — flat row for a whole category. Clicking it navigates to the
// category's grid page (/category-slug), which shows all of that category's
// components as hover-to-preview cards.
const CategoryRow = memo(({ category, onClose, location, onNavigation }) => {
  const path = `/${slug(category.name)}`;
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);
  const Icon = category.icon || DEFAULT_CATEGORY_ICON;

  return (
    <button
      onClick={() => {
        onNavigation(path);
        onClose?.();
      }}
      className={`w-full flex items-center justify-between gap-2 pl-6 pr-3 py-2 text-[13px] cursor-pointer transition-all duration-150 text-left
        ${isActive ? 'text-(--brand) font-medium' : 'text-(--text-primary) hover:text-(--brand) hover:translate-x-1'}`}
    >
      <span className="flex items-center gap-2 min-w-0">
        <Icon size={15} className={isActive ? 'text-(--brand) shrink-0' : 'text-(--text-muted) shrink-0'} />
        <span className="truncate">{category.name}</span>
      </span>
      <span className="shrink-0 text-[11px] text-(--text-muted)">{category.subcategories.length}</span>
    </button>
  );
});
CategoryRow.displayName = 'CategoryRow';

// MainDrawer — slides in from LEFT
const MainDrawer = ({ isOpen, onClose, location, onNavigation, savedSet, activeCategory }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getStarted = CATEGORIES.find(c => c.name === 'Get Started');
  const otherCategories = CATEGORIES.filter(c => c.name !== 'Get Started');

  return (
    <>
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-(--bg) border-r border-(--border-secondary)
          transition-transform duration-300 ease-in-out flex flex-col"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-(--border-secondary) shrink-0">
          <span className="text-[15px] font-semibold text-(--text-primary)">Menu</span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-(--bg-hover) transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto sidebar-scroll">
          {activeCategory ? (
            <CategoryFocusView
              category={activeCategory}
              location={location}
              onNavigation={onNavigation}
              onClose={onClose}
            />
          ) : (
            <>
              <FavoritesSection savedSet={savedSet} onClose={onClose} location={location} />

              <div className="mt-1">
                {getStarted && (
                  <GetStartedLinks
                    category={getStarted}
                    onClose={onClose}
                    location={location}
                    onNavigation={onNavigation}
                  />
                )}

                <ToolsLinks onClose={onClose} location={location} />

                <p className="w-full pl-6 pr-3 py-2 text-left text-[11px] font-semibold tracking-widest uppercase text-(--text-muted)">
                  Categories
                </p>
                <div className="flex flex-col gap-0.5 pb-5">
                  {otherCategories.map(cat => (
                    <CategoryRow
                      key={cat.name}
                      category={cat}
                      onClose={onClose}
                      location={location}
                      onNavigation={onNavigation}
                    />
                  ))}
                </div>
              </div>

              <UsefulLinks onClose={onClose} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Main Sidebar
const Sidebar = ({ isDrawerOpen, onDrawerClose }) => {
  const containerRef = useRef(null);
  const hoverTimeout = useRef(null);
  const hoverDelayTimer = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const savedSet = useFavoritesSync();
  const atBottom = useScrolledToBottom(containerRef);

  useEffect(
    () => () => {
      clearTimeout(hoverTimeout.current);
      clearTimeout(hoverDelayTimer.current);
    },
    []
  );

  const handleNavigate = useCallback(
    path => {
      if (location.pathname === path) return;
      navigate(path);
      scrollToTop();
    },
    [location.pathname, navigate]
  );

  const getStarted = CATEGORIES.find(c => c.name === 'Get Started');
  const otherCategories = CATEGORIES.filter(c => c.name !== 'Get Started');

  // While the user is on a demo page inside a category (e.g.
  // /text-animations/blur-text), the whole sidebar collapses down to just
  // that category's back button + subcategory list.
  const activeCategory = otherCategories.find(cat => location.pathname.startsWith(`/${slug(cat.name)}/`));

  return (
    <>
      {/* Mobile drawer */}
      <MainDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        location={location}
        onNavigation={handleNavigate}
        savedSet={savedSet}
        activeCategory={activeCategory}
      />

      {/* Desktop sidebar — flat list, no accordion, no search box */}
      <nav
        ref={containerRef}
        className="hidden md:block fixed top-14.25 left-0 h-[calc(100vh-57px)] w-62 overflow-y-auto bg-(--bg) sidebar-scroll"
        style={{
          maskImage: atBottom ? 'none' : 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: atBottom ? 'none' : 'linear-gradient(to bottom, black 85%, transparent 100%)'
        }}
      >
        <div className="py-4">
          {activeCategory ? (
            <CategoryFocusView
              category={activeCategory}
              location={location}
              onNavigation={handleNavigate}
              onClose={null}
            />
          ) : (
            <div className="mt-1">
              {getStarted && (
                <GetStartedLinks
                  category={getStarted}
                  onClose={null}
                  location={location}
                  onNavigation={handleNavigate}
                />
              )}

              <ToolsLinks onClose={null} location={location} />

              <p className="w-full pl-6 pr-3 py-2 text-left text-[11px] font-semibold tracking-widest uppercase text-(--text-muted)">
                Categories
              </p>
              <div className="flex flex-col gap-0.5 pb-5">
                {otherCategories.map(cat => (
                  <CategoryRow
                    key={cat.name}
                    category={cat}
                    onClose={null}
                    location={location}
                    onNavigation={handleNavigate}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
