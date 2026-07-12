import { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
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
import CurtainText from '../../../content/TextAnimations/CurtainText';

const NAV_LINKS = [
  { label: 'Docs', to: '/get-started/introduction' },
  { label: 'Components', to: '/text-animations/curtain-text' },
  // { label: 'Blocks', to: '/', comingSoon: true },
  { label: 'Tools', to: '/tools' }
];

const formatStars = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : Math.round(n));

const Header = () => {
  const stars = useStars();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [activeLink, setActiveLink] = useState('');
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

  // init hidden state on mount
  useEffect(() => {
    if (menuRef.current) {
      gsap.set(menuRef.current, { height: 0, overflow: 'hidden', display: 'none' });
    }
  }, []);

  // mobile menu open/close animation
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const links = linkRefs.current.filter(Boolean);

    if (menuTl.current) menuTl.current.kill();

    if (menuOpen) {
      gsap.set(menu, { display: 'block', height: 'auto' });
      const fullHeight = menu.offsetHeight;
      gsap.set(menu, { height: 0, overflow: 'hidden' });
      gsap.set(links, { opacity: 0, y: -8 });

      menuTl.current = gsap
        .timeline()
        .to(menu, { height: fullHeight, duration: 0.35, ease: 'power2.out' })
        .to(links, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }, '-=0.15')
        .set(menu, { height: 'auto' });
    } else {
      menuTl.current = gsap
        .timeline()
        .to(links, { opacity: 0, y: -8, duration: 0.15, stagger: 0.03, ease: 'power1.in' })
        .to(
          menu,
          {
            height: 0,
            duration: 0.3,
            ease: 'power2.in',
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
              ref={(el) => (navBtnRefs.current[label] = el)}
              onClick={() => setActiveLink(label)}
              onMouseEnter={() => setHoveredLink(label)}
            >
              <CurtainText  text={label} fontSize={13} className='px-4 py-2.5  cursor-pointer' textClassName='font-medium! text-(--text-primary)!' tracking staggerMs={0}/>

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
          <button className="hidden md:flex items-center gap-1.5 px-2.5 h-8 rounded-md cursor-pointer transition-all duration-150 hover:bg-(--bg-hover)  " onClick={toggleTheme} aria-label="Toggle theme">
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
            <button className="md:hidden items-center gap-1.5 px-2.5 h-8 rounded-md cursor-pointer transition-all duration-150 hover:bg-(--bg-hover)  " onClick={toggleTheme} aria-label="Toggle theme">
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
              <span ref={hamburgerRef} className="flex items-center justify-center">
                {menuOpen ? <MdOutlineClose size={20} /> : <RiMenu4Line size={20} />}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — full width, no app-container so it bleeds edge to edge */}
      <div ref={menuRef} className="md:hidden">
        <div className="app-container px-4 pb-4 py-2 border-t border-(--border-secondary) flex flex-col gap-1 ">
          {NAV_LINKS.map(({ label, to, comingSoon }, i) => (
            <Link
              key={label}
              to={to}
              ref={(el) => (linkRefs.current[i] = el)}
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
            ref={(el) => (linkRefs.current[NAV_LINKS.length] = el)}
            className="mt-2 flex items-center gap-2 px-3 h-9 btn"
          >
            <FaGithub size={18} />
            <span className="tracking-wider text-(--text-primary)">GITHUB</span>
            <span ref={starMobileRef} className="text-xs text-(--text-muted)">
              {formattedStars}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
