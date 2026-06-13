import { useState, useEffect, useMemo } from 'react';
import Logo from '../../../assets/logos/logo.svg';
import DarkLogo from '../../../assets/logos/dark-logo.png';
import './Header.css';
import { Link } from 'react-router';
import { FaGithub, FaLongArrowAltRight } from 'react-icons/fa';
import { GITHUB_URL } from '../../../constants/site';
import { useStars } from '../../../hooks/useStarts';
import { RiMenu4Line } from 'react-icons/ri';
import { MdOutlineClose } from 'react-icons/md';
import { useTheme } from '../../../hooks/useTheme';

const NAV_LINKS = [
  { label: 'Docs', to: '/get-started/introduction' },
  { label: 'Components', to: '/text-animations/magnetic-text' },
  { label: 'Blocks', to: '/blocks/header' },
  { label: 'Tools', to: '/tools' }
];

const Header = () => {
  const stars = useStars();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [activeLink, setActiveLink] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const formattedStars = useMemo(
    () => (stars >= 1000 ? `${(stars / 1000).toFixed(1).replace(/\.0$/, '')}k` : stars),
    [stars]
  );

  return (
    <header className=" sticky top-0 z-50 w-full bg-(--bg) border-b border-(--border-secondary)">
      <div className="app-container flex items-center gap-4 py-4 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 flex items-center justify-center hover:rotate-50 transition-all">
            <img src={isDark ? Logo : DarkLogo} alt="Logo" />
          </div>
          <span className="tracking-wide text-[15px]">React Bytes</span>
        </Link>

        {/* Devider */}
        <span className="hidden md:flex text-bold px-2">|</span>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setActiveLink(label)}
              className={`
                px-3 py-1.5 rounded-md text-sm transition-all duration-150
                ${activeLink === label ? ' bg-(--bg-hover)' : 'hover:bg-(--bg-hover) '}
              `}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* GitHub */}
          <Link
            to={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-2.5 h-8 rounded-md  transition-all duration-150 hover:bg-(--bg-hover) "
          >
            <FaGithub size={18} />
            <span className="text-xs text-(--text-muted)">{formattedStars}</span>
          </Link>

          {/* theme */}
          <button className="hidden md:flex btn-none" onClick={toggleTheme} aria-label="Toggle theme">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4.5"
            >
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
              <path d="M12 3l0 18"></path>
              <path d="M12 9l4.65 -4.65"></path>
              <path d="M12 14.3l7.37 -7.37"></path>
              <path d="M12 19.6l8.85 -8.85"></path>
            </svg>

            {/* Theme icon */}
          </button>

          {/* Community button */}
          {/* <button
            type="button"
            className="relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-md border-none bg-[linear-gradient(0deg,#7a5af8,#7a5af8),radial-gradient(65.28%_65.28%_at_50%_100%,rgba(223,113,255,0.8)_0%,rgba(223,113,255,0)_100%)] px-3 py-1.5 outline-none transition-all duration-300 active:scale-95 group button-custom"
          >
            <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <i key={i} className={`point point-${i + 1}`}></i>
              ))}
            </div>
            <span className="relative z-2 flex items-center justify-center gap-1.5 text-white ">Community</span>
          </button> */}

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2">
            {/* theme */}
            <button className="md:hidden btn-none" onClick={toggleTheme} aria-label="Toggle theme">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4.5"
              >
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                <path d="M12 3l0 18"></path>
                <path d="M12 9l4.65 -4.65"></path>
                <path d="M12 14.3l7.37 -7.37"></path>
                <path d="M12 19.6l8.85 -8.85"></path>
              </svg>

              {/* Theme icon */}
            </button>
            {/* menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-8 h-8 rounded-md border border-(--border-primary) flex items-center justify-center  text-(--text-primary) hover:text-(--text-muted) transition-colors duration-150 cursor-pointer"
            >
              {menuOpen ? <MdOutlineClose size={20} /> : <RiMenu4Line size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — full width, no app-container so it bleeds edge to edge */}
      <div className={`mobile-menu md:hidden ${menuOpen ? 'open' : 'closed'}`}>
        <div className="app-container px-4 pb-4 py-2 border-t border-(--border-secondary) flex flex-col gap-1 ">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={() => {
                setActiveLink(label);
                setMenuOpen(false);
              }}
              className={`
      group px-3 py-2.5 rounded-md text-sm transition-colors duration-150 text-(--text-primary)
      flex items-center justify-between
      ${activeLink === label ? ' bg-(--bg-elevated)' : ' hover:bg-(--bg-elevated)'}
    `}
            >
              <span>{label}</span>
              <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out text-(--text-primary)">
                <FaLongArrowAltRight />
              </span>
            </Link>
          ))}

          <Link to={GITHUB_URL} target="_blank" className="mt-2 flex items-center gap-2 px-3 h-9 btn">
            <FaGithub size={18} />
            <span className="tracking-wider text-(--text-primary)">GITHUB</span>
            <span className="text-xs text-(--text-muted)">{formattedStars}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
