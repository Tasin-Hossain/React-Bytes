import {
  RiSearchLine,
  RiApps2Line,
  RiMoneyDollarCircleLine,
  RiVipDiamondLine,
  RiLineChartLine,
  RiShieldCheckLine,
  RiHashtag
} from 'react-icons/ri';
import { Input, InputGroup } from '../ui/Input/Input';
import CategoryDropdown from '../shared/CategoryDropdown';
import { QUICK_FILTERS, SORT_OPTIONS } from '../../utils/inventoryUtils';

const FILTER_ICONS = {
  all: RiApps2Line,
  budget: RiMoneyDollarCircleLine,
  authority: RiVipDiamondLine,
  traffic: RiLineChartLine,
  da50: RiShieldCheckLine,
  general: RiHashtag
};

const InventoryFilters = ({
  activeFilters, // { budget, authority, traffic, da50 } booleans
  nicheFilter, // 'all' or a specific niche string
  onToggleFilter, // (filterId) => void — 'all' clears everything, 'general' toggles niche, others toggle their own boolean
  search,
  onSearchChange,
  countryOptions,
  countryLabel,
  onCountryLabelChange,
  nicheOptions, // e.g. ['All niches', 'General', 'Tech', ...]
  onNicheChange, // receives the raw label clicked
  sortBy,
  onSortChange
}) => {
  const sortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Sort by';
  const nicheLabel = nicheFilter === 'all' ? 'All niches' : nicheFilter;

  const isActive = filterId => {
    if (filterId === 'all') return !Object.values(activeFilters).some(Boolean) && nicheFilter === 'all';
    if (filterId === 'general') return nicheFilter === 'General';
    return !!activeFilters[filterId];
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Quick filter chips — 2-col grid on mobile/tablet */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        {QUICK_FILTERS.map(f => {
          const Icon = FILTER_ICONS[f.icon];
          const active = isActive(f.id);
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onToggleFilter(f.id)}
              aria-pressed={active}
              className={` flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left transition-colors duration-150 cursor-pointer
                ${
                  active
                    ? 'border-(--brand) bg-(--brand)'
                    : 'border-(--border-secondary) bg-(--bg-card)! shadow-sm hover:bg-(--bg-hover)'
                }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center ${
                  active ? 'text-white' : 'text-(--text-muted)'
                }`}
              >
                <Icon size={15} />
              </span>
              <span className="min-w-0 ">
                <span
                  className={`block truncate text-[12.5px] font-medium ${
                    active ? 'text-white' : 'text-(--text-primary)'
                  }`}
                >
                  {f.label}
                </span>
                <span
                  className={`block truncate text-[12.5px] font-medium ${
                    active ? 'text-white' : 'text-(--text-primary)'
                  }`}
                >
                  {f.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* md+: connected segmented row */}
      <div className="hidden overflow-hidden bg-(--bg-card) shadow-sm rounded-xl border border-(--border-secondary) md:flex">
        {QUICK_FILTERS.map((f, index) => {
          const Icon = FILTER_ICONS[f.icon];
          const active = isActive(f.id);
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onToggleFilter(f.id)}
              aria-pressed={active}
              className={`flex flex-1 flex-col items-center gap-1 px-3 py-2 text-center transition-colors duration-150 cursor-pointer
                ${index !== QUICK_FILTERS.length - 1 ? 'border-r border-(--border-secondary)' : ''}
                ${active ? 'bg-(--brand)' : 'hover:bg-(--bg-hover)'}`}
            >
              <Icon size={16} className={active ? 'text-white' : 'text-(--text-muted)'} />
              <span
                className={`truncate text-[12.5px] font-medium lg:text-[13px] ${
                  active ? 'text-white' : 'text-(--text-primary)'
                }`}
              >
                {f.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + niche + country + sort */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup
          startElement={<RiSearchLine size={14} className="text-(--text-muted) " />}
          className="flex-1 sm:max-w-xs bg-(--bg-card)! rounded-xl shadow-sm! "
        >
          <Input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search sites…"
            startElement={true}
            className='h-10! lg:h-10!'
          />
        </InputGroup>

        <div className="flex flex-wrap items-center gap-2">
          <CategoryDropdown value={nicheLabel} onChange={onNicheChange} options={nicheOptions} />
          <CategoryDropdown value={countryLabel} onChange={onCountryLabelChange} options={countryOptions} />
          <CategoryDropdown
            value={sortLabel}
            onChange={label => {
              const opt = SORT_OPTIONS.find(o => o.label === label);
              if (opt) onSortChange(opt.value);
            }}
            options={SORT_OPTIONS.map(o => o.label)}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;
