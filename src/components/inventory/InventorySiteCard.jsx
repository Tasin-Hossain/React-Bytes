import { RiEyeLine, RiTimeLine } from 'react-icons/ri';
import FlagIcon from '../ui/flag-icon';
import { getCountryCode } from '../../utils/inventoryUtils';

const CardStat = ({ label, children, accent = false }) => (
  <div className="min-w-0">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-(--text-muted)">{label}</p>
    <p className={`mt-1 truncate text-[13.5px] font-semibold ${accent ? 'text-(--brand)' : 'text-(--text-primary)'}`}>
      {children}
    </p>
  </div>
);

const InventorySiteCard = ({ site, onPreview }) => (
  <div className="rounded-xl border border-(--border-secondary) bg-(--bg-elevated) shadow-sm p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-[14.5px] font-semibold text-(--text-primary)">{site.website}</p>
        <span className="mt-1.5 inline-flex items-center rounded-full border border-(--border-button) bg-(--bg-button) px-2.5 py-1 text-[11px] text-(--text-muted)">
          {site.niche}
        </span>
      </div>
      <button
        type="button"
        onClick={onPreview}
        aria-label={`Preview ${site.website}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-(--border-button) bg-(--bg-button) text-(--text-muted) transition-colors hover:text-(--text-primary) cursor-pointer"
      >
        <RiEyeLine size={16} />
      </button>
    </div>

    <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-3.5">
      <CardStat label="Moz DA">{site.da}</CardStat>
      <CardStat label="Ahrefs DR">{site.dr}</CardStat>
      <CardStat label="Traffic">{site.traffic}</CardStat>
      <CardStat label="Country">
        <span className="flex items-center gap-1.5">
          <FlagIcon code={getCountryCode(site.country)} className="h-3 w-4.5 rounded-xs object-cover" />
          {site.country}
        </span>
      </CardStat>
      <CardStat label="Guest post" accent>
        ${site.generalPrice}
      </CardStat>
      <CardStat label="TAT">
        <span className="flex items-center gap-1 text-(--text-primary)">
          <RiTimeLine size={12} className="text-(--text-muted)" />
          {site.tat}
        </span>
      </CardStat>
    </div>

    <button
      type="button"
      onClick={onPreview}
      className="btn mt-4 w-full justify-center py-2.5! text-[13px]"
    >
      Preview & pricing
    </button>
  </div>
);

export default InventorySiteCard;