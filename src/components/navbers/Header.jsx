import { useState, useMemo, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router';
import { FaGithub } from 'react-icons/fa';
import { RiSearchLine, RiUser3Line, RiHeartLine } from 'react-icons/ri';

import Logo from '../../assets/logos/logo.png';
import DarkLogo from '../../assets/logos/dark-logo.png';

import { GITHUB_URL } from '../../constants/site';
import { useStars } from '../../hooks/useStarts';
import { useTheme } from '../../hooks/useTheme';


// Constants 
const PREFS_CLOSE_DELAY = 150;

// Categories that belong under the "Docs" nav item
const DOCS_CATEGORIES = ['get-started'];

// Categories that belong under the "Components" nav item
const COMPONENTS_CATEGORIES = [
  'text-animations',
  'animations',
  'components',
  'backgrounds',
];

const NAV_LINKS = [
  {
    label: 'Docs',
    to: '/get-started/introduction',
    isActive: (path) => {
      const category = path.split('/')[1];
      return DOCS_CATEGORIES.includes(category);
    },
  },
  {
    label: 'Components',
    to: '/components/animated-list',
    isActive: (path) => {
      const category = path.split('/')[1];
      return COMPONENTS_CATEGORIES.includes(category);
    },
  },
  {
    label: 'Blocks',
    to: '/blocks',
    isActive: (path) => path.startsWith('/blocks'),
  },
  {
    label: 'Tools',
    to: '/tools',
    isActive: (path) => path.startsWith('/tools'),
  },
];

// ─── SearchButton 
const SearchButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="
      flex items-center gap-3
      h-10
      rounded-md
      bg-(--bg)
      border border-(--border-secondary)
      hover:border-(--bg-white)/15
      transition-colors
      cursor-pointer
      w-9 px-2 justify-center
      lg:w-64 lg:px-4 lg:justify-start
    "
  >
    <RiSearchLine size={18} className="text-(--text-primary) shrink-0" />
    <span className="hidden lg:block flex-1 text-left text-sm text-(--text-muted)">
      Search documentation...
    </span>
    <kbd
      className="
        hidden lg:flex items-center justify-center
        min-w-6 h-6 px-1.5
        rounded-md
        border border-(--border-button)
        bg-(--bg-button)
        text-xs text-(--text-primary)
      "
    >
      /
    </kbd>
  </button>
);

// Preferences dropdown
const PreferencesMenu = ({ isOpen }) => (
  <div
    className="absolute top-full right-0 pt-2 z-1000 transition-all duration-200"
    style={{
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
    }}
  >
    <div className="bg-(--bg-card) border border-(--border-secondary) rounded-2xl p-3 min-w-45">
      <p className="text-[12px] font-semibold text-(--text-muted) mb-1 px-1">Preferences</p>
      <div className="flex flex-col gap-1">
        <div className="h-px bg-(--border-secondary) my-1" />
        <Link
          to="/favorites"
          className="flex items-center gap-2 p-2 rounded-xl hover:bg-(--bg-elevated) transition-colors duration-150 no-underline"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-(--accent)">
            <RiHeartLine size={12} className="text-(--text-muted)" />
          </span>
          <span className="text-[13px] text-(--text-muted)">Favorites</span>
        </Link>
      </div>
    </div>
  </div>
);

// Main Header
const Header = () => {
  const location               = useLocation();
  const stars                  = useStars();
  const { theme, toggleTheme } = useTheme();
  const isDark                 = theme === 'dark';

  const [prefsOpen, setPrefsOpen] = useState(false);
  const prefsTimeout = useRef(null);

  const formattedStars = useMemo(
    () => (stars >= 1000 ? `${(stars / 1000).toFixed(1).replace(/\.0$/, '')}k` : stars),
    [stars]
  );

  const handlePrefsEnter = useCallback(() => {
    clearTimeout(prefsTimeout.current);
    setPrefsOpen(true);
  }, []);

  const handlePrefsLeave = useCallback(() => {
    prefsTimeout.current = setTimeout(() => setPrefsOpen(false), PREFS_CLOSE_DELAY);
  }, []);

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 w-full bg-(--bg) border-b border-(--border-secondary)/60 backdrop-blur-sm">
      <div className="header-container flex items-center gap-4 h-14.25 px-4 w-full">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 flex items-center justify-center hover:rotate-50 transition-transform duration-300">
            <img src={isDark ? Logo : DarkLogo} alt="Logo" />
          </div>
          <span className="tracking-wide text-[15px] text-(--text-primary)">React Bytes</span>
        </Link>

        {/* Divider */}
        <span className="text-(--text-muted) px-1">|</span>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ label, to, isActive }) => (
            <Link
              key={label}
              to={to}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors duration-150 no-underline
                text-(--text-primary)
                ${isActive(location.pathname) ? 'bg-(--bg-hover)' : 'hover:bg-(--bg-hover)'}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">

          <SearchButton />

          {/* Preferences */}
          <div
            className="relative"
            onMouseEnter={handlePrefsEnter}
            onMouseLeave={handlePrefsLeave}
          >
            <button
              className="flex items-center justify-center w-9 h-9 rounded-md
                bg-(--bg) border border-(--border-secondary) hover:bg-(--bg-hover)
                transition-colors duration-150 cursor-pointer"
            >
              <RiUser3Line size={16} className="text-(--text-primary)" />
            </button>
            <PreferencesMenu isOpen={prefsOpen} />
          </div>

          {/* GitHub */}
          <Link
            to={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 h-9 rounded-md
              bg-(--bg) border border-(--border-secondary) hover:bg-(--bg-hover)
              transition-colors duration-150 no-underline"
          >
            <FaGithub size={17} className="text-(--text-primary)" />
            <span className="text-xs text-(--text-muted)">{formattedStars}</span>
          </Link>

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

        </div>
      </div>
    </header>
  );
};

export default Header;
