import { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import Logo from '../../../assets/logos/logo.svg';
import DarkLogo from '../../../assets/logos/dark-logo.png';
import './Header.css';
import { Link, useLocation } from 'react-router';
import { FaGithub, FaLongArrowAltRight } from 'react-icons/fa';
import { GITHUB_URL } from '../../../constants/site';
import { useStars } from '../../../hooks/useStarts';
import { RiMenu4Line } from 'react-icons/ri';
import { MdOutlineClose } from 'react-icons/md';
import { useTheme } from '../../../hooks/useTheme';
import CurtainText from '../../../content/TextAnimations/CurtainText';

const NAV_LINKS = [
  { label: 'Docs', to: '/get-started/introduction' },
  { label: 'Components', to: '/text-animations' },
  // { label: 'Blocks', to: '/', comingSoon: true },
  { label: 'Tools', to: '/tools' },
  { label: 'Sponsors', to: '/sponsors' }
];

const formatStars = n => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : Math.round(n));

// Pick the NAV_LINKS entry whose `to` best matches the current pathname.
// Exact match wins; otherwise the longest `to` that the pathname starts with
// (so nested routes like /get-started/foo still highlight "Docs").
const getActiveLinkLabel = pathname => {
  let best = null;
  for (const link of NAV_LINKS) {
    if (pathname === link.to) return link.label;
    if (pathname.startsWith(link.to + '/')) {
      if (!best || link.to.length > best.to.length) best = link;
    }
  }
  return best?.label ?? '';
};

const Header = () => {
  const stars = useStars();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const activeLink = useMemo(() => getActiveLinkLabel(location.pathname), [location.pathname]);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const linkRefs = useRef([]);
  const menuTl = useRef(null);
  const hamburgerRef = useRef(null);
  const starRef = useRef(null);
  const starMobileRef = useRef(null);
  const prevStars = useRef(0);

  // desktop nav sliding hover indicator
  const navContainerRef = useRef(null);
  const navIndicatorRef = useRef(null);
  const navBtnRefs = useRef({});
  const [hoveredLink, setHoveredLink] = useState(null);
  const targetLink = hoveredLink ?? activeLink;

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [location.pathname]);

  // close dropdown when clicking outside of it
  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('[data-mobile-menu-toggle]')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  // init hidden state on mount
  useEffect(() => {
    if (menuRef.current) {
      gsap.set(menuRef.current, { display: 'none', opacity: 0, scale: 0.96, y: -8 });
    }
  }, []);

  // mobile menu open/close animation (dropdown style: fade + scale + slide, no height push)
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const links = linkRefs.current.filter(Boolean);

    if (menuTl.current) menuTl.current.kill();

    if (menuOpen) {
      gsap.set(menu, { display: 'block' });
      gsap.set(links, { opacity: 0, y: -8 });

      menuTl.current = gsap
        .timeline()
        .to(menu, { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: 'power2.out', transformOrigin: 'top right' })
        .to(links, { opacity: 1, y: 0, duration: 0.25, stagger: 0.04, ease: 'power2.out' }, '-=0.1');
    } else {
      menuTl.current = gsap
        .timeline()
        .to(links, { opacity: 0, y: -8, duration: 0.12, stagger: 0.02, ease: 'power1.in' })
        .to(
          menu,
          {
            opacity: 0,
            scale: 0.96,
            y: -8,
            duration: 0.18,
            ease: 'power2.in',
            transformOrigin: 'top right',
            onComplete: () => gsap.set(menu, { display: 'none' })
          },
          '-=0.05'
        );
    }

    return () => {
      if (menuTl.current) menuTl.current.kill();
    };
  }, [menuOpen]);

  // hamburger rotate flip on toggle
  useEffect(() => {
    if (!hamburgerRef.current) return;
    gsap.fromTo(
      hamburgerRef.current,
      { rotate: menuOpen ? -90 : 90, opacity: 0 },
      { rotate: 0, opacity: 1, duration: 0.3, ease: 'back.out(2)' }
    );
  }, [menuOpen]);

  // animated star count-up whenever stars changes
  useEffect(() => {
    if (!stars) return;
    const obj = { val: prevStars.current };
    gsap.to(obj, {
      val: stars,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        const formatted = formatStars(obj.val);
        if (starRef.current) starRef.current.textContent = formatted;
        if (starMobileRef.current) starMobileRef.current.textContent = formatted;
      },
      onComplete: () => {
        prevStars.current = stars;
      }
    });
  }, [stars]);

  const formattedStars = useMemo(() => formatStars(stars), [stars]);

  // position the sliding indicator under the hovered (or active) nav link
  useLayoutEffect(() => {
    const btn = navBtnRefs.current[targetLink];
    const container = navContainerRef.current;
    if (!btn || !container || !navIndicatorRef.current) {
      if (navIndicatorRef.current) gsap.set(navIndicatorRef.current, { opacity: 0 });
      return;
    }

    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    gsap.to(navIndicatorRef.current, {
      x: btnRect.left - containerRect.left,
      width: btnRect.width,
      opacity: 1,
      duration: 0.3,
      ease: 'power3.out'
    });
  }, [targetLink]);

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
        <nav
          ref={navContainerRef}
          onMouseLeave={() => setHoveredLink(null)}
          className="relative hidden md:flex items-center gap-1"
        >
          {/* sliding indicator — follows hover, falls back to active */}
          <div
            ref={navIndicatorRef}
            className="absolute top-0 bottom-0 left-0 rounded-md bg-(--bg-hover) pointer-events-none opacity-0"
          />

          {NAV_LINKS.map(({ label, to, comingSoon }) => (
            <Link
              key={label}
              to={to}
              ref={el => (navBtnRefs.current[label] = el)}
              onMouseEnter={() => setHoveredLink(label)}
            >
              <CurtainText
                text={label}
                fontSize={13}
                className="px-4 py-2.5  cursor-pointer"
                textClassName="font-medium! text-(--text-primary)!"
                tracking
                staggerMs={0}
              />

              {comingSoon && (
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-(--bg-elevated) text-(--text-muted) leading-none">
                  Soon
                </span>
              )}
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
            <span ref={starRef} className="text-xs text-(--text-muted)">
              {formattedStars}
            </span>
          </Link>

          {/* theme */}
          <button
            className="hidden md:flex items-center gap-1.5 px-2.5 h-8 rounded-md cursor-pointer transition-all duration-150 hover:bg-(--bg-hover)  "
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
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

          {/* Mobile hamburger */}
          <div className="relative flex items-center gap-2">
            {/* theme */}
            <button
              className="md:hidden items-center gap-1.5 px-2.5 h-8 rounded-md cursor-pointer transition-all duration-150 hover:bg-(--bg-hover)  "
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
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
              data-mobile-menu-toggle
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-8 h-8 rounded-md border border-(--border-primary) flex items-center justify-center  text-(--text-primary) hover:text-(--text-muted) transition-colors duration-150 cursor-pointer"
            >
              <span ref={hamburgerRef} className="flex items-center justify-center">
                {menuOpen ? <MdOutlineClose size={20} /> : <RiMenu4Line size={20} />}
              </span>
            </button>

            {/* Mobile dropdown menu — floats under the hamburger, doesn't push page content */}
            <div
              ref={menuRef}
              className="md:hidden absolute top-full right-0 mt-2 w-64 rounded-xl border border-(--border-secondary) bg-(--bg-card) shadow-[0_8px_32px_rgba(0,0,0,0.16)] p-2 z-50 flex flex-col gap-1"
            >
              {NAV_LINKS.map(({ label, to, comingSoon }, i) => (
                <Link
                  key={label}
                  to={to}
                  ref={el => (linkRefs.current[i] = el)}
                  onClick={() => setMenuOpen(false)}
                  className={`
        group px-3 py-2.5 rounded-md text-sm transition-colors duration-150 text-(--text-primary)
        flex items-center justify-between
        ${activeLink === label ? ' bg-(--bg-elevated)' : ' hover:bg-(--bg-elevated)'}
      `}
                >
                  <span className="flex items-center gap-1.5">
                    {label}
                    {comingSoon && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-(--bg-elevated) text-(--text-muted) leading-none">
                        Soon
                      </span>
                    )}
                  </span>
                  <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out text-(--text-primary)">
                    <FaLongArrowAltRight />
                  </span>
                </Link>
              ))}

              <Link
                to={GITHUB_URL}
                target="_blank"
                ref={el => (linkRefs.current[NAV_LINKS.length] = el)}
                className="mt-1 flex items-center gap-2 px-3 h-9 btn-none"
              >
                <FaGithub size={18} />
                <span className="tracking-wider text-(--text-primary)">GITHUB</span>
                <span ref={starMobileRef} className="text-xs text-(--text-muted)">
                  {formattedStars}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
