import { useRef, useState, useCallback, useMemo, memo, useEffect, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

// React Icons
import { RiHeartFill, RiArrowDownSLine, RiArrowRightUpLine } from 'react-icons/ri';

import { CATEGORIES, NEW, UPDATED } from '../../constants/Categories';

// Constants
// const SCROLL_OFFSET = 100;

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

// eslint-disable-next-line react-refresh/only-export-components
export const TOOLS = [];

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
      <hr className="my-3 border-(--border-secondary)" />
      <p className="text-[11px] font-semibold tracking-widest uppercase text-(--text-muted) mb-2 px-3">Tools</p>
      <div className="flex flex-col gap-0.5">
        {TOOLS.map(tool => (
          <Link
            key={tool.id}
            to={tool.comingSoon ? '#' : tool.path}
            onClick={tool.comingSoon ? e => e.preventDefault() : onClose}
            style={{ opacity: tool.comingSoon ? 0.4 : 1, cursor: tool.comingSoon ? 'not-allowed' : 'pointer' }}
          >
            <div
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] transition-all duration-150
                ${location?.pathname === tool.path ? 'text-(--text-primary) bg-(--bg-hover)' : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-hover)'}`}
            >
              {tool.icon && <tool.icon className="text-purple-500" size={14} />}
              <span>{tool.label}</span>
              {tool.comingSoon && (
                <span className="text-[9px] font-bold px-1.5 py-px rounded-[3px] bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  Soon
                </span>
              )}
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

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '60px' : '0px' }}
      >
        <div className="flex flex-col gap-0.5 pb-1 px-1">
          <Link
            to="/favorites"
            onClick={onClose}
            className={`flex items-center gap-2 px-6 py-2 rounded-md text-[13px] transition-all duration-150
              ${location?.pathname === '/favorites'
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

// AccordionCategory — defaultOpen=true means always starts open
const AccordionCategory = memo(({ category, onClose, location, pendingActivePath, onNavigation, savedSet, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen ?? true);

  const items = useMemo(
    () =>
      category.subcategories.map(sub => {
        const path = `/${slug(category.name)}/${slug(sub)}`;
        const activePath = pendingActivePath || location.pathname;
        const favKey = `${slug(category.name)}/${slug(sub)}`;
        return {
          sub, path,
          isActive: activePath === path,
          isNew: NEW.includes(sub),
          isUpdated: UPDATED.includes(sub),
          isFavorited: savedSet?.has?.(favKey)
        };
      }),
    [category, location.pathname, pendingActivePath, savedSet]
  );

  const hasActive = items.some(i => i.isActive);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hasActive) setOpen(true);
  }, [hasActive]);

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left"
      >
        <span className={`text-[13px] font-semibold ${hasActive ? 'text-(--brand)' : 'text-(--text-primary)'}`}>
          {category.name}
        </span>
        <RiArrowDownSLine
          size={16}
          className={`text-(--text-muted) transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? `${items.length * 44}px` : '0px' }}
      >
        <div className="flex flex-col gap-0.5 pb-1 px-2">
          {items.map(({ sub, path, isActive, isNew, isUpdated, isFavorited }) => (
            <button
              key={path}
              onClick={() => { onNavigation?.(path, sub); onClose?.(); }}
              className={`w-full flex items-center cursor-pointer gap-2 px-6 py-2 rounded-md text-[13px] transition-all duration-150 text-left
                ${isActive
                  ? 'bg-(--bg-hover) text-(--brand) font-medium'
                  : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-hover)'
                }`}
            >
              <span className="truncate flex-1">{sub}</span>
              {isFavorited && <RiHeartFill className="shrink-0 text-(--brand)" size={12} />}
              {isNew && (
                <span className="shrink-0 text-[9px] font-bold px-1.5 py-px rounded-md bg-linear-to-r from-purple-500 to-violet-500 text-white">
                  New
                </span>
              )}
              {isUpdated && (
                <span className="shrink-0 text-[10px] font-bold px-1.5 py-px rounded-md bg-(--bg-button) text-(--text-muted) border border-(--border-button)">
                  Updated
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
AccordionCategory.displayName = 'AccordionCategory';

// MainDrawer — slides in from LEFT
const MainDrawer = ({ isOpen, onClose, location, pendingActivePath, onNavigation, savedSet }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto sidebar-scroll">
          <FavoritesSection savedSet={savedSet} onClose={onClose} location={location} />
          <div className="mt-1">
            {CATEGORIES.map((cat, i) => (
              <Fragment key={cat.name}>
                <AccordionCategory
                  category={cat}
                  onClose={onClose}
                  location={location}
                  pendingActivePath={pendingActivePath}
                  onNavigation={onNavigation}
                  savedSet={savedSet}
                  defaultOpen={true}
                />
                {i === 0 && <ToolsLinks onClose={onClose} location={location} />}
              </Fragment>
            ))}
          </div>
          <UsefulLinks onClose={onClose} />
        </div>
      </div>
    </>
  );
};

// Main Sidebar
const Sidebar = ({ isDrawerOpen, onDrawerClose }) => {
  const [pendingActivePath, setPendingActivePath] = useState(null);

  const containerRef = useRef(null);
  const hoverTimeout = useRef(null);
  const hoverDelayTimer = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const savedSet = useFavoritesSync();
  const atBottom = useScrolledToBottom(containerRef);

  useEffect(() => {
    if (pendingActivePath && location.pathname === pendingActivePath) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingActivePath(null);
    }
  }, [location.pathname, pendingActivePath]);

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
      setPendingActivePath(path);
      navigate(path);
      scrollToTop();
    },
    [location.pathname, navigate]
  );

  return (
    <>
      {/* Mobile drawer */}
      <MainDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        location={location}
        pendingActivePath={pendingActivePath}
        onNavigation={handleNavigate}
        savedSet={savedSet}
      />

      {/* Desktop sidebar — same accordion design as mobile */}
      <nav
        ref={containerRef}
        className="hidden md:block fixed top-14.25 left-0 h-[calc(100vh-57px)] w-62 overflow-y-auto bg-(--bg) border-r border-(--border-secondary) sidebar-scroll"
        style={{
          maskImage: atBottom ? 'none' : 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: atBottom ? 'none' : 'linear-gradient(to bottom, black 85%, transparent 100%)'
        }}
      >
        <div className="py-4">
          <FavoritesSection savedSet={savedSet} onClose={null} location={location} />
          <div className="mt-1">
            {CATEGORIES.map((cat, i) => (
              <Fragment key={cat.name}>
                <AccordionCategory
                  category={cat}
                  onClose={null}
                  location={location}
                  pendingActivePath={pendingActivePath}
                  onNavigation={handleNavigate}
                  savedSet={savedSet}
                  defaultOpen={true}
                />
                {i === 0 && <ToolsLinks onClose={null} location={location} />}
              </Fragment>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;