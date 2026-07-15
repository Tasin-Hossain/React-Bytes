import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiArrowRight, FiBox, FiMail } from 'react-icons/fi';
import Footer from '../components/landing/Footer/Footer';
import Header from '../components/landing/Header/Header';
import { useSEO } from '../hooks/useSEO';
import { tiers } from '../data/Sponsors';

const sizeConfig = {
  lg: {
    grid: 'grid-cols-1 sm:grid-cols-2',
    logo: 'h-14 w-14',
    name: 'text-2xl',
    desc: 'text-sm',
    body: 'py-14',
    gap: 'gap-4',
  },
  md: {
    grid: 'grid-cols-1 sm:grid-cols-3',
    logo: 'h-10 w-10',
    name: 'text-base',
    desc: 'text-xs',
    body: 'py-8',
    gap: 'gap-3',
  },
  sm: {
    grid: 'grid-cols-2 sm:grid-cols-4',
    logo: 'h-8 w-8',
    name: 'text-sm',
    desc: 'text-[11px]',
    body: 'py-6',
    gap: 'gap-2',
  },
};

// Change this to your real sponsor inbox
const SPONSOR_EMAIL = 'reactbytes.support@gmail.com';
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${SPONSOR_EMAIL}&su=${encodeURIComponent(
  'React bytes Sponsorship Inquiry'
)}`;

const Logo = ({ sponsor, className }) => (
  <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-(--bg-white)/10 ${className}`}>
    <img
      src={sponsor.logo}
      alt={sponsor.name}
      className="h-full w-full object-cover"
      onError={e => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextSibling.style.display = 'flex';
      }}
    />
    <span className="absolute inset-0 hidden items-center justify-center text-xs font-medium text-(--brand)">
      {sponsor.name.slice(0, 2).toUpperCase()}
    </span>
  </span>
);

const SponsorCard = ({ sponsor, size }) => {
  const cfg = sizeConfig[size];

  if (!sponsor) {
    return (
      <div className={`sponsor-card flex flex-col items-center justify-center ${cfg.gap} rounded-xl border border-dashed border-(--border-secondary) bg-(--bg-card)/40 ${cfg.body}`}>
        <div className={`rounded-lg bg-(--bg-white)/5 ${cfg.logo}`}>
          <FiBox className="h-full w-full p-2 text-(--brand)" />
        </div>
        <span className="text-xs text-(--text-muted)">Your logo here</span>
        <span className="text-[11px] text-(--text-muted)/60">Available</span>
      </div>
    );
  }

  return (
    <a
      href={`https://${sponsor.link}`}
      target="_blank"
      rel="noopener noreferrer"
      className="sponsor-card group flex flex-col overflow-hidden rounded-2xl border border-(--border-secondary) bg-(--bg-card) transition-colors hover:border-white/20"
    >
      <div className={`flex flex-1 flex-col items-center justify-center text-center ${cfg.gap} ${cfg.body} px-4`}>
        {size === 'lg' ? (
          <div className="flex items-center gap-4">
            <Logo sponsor={sponsor} className={cfg.logo} />
            <div className="text-left">
              <div className={`font-medium text-(--text-primary) ${cfg.name}`}>{sponsor.name}</div>
              <div className={`text-(--text-muted) ${cfg.desc}`}>{sponsor.desc}</div>
            </div>
          </div>
        ) : (
          <>
            <Logo sponsor={sponsor} className={cfg.logo} />
            <div className={`font-medium text-(--text-primary) ${cfg.name}`}>{sponsor.name}</div>
            {size === 'md' && <div className={`text-(--text-muted) ${cfg.desc}`}>{sponsor.desc}</div>}
          </>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-(--border-secondary) px-4 py-3 text-sm font-medium text-(--text-primary)">
        <span className="truncate">{sponsor.link}</span>
        <FiArrowRight className="shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5" size={14} />
      </div>
    </a>
  );
};



const SponsorsPage = () => {
  useSEO({
    title: 'React Bytes - Sponsors',
    description: 'Meet the companies sponsoring React Bytes, and see how you can become a sponsor.',
    path: '/sponsors',
    noindex: true,
  });

  const heroRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });

      gsap.from(gridRef.current.querySelectorAll('.sponsor-card, .pricing-card'), {
        opacity: 0,
        y: 16,
        duration: 0.4,
        stagger: 0.05,
        delay: 0.2,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Header />

      <main className="w-full pb-8">
        {/* Hero */}
        <section className="app-container mx-auto px-6 pt-16 pb-10 text-center" ref={heroRef}>
          <h1 className="text-4xl font-bold text-(--text-primary) sm:text-5xl ">Sponsors</h1>
          <p className="mx-auto mt-4 max-w-xl text-(--text-muted)">
            These companies help keep this project running. Want your logo here too?
          </p>
          <a
            href={GMAIL_COMPOSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            <FiMail size={14} />
            Become a sponsor
          </a>
        </section>

        {/* Current sponsors, grouped by tier */}
        <section className="app-container mx-auto px-6" ref={gridRef}>
          <div className="flex flex-col gap-10">
            {tiers.map(tier => (
              <div key={tier.label}>
                <div className="mb-3 flex items-center gap-2">
                  <tier.icon className={tier.iconClassName} size={16} />
                  <span className="text-xs font-semibold uppercase tracking-widest text-(--text-muted)">
                    {tier.label}
                  </span>
                </div>

                <div className={`grid gap-4 ${sizeConfig[tier.size].grid}`}>
                  {Array.from({ length: tier.slots }).map((_, i) => (
                    <SponsorCard key={i} sponsor={tier.sponsors[i]} size={tier.size} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default SponsorsPage;
