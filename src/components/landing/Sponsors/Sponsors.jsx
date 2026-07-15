import { motion } from 'motion/react';
import { FiArrowRight, FiBox } from 'react-icons/fi';
import { Link } from 'react-router';
import { tiers } from '../../../data/Sponsors';


const sizeConfig = {
  lg: {
    grid: 'grid-cols-1 sm:grid-cols-2',
    logo: 'h-14 w-14',
    name: 'text-2xl',
    desc: 'text-sm',
    body: 'py-14',
    gap: 'gap-4'
  },
  md: {
    grid: 'grid-cols-1 sm:grid-cols-3',
    logo: 'h-10 w-10',
    name: 'text-base',
    desc: 'text-xs',
    body: 'py-8',
    gap: 'gap-3'
  },
  sm: {
    grid: 'grid-cols-2 sm:grid-cols-4',
    logo: 'h-8 w-8',
    name: 'text-sm',
    desc: 'text-[11px]',
    body: 'py-6',
    gap: 'gap-2'
  }
};

const ByteBar = ({ filled, total }) => (
  <div className="flex gap-1">
    {Array.from({ length: total }).map((_, i) => (
      <span key={i} className={`h-2 w-4 rounded-xs ${i < filled ? 'bg-(--brand)' : 'bg-(--bg-white)/10'}`} />
    ))}
  </div>
);

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

const Logo = ({ sponsor, className }) => (
  <span
    className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-(--bg-white)/10 ${className}`}
  >
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
      <motion.div
        variants={cardVariants}
        className={`flex flex-col items-center justify-center ${cfg.gap} rounded-xl border border-dashed border-(--border-secondary) bg-(--bg-card)/40 ${cfg.body} shadow-[0_4px_32px_rgba(0,0,0,0.1),inset_0_0.5px_0_rgba(255,255,255,0.06)]`}
      >
        <div className={`rounded-lg bg-(--bg-white)/5 ${cfg.logo}`}>
          <FiBox className="h-full w-full p-2 text-(--brand)" />
        </div>
        <span className="text-xs text-(--text-muted)">Your logo here</span>
        <span className="text-[11px] text-(--text-muted)/60">Available</span>
      </motion.div>
    );
  }

  return (
    <motion.a
      variants={cardVariants}
      href={`https://${sponsor.link}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-(--border-secondary) bg-(--bg-card) transition-colors hover:border-white/20"
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
    </motion.a>
  );
};

const Sponsors = () => {
  return (
    <section className="w-full pt-8">
      <motion.div
        className="app-container mx-auto px-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <h2 className="title">Sponsors</h2>

        <div className="flex flex-col gap-8">
          {tiers.map(tier => (
            <div key={tier.label}>
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 bg-(--bg-white)/5 btn-none py-1.5 px-3 text-[10px]">
                  <tier.icon className={tier.iconClassName} size={14} />
                  {tier.label}
                </span>
                <ByteBar filled={tier.sponsors.length} total={tier.slots} />
              </div>

              <motion.div
                className={`grid gap-4 ${sizeConfig[tier.size].grid} `}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ staggerChildren: 0.08 }}
              >
                {Array.from({ length: tier.slots }).map((_, i) => (
                  <SponsorCard key={i} sponsor={tier.sponsors[i]} size={tier.size} />
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-6">
          <Link to="/sponsors" className="btn text-xs">
            View all sponsors <FiArrowRight size={13} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Sponsors;