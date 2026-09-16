// components/shared/PromoCard.jsx
import lightLogo from '../../assets/logos/logo.png';

const PromoBanner = ({ badgeText }) => (
  <div className="relative h-32 w-full overflow-hidden rounded-t-xl border-b border-(--border-secondary)">
    {/* Base dark layer */}
    <div className="absolute inset-0 bg-(--bg-elevated)" />

    {/* Glow blobs */}
    <div className="absolute -top-10 left-1/4 h-40 w-40 rounded-full bg-(--brand)/40 blur-3xl" />
    <div className="absolute -bottom-12 right-1/4 h-40 w-40 rounded-full bg-(--brand-2)/30 blur-3xl" />

    {/* Subtle grid overlay for texture */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '18px 18px'
      }}
    />

     {/* Centered badge */}
    <div className="relative flex h-full items-center justify-center">
      <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-1.5 backdrop-blur-sm">
        <img src={lightLogo} alt="" className="h-4 w-4 shrink-0 object-contain" />
        <span className="text-sm font-medium text-white">{badgeText}</span>
      </span>
    </div>
  </div>
);

const PromoCard = ({
  badgeText = 'Linkerbuddy',
  title = 'Build your backlink strategy with one platform.',
  description = 'Verified guest posts, link insertions, niche edits and reporting — everything you need to scale outreach.',
  stats = [],
  buttonText = 'Explore Linkerbuddy Pro',
  buttonHref = '#'
}) => (
  <div className="overflow-hidden rounded-2xl border border-(--border-secondary) shadow-md bg-(--bg-card)">
    <PromoBanner badgeText={badgeText} />

    <div className="p-4">
      <h3 className="text-[16px] font-bold leading-snug text-(--text-primary)">{title}</h3>
      <p className="mt-2 text-[12.5px] leading-relaxed text-(--text-muted)">{description}</p>

      {stats.length > 0 && (
        <div className="mt-3 flex flex-col gap-1">
          {stats.map((line, i) => (
            <p key={i} className="text-[11.5px] font-medium text-(--text-muted)">
              {line}
            </p>
          ))}
        </div>
      )}
      <a
      
        href={buttonHref}
        className="btn w-full flex items-center justify-center mt-2"
      >
        {buttonText}
      </a>
    </div>
  </div>
);

export default PromoCard;