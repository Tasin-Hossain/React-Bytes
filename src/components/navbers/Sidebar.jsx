import { useRef, useState, useLayoutEffect, useCallback, useMemo, memo, useEffect, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

// React Icons
import { RiSearchLine, RiMenuLine, RiArrowRightUpLine, RiHeartFill } from 'react-icons/ri';

import { CATEGORIES, NEW, UPDATED } from '../../constants/Categories';

import Logo from '../../assets/logos/logo.png';
import DarkLogo from '../../assets/logos/dark-logo.png';
import { useTheme } from '../../hooks/useTheme';

//  Constants
const SCROLL_OFFSET = 100;

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

//  Tools config
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

//  ActiveLine / HoverLine
const lineBase =
  'absolute left-0 w-[2.5px] h-5 rounded-full pointer-events-none transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]';

const ActiveLine = ({ position, isVisible }) => (
  <div
    className={`${lineBase} bg-[linear-gradient(45deg,var(--brand),var(--brand-2))] z-20`}
    style={{
      transform: isVisible && position !== null ? `translateY(${position - 8}px)` : 'translateY(-100px)',
      opacity: isVisible ? 1 : 0
    }}
  />
);

const HoverLine = ({ position, isVisible }) => (
  <div
    className={`${lineBase} bg-(--bg-white)/90 z-10`}
    style={{
      transform: position !== null ? `translateY(${position - 8}px)` : 'translateY(-100px)',
      opacity: isVisible ? 1 : 0
    }}
  />
);

// ─── MobileHeader — design matches desktop Header ─────────────────────────────
const MobileHeader = ({ onSearchClick, onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="md:hidden fixed top-0 left-0 z-50 w-full h-14.25 bg-(--bg) border-b border-(--border-secondary)/60 backdrop-blur-sm px-4">
      <div className="flex items-center justify-between h-full gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 flex items-center justify-center hover:rotate-50 transition-transform duration-300">
            <img src={isDark ? Logo : DarkLogo} alt="Logo" />
          </div>
          <span className="tracking-wide text-[15px] text-(--text-primary)">React Bytes</span>
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Search icon */}
          <button
            onClick={onSearchClick}
            aria-label="Search"
            className="flex items-center justify-center w-9 h-9 rounded-md
              bg-(--bg) border border-(--border-secondary) hover:bg-(--bg-hover)
              transition-colors duration-150 cursor-pointer"
          >
            <RiSearchLine size={16} className="text-(--text-primary)" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-md
              bg-(--bg) border border-(--border-secondary) hover:bg-(--bg-hover)
              transition-colors duration-150 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="size-4 text-(--text-primary)"
            >
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 3l0 18" />
              <path d="M12 9l4.65 -4.65" />
              <path d="M12 14.3l7.37 -7.37" />
              <path d="M12 19.6l8.85 -8.85" />
            </svg>
          </button>

          {/* Hamburger */}
          <button
            onClick={onMenuClick}
            aria-label="Open Menu"
            className="flex items-center justify-center w-9 h-9 rounded-md
              bg-(--bg) border border-(--border-secondary) hover:bg-(--bg-hover)
              transition-colors duration-150 cursor-pointer"
          >
            <RiMenuLine size={16} className="text-(--text-primary)" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── ToolsLinks ───────────────────────────────────────────────────────────────
const ToolsLinks = ({ onClose, location }) => {
  if (!TOOLS.length) return null;
  return (
    <>
      <hr className="my-4 border-white/10" />
      <p className="text-[11px] font-semibold tracking-widest uppercase text-[#a6a6a6] mb-3">Tools</p>
      <div className="flex flex-col gap-1">
        {TOOLS.map(tool => (
          <Link
            key={tool.id}
            to={tool.comingSoon ? '#' : tool.path}
            onClick={tool.comingSoon ? e => e.preventDefault() : onClose}
            style={{ opacity: tool.comingSoon ? 0.4 : 1, cursor: tool.comingSoon ? 'not-allowed' : 'pointer' }}
          >
            <div
              className={`flex items-center gap-1.5 px-2 py-1.25 rounded-md text-[13px] transition-all duration-150
                ${location?.pathname === tool.path ? 'text-white bg-white/5' : 'text-[#8a8a9a] hover:text-white hover:bg-white/5'}`}
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

//  UsefulLinks
const UsefulLinks = ({ onClose }) => (
  <>
    <hr className="my-4 border-white/10" />
    <p className="text-[11px] font-semibold tracking-widest uppercase text-[#a6a6a6] mb-3">Useful Links</p>
    <div className="flex flex-col gap-1">
      {[
        { to: 'https://github.com/', label: 'GitHub', external: true },
        { to: '/showcase', label: 'Showcase' }
      ].map(({ to, label, external }) => (
        <Link key={to} to={to} target={external ? '_blank' : undefined} onClick={onClose}>
          <div className="flex items-center gap-1 px-2 py-1.25 rounded-md text-[13px] text-[#8a8a9a] hover:text-white hover:bg-white/5 transition-all duration-150">
            <span>{label}</span>
            <RiArrowRightUpLine size={14} />
          </div>
        </Link>
      ))}
    </div>
  </>
);

//  Category
const Category = memo(
  ({
    category,
    handleTransitionNavigation,
    location,
    pendingActivePath,
    onItemMouseEnter,
    onItemMouseLeave,
    itemRefs,
    isFirstCategory,
    savedSet
  }) => {
    const items = useMemo(
      () =>
        category.subcategories.map(sub => {
          const path = `/${slug(category.name)}/${slug(sub)}`;
          const activePath = pendingActivePath || location.pathname;
          const favKey = `${slug(category.name)}/${slug(sub)}`;
          return {
            sub,
            path,
            isActive: activePath === path,
            isNew: NEW.includes(sub),
            isUpdated: UPDATED.includes(sub),
            isFavorited: savedSet?.has?.(favKey)
          };
        }),
      [category, location.pathname, pendingActivePath, savedSet]
    );

    return (
      <div>
        <p
          className={`text-[11px] font-semibold tracking-wider uppercase text-(--text-primary)/90 mb-1.5 select-none
          ${isFirstCategory ? '' : 'mt-4'}`}
        >
          {category.name}
        </p>

        <div className="pl-3 border-l-2 border-(--border-primary) relative flex flex-col gap-0">
          {items.map(({ sub, path, isActive, isNew, isUpdated, isFavorited }) => (
            <Link
              key={path}
              ref={el => itemRefs.current && (itemRefs.current[path] = el)}
              to={path}
              onClick={e => {
                e.preventDefault();
                handleTransitionNavigation?.(path, sub);
              }}
              onMouseEnter={e => onItemMouseEnter(path, e)}
              onMouseLeave={onItemMouseLeave}
            >
              <div
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] select-none
                  transition-all duration-150 whitespace-nowrap min-w-0
                  ${
                    isActive
                      ? 'bg-[linear-gradient(45deg,var(--brand),var(--brand-2))] bg-clip-text text-transparent'
                      : 'text-(--text-muted) hover:text-(--brand) hover:translate-x-2'
                  }`}
              >
                <span className="truncate">{sub}</span>

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
                {isFavorited && <RiHeartFill className="shrink-0 text-(--brand)" size={14} />}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
);
Category.displayName = 'Category';

//  MainDrawer — slides in from top below MobileHeader
const MainDrawer = ({ isOpen, onClose, location, pendingActivePath, onNavigation, savedSet }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer — slides down from below the MobileHeader */}
      <div
        className="md:hidden fixed left-0 right-0 z-50 bg-(--bg) border-b border-(--border-secondary)
          transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          top: '57px',
          maxHeight: isOpen ? '100vh' : '0',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="overflow-y-auto max-h-[calc(100vh-57px)] pb-10 px-2.5">
          <div className="flex flex-col mt-4">
            {CATEGORIES.map((cat, i) => (
              <Fragment key={cat.name}>
                <Category
                  category={cat}
                  location={location}
                  pendingActivePath={pendingActivePath}
                  handleTransitionNavigation={(path, sub) => {
                    onNavigation(path, sub);
                    onClose();
                  }}
                  onItemMouseEnter={() => {}}
                  onItemMouseLeave={() => {}}
                  itemRefs={{ current: {} }}
                  isFirstCategory={i === 0}
                  savedSet={savedSet}
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

// ─── Main Sidebar
const Sidebar = ({ onSearchOpen }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [linePosition, setLinePosition] = useState(null);
  const [isLineVisible, setIsLineVisible] = useState(false);
  const [hoverLinePosition, setHoverLinePosition] = useState(null);
  const [isHoverLineVisible, setIsHoverLineVisible] = useState(false);
  const [pendingActivePath, setPendingActivePath] = useState(null);

  const sidebarRef = useRef(null);
  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const hoverTimeout = useRef(null);
  const hoverDelayTimer = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const savedSet = useFavoritesSync();
  const atBottom = useScrolledToBottom(containerRef);

  const findActiveEl = useCallback(() => {
    const activePath = pendingActivePath || location.pathname;
    for (const cat of CATEGORIES) {
      const match = cat.subcategories.find(sub => activePath === `/${slug(cat.name)}/${slug(sub)}`);
      if (match) return itemRefs.current[`/${slug(cat.name)}/${slug(match)}`];
    }
    return null;
  }, [location.pathname, pendingActivePath]);

  const getLineY = useCallback(el => {
    if (!el || !sidebarRef.current?.offsetParent) return null;
    const sbRect = sidebarRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return elRect.top - sbRect.top + elRect.height / 2;
  }, []);

  const scrollActiveIntoView = useCallback(() => {
    const el = findActiveEl();
    if (!el || !containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const outOfView = eRect.top < cRect.top + SCROLL_OFFSET || eRect.bottom > cRect.bottom - SCROLL_OFFSET;
    if (outOfView) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollTop + (eRect.top - cRect.top) - SCROLL_OFFSET,
        behavior: 'smooth'
      });
    }
  }, [findActiveEl]);

  useLayoutEffect(() => {
    const el = findActiveEl();
    if (!el) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLineVisible(false);
      return;
    }
    const pos = getLineY(el);
    setLinePosition(pos);
    setIsLineVisible(pos !== null);
  }, [findActiveEl, getLineY]);

  useEffect(() => {
    const t = setTimeout(scrollActiveIntoView, 100);
    return () => clearTimeout(t);
  }, [location.pathname, scrollActiveIntoView]);

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

  const onItemEnter = useCallback(
    (path, e) => {
      clearTimeout(hoverTimeout.current);
      clearTimeout(hoverDelayTimer.current);
      const pos = getLineY(e.currentTarget);
      if (pos !== null) setHoverLinePosition(pos);
      hoverDelayTimer.current = setTimeout(() => setIsHoverLineVisible(true), 200);
    },
    [getLineY]
  );

  const onItemLeave = useCallback(() => {
    clearTimeout(hoverDelayTimer.current);
    hoverTimeout.current = setTimeout(() => setIsHoverLineVisible(false), 100);
  }, []);

  return (
    <>
      {/* Mobile top bar */}
      <MobileHeader onSearchClick={onSearchOpen} onMenuClick={() => setDrawerOpen(v => !v)} />

      {/* Mobile drawer */}
      <MainDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        location={location}
        pendingActivePath={pendingActivePath}
        onNavigation={handleNavigate}
        savedSet={savedSet}
      />

      {/* Desktop sidebar */}
      <nav
        ref={containerRef}
        className=" hidden md:block fixed top-14.25 left-8 h-[calc(100vh-57px)] w-50 overflow-y-auto py-5 px-2.5 bg-(--bg)"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#2f293a transparent',
          maskImage: atBottom ? 'none' : 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: atBottom ? 'none' : 'linear-gradient(to bottom, black 85%, transparent 100%)'
        }}
      >
        <div ref={sidebarRef} className="relative">
          <ActiveLine position={linePosition} isVisible={isLineVisible} />
          <HoverLine position={hoverLinePosition} isVisible={isHoverLineVisible} />

          <div className="flex flex-col gap-0">
            {CATEGORIES.map((cat, i) => (
              <Fragment key={cat.name}>
                <Category
                  category={cat}
                  location={location}
                  pendingActivePath={pendingActivePath}
                  handleTransitionNavigation={handleNavigate}
                  onItemMouseEnter={onItemEnter}
                  onItemMouseLeave={onItemLeave}
                  itemRefs={itemRefs}
                  isFirstCategory={i === 0}
                  savedSet={savedSet}
                />

                {i === 0 && (
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-[#3d3a50] px-1 mb-1.5 select-none">
                      Tools
                    </p>
                    <div className="pl-3 border-l  flex flex-col gap-0">
                      {TOOLS.map(tool => (
                        <Link
                          key={tool.id}
                          to={tool.comingSoon ? '#' : tool.path}
                          onClick={tool.comingSoon ? e => e.preventDefault() : scrollToTop}
                        >
                          <div
                            className={`flex items-center gap-1.5 px-2 py-1.25 rounded-md text-[13px] transition-all duration-150
                              ${tool.comingSoon ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                              ${
                                location.pathname === tool.path
                                  ? 'text-white bg-white/5'
                                  : 'text-[#8a8a9a] hover:text-white hover:bg-white/5'
                              }`}
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
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
