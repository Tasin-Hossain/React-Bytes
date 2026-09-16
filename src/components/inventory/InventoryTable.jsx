// components/inventory/InventoryTable.jsx
import { RiEyeLine } from 'react-icons/ri';
import FlagIcon from '../ui/flag-icon';
import { getCountryCode } from '../../utils/inventoryUtils';
import InventorySiteCard from './InventorySiteCard';

const COLUMNS = ['Website', 'Niche', 'DA', 'DR', 'Organic Traffic', 'Country', 'Guest Post', 'TAT', ''];

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-(--border-secondary) py-20 text-center">
    <p className="text-(--text-primary)">No sites match your filters</p>
    <p className="text-sm text-(--text-muted)">Try clearing a filter or searching a different term</p>
  </div>
);

const InventoryTable = ({ sites, onPreview }) => {
  if (sites.length === 0) return <EmptyState />;

  return (
    <>
      {/* Cards — phone / sm / md */}
      <div className="grid gap-4 lg:hidden">
        {sites.map((site, idx) => (
          <InventorySiteCard
            key={`${site.website}-${idx}`}
            site={site}
            onPreview={() => onPreview(site)}
          />
        ))}
      </div>

      {/* Table — lg and up */}
      <div className="hidden overflow-x-auto rounded-xl border border-(--border-secondary) lg:block">
        <table className="w-full min-w-225 border-collapse text-left">
          <thead>
            <tr className="border-b border-(--border-secondary) bg-(--bg-elevated)">
              {COLUMNS.map(col => (
                <th
                  key={col}
                  className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sites.map((site, idx) => (
              <tr
                key={`${site.website}-${idx}`}
                className="border-b border-(--border-secondary) last:border-b-0 transition-colors duration-100 hover:bg-(--bg-hover)"
              >
                <td className="py-3.5 pr-4 pl-4">
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-semibold text-(--text-primary)">
                      {site.website}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-[11px] text-(--text-muted)">
                      <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-medium text-emerald-400">
                        {site.owner}
                      </span>
                      · {site.trend}
                    </span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[13.5px] text-(--text-muted)">{site.niche}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center rounded-md bg-(--bg-elevated) px-1.5 py-0.5 text-xs font-semibold text-(--text-primary)">
                    {site.da}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center rounded-md bg-(--bg-elevated) px-1.5 py-0.5 text-xs font-semibold text-(--text-primary)">
                    {site.dr}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[13.5px] text-(--text-muted)">{site.traffic}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[13.5px] text-(--text-muted)">
                  <span className="flex items-center gap-2">
                    <FlagIcon code={getCountryCode(site.country)} className="h-3.5 w-5 rounded-xs object-cover" />
                    {site.country}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-(--brand)">
                  ${site.generalPrice}
                  <span className="font-normal text-(--text-muted)"> / post</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[13.5px] text-(--text-muted)">{site.tat}</td>
                <td className="whitespace-nowrap px-4 py-3.5 pr-4 text-right">
                  <button
                    type="button"
                    onClick={() => onPreview(site)}
                    className="btn inline-flex items-center gap-1.5 px-3! py-1.5! text-[12.5px] cursor-pointer"
                  >
                    <RiEyeLine size={14} />
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InventoryTable;