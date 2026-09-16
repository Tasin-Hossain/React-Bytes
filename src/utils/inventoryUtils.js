// utils/inventoryUtils.js

// Turns "21.6K" -> 21600, "45" -> 45, "0" -> 0
export const parseTraffic = value => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const str = String(value).trim().toUpperCase();
  if (str.endsWith('K')) return Math.round(parseFloat(str) * 1000);
  if (str.endsWith('M')) return Math.round(parseFloat(str) * 1000000);
  const num = parseFloat(str);
  return Number.isNaN(num) ? 0 : num;
};

export const countryFlagMap = {
  USA: '🇺🇸',
  UK: '🇬🇧',
  India: '🇮🇳',
  BD: '🇧🇩',
  Brazil: '🇧🇷',
  Indonesia: '🇮🇩',
  PHL: '🇵🇭',
  Australia: '🇦🇺',
  Malaysia: '🇲🇾',
  Ethiopia: '🇪🇹',
  RUS: '🇷🇺'
};

export const getCountryFlag = country => countryFlagMap[country] || '🌐';

export const countryCodeMap = {
  USA: 'us',
  UK: 'gb',
  India: 'in',
  BD: 'bd',
  Brazil: 'br',
  Indonesia: 'id',
  PHL: 'ph',
  Australia: 'au',
  Malaysia: 'my',
  Ethiopia: 'et',
  RUS: 'ru'
};

export const getCountryCode = country => countryCodeMap[country] || 'un';

export const EXTRA_SERVICES = [
  { id: 'brand-promotion', label: 'Brand promotion', regular: 38, gray: 75 },
  { id: 'press-news', label: 'Press news', regular: 150, gray: 300 },
  { id: 'sidebar-link', label: 'Sidebar link', regular: 179, gray: 379 },
  { id: 'banner-ads', label: 'Banner ads', regular: 229, gray: 449 }
];

export const getServicePrices = site => [
  { id: 'guest-post', label: 'Guest post', regular: site.generalPrice, gray: site.greyPrice },
  { id: 'link-insert', label: 'Link insert / Niche edit', regular: site.generalPrice, gray: site.greyPrice },
  ...EXTRA_SERVICES
];

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'traffic-desc', label: 'Highest traffic' },
  { value: 'dr-desc', label: 'Highest DR' },
  { value: 'da-desc', label: 'Highest DA' }
];

// Each chip = one independent, toggleable field. "all" isn't a real field —
// it just means "every field below is false" (handled in the page/filters
// component), so multiple chips (e.g. budget + authority) can be active
// together and are AND'd in applyQuickFilters.
export const QUICK_FILTERS = [
  { id: 'all', label: 'All sites', hint: 'Full inventory', icon: 'all' },
  { id: 'budget', label: 'Under $10', hint: 'Budget picks', icon: 'budget' },
  { id: 'authority', label: 'DR 40–60', hint: 'Authority sites', icon: 'authority' },
  { id: 'traffic', label: 'Traffic 10K+', hint: 'High traffic', icon: 'traffic' },
  { id: 'da50', label: 'DA 50+', hint: 'High authority', icon: 'da50' },
  { id: 'general', label: 'General', hint: 'General niche', icon: 'general' }
];

// filters = { budget, authority, traffic, da50, general } — all booleans.
// A site must pass every active field to be included.
export const applyQuickFilters = (filters, site) => {
  if (filters.budget && !(site.generalPrice <= 10)) return false;
  if (filters.authority && !(site.dr >= 40 && site.dr <= 60)) return false;
  if (filters.traffic && !(parseTraffic(site.traffic) >= 10000)) return false;
  if (filters.da50 && !(site.da >= 50)) return false;
  return true;
};

export const sortSites = (sites, sortBy) => {
  const list = [...sites];
  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => a.generalPrice - b.generalPrice);
    case 'traffic-desc':
      return list.sort((a, b) => parseTraffic(b.traffic) - parseTraffic(a.traffic));
    case 'dr-desc':
      return list.sort((a, b) => b.dr - a.dr);
    case 'da-desc':
      return list.sort((a, b) => b.da - a.da);
    default:
      return list;
  }
};

