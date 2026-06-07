// pages/AllComponents.jsx

import { useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { CATEGORIES } from '../constants/Categories';
import { Input, InputGroup } from '../components/ui/Input/Input';
import CategoryDropdown from '../components/shared/CategoryDropdown';
import ComponentCard from '../components/shared/ComponentsGrid/ComponentCard';

const slug = str => str.replace(/\s+/g, '-').toLowerCase();
const SKIP_CATEGORIES = ['Get Started'];

const buildAllItems = () => {
  const items = [];
  for (const cat of CATEGORIES) {
    if (SKIP_CATEGORIES.includes(cat.name)) continue;
    for (const sub of cat.subcategories) {
      items.push({
        name: sub,
        category: cat.name,
        path: `/${slug(cat.name)}/${slug(sub)}`,
        videoKey: `${slug(cat.name)}/${slug(sub)}`,
      });
    }
  }
  return items;
};

const ALL_ITEMS = buildAllItems();

const ALL_CATEGORIES = [
  'All Components',
  ...CATEGORIES.filter(c => !SKIP_CATEGORIES.includes(c.name)).map(c => c.name),
];

const AllComponents = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Components');

  const filtered = ALL_ITEMS.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All Components' || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <>
      <title>All Components | React Bytes</title>

      <div className="w-full px-4 sm:px-6 py-6 sm:py-8 text-(--text-primary) flex flex-col overflow-hidden">

        <div className="flex flex-col gap-4 mb-6 sm:mb-8 min-w-0">
          <h1 className="title-two shrink-0">All Components</h1>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <InputGroup
              startElement={<RiSearchLine size={14} className="text-(--text-muted)" />}
              className="w-full sm:w-64 min-w-0"
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

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-24 gap-2 text-center">
            <p className="text-(--text-primary)">No results for "{search}"</p>
            <p className="text-sm text-(--text-muted)">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map(item => (
              <ComponentCard key={item.videoKey} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AllComponents;
