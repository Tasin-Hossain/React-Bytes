// pages/Favorites.jsx

import { useState, useEffect } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { CATEGORIES } from '../constants/Categories';
import { EmptyState } from '../components/shared/EmptyState';
import { Input, InputGroup } from '../components/ui/Input/Input';
import CategoryDropdown from '../components/shared/CategoryDropdown';
import ComponentCard from '../components/shared/ComponentsGrid/ComponentCard';


const slug = str => str.replace(/\s+/g, '-').toLowerCase();
const SKIP_CATEGORIES = ['Get Started'];

const getSaved = () => {
  try { return JSON.parse(localStorage.getItem('savedComponents') || '[]'); }
  catch { return []; }
};

const buildComponentMap = () => {
  const map = {};
  for (const cat of CATEGORIES) {
    if (SKIP_CATEGORIES.includes(cat.name)) continue;
    for (const sub of cat.subcategories) {
      const key = `${slug(cat.name)}/${slug(sub)}`;
      map[key] = { name: sub, category: cat.name, path: `/${slug(cat.name)}/${slug(sub)}`, videoKey: key };
    }
  }
  return map;
};

const COMPONENT_MAP = buildComponentMap();

const ALL_CATEGORIES = [
  'All Components',
  ...CATEGORIES.filter(c => !SKIP_CATEGORIES.includes(c.name)).map(c => c.name)
];

const Favorites = () => {
  const [savedKeys, setSavedKeys] = useState(getSaved);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Components');

  useEffect(() => {
    const sync = () => setSavedKeys(getSaved());
    window.addEventListener('favorites:updated', sync);
    return () => window.removeEventListener('favorites:updated', sync);
  }, []);

  const handleRemove = key => {
    const next = savedKeys.filter(k => k !== key);
    localStorage.setItem('savedComponents', JSON.stringify(next));
    window.dispatchEvent(new Event('favorites:updated'));
    setSavedKeys(next);
  };

  const allItems = savedKeys.map(k => COMPONENT_MAP[k]).filter(Boolean);

  const filtered = allItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All Components' || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <>
      <title>Favorites | React Bytes</title>

      <div className="md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-(--text-primary) flex flex-col">

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="title-two shrink-0">Favorites</h1>

          <div className="flex items-center gap-2 sm:gap-3 sm:ml-auto">
            <InputGroup
              startElement={<RiSearchLine size={14} className="text-(--text-muted)" />}
              className="w-full sm:w-48"
            >
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                startElement={true}
              />
            </InputGroup>

            <div className="shrink-0">
              <CategoryDropdown
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={ALL_CATEGORIES}
              />
            </div>
          </div>
        </div>

        {allItems.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-24 gap-2 text-center">
            <p className="text-(--text-primary)">No results for "{search}"</p>
            <p className="text-sm text-(--text-muted)">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map(item => (
              <ComponentCard key={item.videoKey} item={item} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Favorites;