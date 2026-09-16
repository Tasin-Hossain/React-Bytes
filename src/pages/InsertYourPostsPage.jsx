// pages/InsertYourPostsPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import Footer from '../components/landing/Footer/Footer';
import Header from '../components/landing/Header/Header';
import InventoryFilters from '../components/inventory/InventoryFilters';
import InventoryTable from '../components/inventory/InventoryTable';
import PreviewModal from '../components/inventory/PreviewModal';
import { WEBSITES_DATA } from '../constants/websitesData';
import { applyQuickFilters, getCountryCode, sortSites } from '../utils/inventoryUtils';
import { useSEO } from '../hooks/useSEO';
import { FiMail } from 'react-icons/fi';
const DEFAULT_FILTERS = { budget: false, authority: false, traffic: false, da50: false };
const PAGE_SIZE = 10;
const SPONSOR_EMAIL = 'reactbytes.dev@gmail.com';
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${SPONSOR_EMAIL}&su=${encodeURIComponent(
  'Link Insert / Niche Edit Inquiry'
)}`;

// niche/country <-> URL-safe slugs. Kept outside the component so they're
// not recreated every render, and so a hand-edited/stale URL never throws —
// anything invalid just falls back to the default ("all").
const slugify = value => value.toLowerCase().replace(/\s+/g, '-');

const nicheFromSlug = (slug, niches) => {
  if (!slug) return 'all';
  return niches.find(n => slugify(n) === slug.toLowerCase()) ?? 'all';
};

const countryFromSlug = (slug, countries) => {
  if (!slug) return 'all';
  return countries.find(c => slugify(c) === slug.toLowerCase()) ?? 'all';
};

// Reads the initial filter state straight from the URL on first render, so a
// shared link with ?budget=1&niche=general&... opens already filtered.
const parseFiltersFromParams = params => ({
  budget: params.get('budget') === '1',
  authority: params.get('authority') === '1',
  traffic: params.get('traffic') === '1',
  da50: params.get('da50') === '1'
});

const InsertYourPostsPage = () => {
  useSEO({
    title: 'Insert Your Post — All Websites | React Bytes',
    description:
      "Browse React Bytes full guest post & link insertion inventory. Filter by country, niche, Moz DA, Ahrefs DR, traffic and price.",
    path: '/insert-your-post'
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const uniqueCountries = useMemo(
    () => [...new Set(WEBSITES_DATA.map(s => s.country))].sort((a, b) => a.localeCompare(b)),
    []
  );

  const uniqueNiches = useMemo(
    () => [...new Set(WEBSITES_DATA.map(s => s.niche))].sort((a, b) => a.localeCompare(b)),
    []
  );

  // Every filter field mirrors its own URL param, so the fully filtered/sorted
  // view is reproducible from the URL alone, e.g.
  // ?budget=1&niche=general&country=india&q=finance&sort=price-asc
  const [activeFilters, setActiveFilters] = useState(() => parseFiltersFromParams(searchParams));
  const [nicheFilter, setNicheFilter] = useState(() => nicheFromSlug(searchParams.get('niche'), uniqueNiches));
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [country, setCountry] = useState(() => countryFromSlug(searchParams.get('country'), uniqueCountries));
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') ?? 'recommended');
  const [previewSite, setPreviewSite] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Keep the URL in sync with the current filters. Default values are
  // omitted entirely so the link stays clean until something actually
  // changes from its default.
  useEffect(() => {
    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev);

        if (!activeFilters.budget) next.delete('budget');
        else next.set('budget', '1');

        if (!activeFilters.authority) next.delete('authority');
        else next.set('authority', '1');

        if (!activeFilters.traffic) next.delete('traffic');
        else next.set('traffic', '1');

        if (!activeFilters.da50) next.delete('da50');
        else next.set('da50', '1');

        if (nicheFilter === 'all') next.delete('niche');
        else next.set('niche', slugify(nicheFilter));

        if (country === 'all') next.delete('country');
        else next.set('country', slugify(country));

        if (!search.trim()) next.delete('q');
        else next.set('q', search.trim());

        if (sortBy === 'recommended') next.delete('sort');
        else next.set('sort', sortBy);

        return next;
      },
      { replace: true }
    );
    // setSearchParams is stable across renders; only the filter state itself
    // should trigger a URL update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, nicheFilter, country, search, sortBy]);

  const toggleFilter = filterId => {
    if (filterId === 'all') {
      setActiveFilters(DEFAULT_FILTERS);
      setNicheFilter('all');
      return;
    }
    if (filterId === 'general') {
      setNicheFilter(prev => (prev === 'General' ? 'all' : 'General'));
      return;
    }
    setActiveFilters(prev => ({ ...prev, [filterId]: !prev[filterId] }));
  };

  const nicheOptions = useMemo(() => ['All niches', ...uniqueNiches], [uniqueNiches]);

  const handleNicheChange = label => {
    setNicheFilter(label === 'All niches' ? 'all' : label);
  };

  const countryOptions = useMemo(
    () => ['All countries', ...uniqueCountries.map(c => ({ label: c, code: getCountryCode(c) }))],
    [uniqueCountries]
  );

  const countryLabel = country === 'all' ? 'All countries' : country;

  const handleCountryLabelChange = label => {
    setCountry(label === 'All countries' ? 'all' : label);
  };

  const filteredSites = useMemo(() => {
    let list = WEBSITES_DATA.filter(site => applyQuickFilters(activeFilters, site));

    if (nicheFilter !== 'all') {
      list = list.filter(site => site.niche === nicheFilter);
    }

    if (country !== 'all') {
      list = list.filter(site => site.country === country);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(site => site.website.toLowerCase().includes(q) || site.niche.toLowerCase().includes(q));
    }

    return sortSites(list, sortBy);
  }, [activeFilters, nicheFilter, country, search, sortBy]);

  // Reset back to the first page whenever any filter/sort/search criteria
  // changes, so "View more" never points past a new, possibly shorter list.
  const filterSignature = `${JSON.stringify(activeFilters)}|${nicheFilter}|${country}|${search}|${sortBy}`;
  const [lastFilterSignature, setLastFilterSignature] = useState(filterSignature);
  if (filterSignature !== lastFilterSignature) {
    setLastFilterSignature(filterSignature);
    setVisibleCount(PAGE_SIZE);
  }

  const visibleSites = filteredSites.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSites.length;

  return (
    <>
      <Header />

      <section className="app-container mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl font-bold text-(--text-primary) sm:text-5xl ">
          All Websites for Guest Posts & Link Insertions
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-(--text-muted)">
          Filter the full inventory by country, niche, Moz DA, Ahrefs DR, traffic and price — pick the sites that fit
          your campaign, then reach out to place your content.
        </p>

        <a
            href={GMAIL_COMPOSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-4"
          >
            <FiMail size={14} />
            Contect for Link insert
          </a>
      </section>

      <div className="app-container py-8 sm:py-10 text-(--text-primary)">
        {/* Quick stats */}
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="bg-(--bg-card) shadow-sm rounded-lg border border-(--border-secondary) px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-(--text-muted)">Total Sites</p>
            <p className="text-lg text-(--text-primary) font-semibold">{WEBSITES_DATA.length}</p>
          </div>
          <div className="bg-(--bg-card) shadow-sm rounded-lg border border-(--border-secondary) px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-(--text-muted)">Countries</p>
            <p className="text-lg text-(--text-primary) font-semibold">{uniqueCountries.length}</p>
          </div>
          <div className="bg-(--bg-card) shadow-sm rounded-lg border border-(--border-secondary) px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-(--text-muted)">From</p>
            <p className="text-lg  font-semibold text-(--brand)">$40</p>
          </div>
          <div className="bg-(--bg-card) shadow-sm rounded-lg border border-(--border-secondary) px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-(--text-muted)">Turnaround</p>
            <p className="text-lg text-(--text-primary) font-semibold">Instant</p>
          </div>
        </div>

        {/* Filters */}
        <InventoryFilters
          activeFilters={activeFilters}
          nicheFilter={nicheFilter}
          onToggleFilter={toggleFilter}
          search={search}
          onSearchChange={setSearch}
          countryOptions={countryOptions}
          countryLabel={countryLabel}
          onCountryLabelChange={handleCountryLabelChange}
          nicheOptions={nicheOptions}
          onNicheChange={handleNicheChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className='bg-(--bg-card) rounded-xl  py-5 px-6 border border-(--border-secondary) shadow-sm'>
          {/* Results count */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <p className="text-sm text-(--text-muted) mb-2">
              Showing <span className="font-semibold text-(--brand)">{visibleSites.length}</span> of{' '}
              <span className="font-semibold text-(--brand)">{filteredSites.length}</span> verified placements · metrics from Moz & Ahrefs
            </p>
          </div>

          {/* Table */}
          <InventoryTable sites={visibleSites} onPreview={setPreviewSite} />
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
              className="btn h-10 px-5 text-[13px] cursor-pointer"
            >
              Load more ({filteredSites.length - visibleSites.length} more)
            </button>
          </div>
        )}
      </div>

      {previewSite && <PreviewModal site={previewSite} onClose={() => setPreviewSite(null)} />}

      <Footer />
    </>
  );
};

export default InsertYourPostsPage;