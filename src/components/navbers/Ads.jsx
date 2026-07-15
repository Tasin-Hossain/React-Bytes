import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiArrowUpRight, FiBox } from 'react-icons/fi';
import { Link } from 'react-router';
import { tiers } from '../../data/Sponsors';

// size -> logo box dimensions
const LOGO_SIZE = {
  lg: 'h-9 w-9',
  md: 'h-8 w-8',
  sm: 'h-7 w-7',
};

const Logo = ({ sponsor, size = 'lg' }) => (
  <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-(--bg-white)/10 ${LOGO_SIZE[size]}`}>
    <img
      src={sponsor.logo}
      alt={sponsor.name}
      className="h-full w-full object-cover"
      onError={e => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextSibling.style.display = 'flex';
      }}
    />
    <span className="absolute inset-0 hidden items-center justify-center text-[10px] font-medium text-(--brand)">
      {sponsor.name.slice(0, 2).toUpperCase()}
    </span>
  </span>
);

const SponsorRow = ({ sponsor, size }) => (
  <a
    href={`https://${sponsor.link}`}
    target="_blank"
    rel="noopener noreferrer"
    className="sponsor-card group flex items-center gap-3 rounded-xl border border-(--border-secondary) px-3.5 py-3 transition-colors hover:border-white/20"
  >
    <Logo sponsor={sponsor} size={size} />
    <div className="min-w-0 text-left">
      <p className="truncate text-[13px] font-medium text-(--text-primary) m-0">{sponsor.name}</p>
      {sponsor.desc && (
        <p className="truncate text-[11px] text-(--text-muted) m-0">{sponsor.desc}</p>
      )}
    </div>
  </a>
);

const EmptySlot = ({ size }) => (
  <div className="sponsor-card flex items-center gap-3 rounded-xl border border-dashed border-(--border-secondary) px-3.5 py-3">
    <span className={`flex shrink-0 items-center justify-center rounded-md bg-(--bg-white)/5 ${LOGO_SIZE[size]}`}>
      <FiBox className="text-(--text-muted)" size={16} />
    </span>
    <div className="min-w-0 text-left">
      <p className="text-[13px] font-medium text-(--text-muted) m-0">Your logo here</p>
      <p className="text-[11px] text-(--text-muted)/60 m-0">Available</p>
    </div>
  </div>
);

const LogoOnlyCard = ({ sponsor, size }) => (
  <a
    href={`https://${sponsor.link}`}
    target="_blank"
    rel="noopener noreferrer"
    title={sponsor.name}
    className="sponsor-card group flex items-center justify-center rounded-xl border border-(--border-secondary) px-2 py-3 transition-colors hover:border-white/20"
  >
    <Logo sponsor={sponsor} size={size} />
  </a>
);

const Ads = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Panel itself fades/slides in
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'power2.out',
      });

      // Each sponsor / empty card staggers in after the panel
      gsap.from(containerRef.current.querySelectorAll('.sponsor-card'), {
        opacity: 0,
        y: 10,
        duration: 0.4,
        stagger: 0.06,
        delay: 0.15,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <aside className="hidden xl:flex flex-col w-(--right-panel-width) shrink-0">
      <div
        ref={containerRef}
        className="sticky top-20.25 rounded-2xl border border-(--border-secondary) bg-(--bg-card) p-4 flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-(--text-primary)">SPONSORS</span>
          <Link
            to="/sponsors"
            className="flex items-center gap-1 text-xs font-medium text-(--brand) hover:opacity-80"
          >
            Become a sponsor
            <FiArrowUpRight size={13} />
          </Link>
        </div>

        {tiers.map(tier => {
          // Diamond (variant "full"): always show all slots, empty ones included.
          if (tier.variant === 'full') {
            return (
              <div key={tier.label} className="grid gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)/60">
                  <tier.icon className={tier.iconClassName} size={14} />
                  {tier.label}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {Array.from({ length: tier.slots }).map((_, i) =>
                    tier.sponsors[i] ? (
                      <SponsorRow key={i} sponsor={tier.sponsors[i]} size={tier.size} />
                    ) : (
                      <EmptySlot key={i} size={tier.size} />
                    )
                  )}
                </div>
              </div>
            );
          }

          // Platinum / Silver (variant "logo"): no sponsors -> hide the tier entirely.
          if (tier.sponsors.length === 0) return null;

          return (
            <div key={tier.label} className="grid gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)/60">
                <tier.icon className={tier.iconClassName} size={14} />
                {tier.label}
              </span>
              <div className={`grid gap-2 ${tier.slots === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {tier.sponsors.map((sponsor, i) => (
                  <LogoOnlyCard key={i} sponsor={sponsor} size={tier.size} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer note */}
        <p className="text-[11px] text-(--text-muted)/70 text-center pt-1">
          2k+ devs monthly · Limited spots
        </p>
      </div>
    </aside>
  );
};

export default Ads;
