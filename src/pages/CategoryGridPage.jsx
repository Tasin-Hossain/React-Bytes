// pages/CategoryGridPage.jsx
import { useParams, Navigate } from 'react-router';
import { CATEGORIES, NEW } from '../constants/Categories';
import ComponentCard from '../components/shared/ComponentsGrid/ComponentCard';
import LazyRender from '../components/common/LazyRender';
import { useSEO } from '../hooks/useSEO';

const slug = str => str.replace(/\s+/g, '-').toLowerCase();

const CategoryGridPage = () => {
  const { category } = useParams();

  const categoryData = CATEGORIES.find(c => slug(c.name) === category);

  const categoryLabel = category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  useSEO({
    title: `React Bytes - ${categoryLabel}`,
    description: `Browse all ${categoryLabel} components — interactive animated React components with live previews, props tables, and copy-paste code.`,
    path: `/${category}`,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: categoryLabel, path: `/${category}` }
    ]
  });

  // "Get Started" is a docs section, not a component grid — send it to its own page.
  if (categoryData?.name === 'Get Started') {
    return <Navigate to="/get-started/introduction" replace />;
  }

  if (!categoryData) {
    return (
      <div style={{ color: '#8a8a9a', marginTop: '4rem', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>404</p>
        <p style={{ marginTop: '8px' }}>
          No category found for <code style={{ color: '#a855f7' }}>{category}</code>
        </p>
      </div>
    );
  }

  const items = categoryData.subcategories
    .map(sub => ({
      name: sub,
      category: categoryData.name,
      path: `/${category}/${slug(sub)}`,
      videoKey: `${category}/${slug(sub)}`
    }))
    // NEW components float to the top; once the NEW tag is removed
    // (i.e. no longer in the NEW list), the item settles back into its
    // original place since the sort is stable.
    .sort((a, b) => (NEW.includes(b.name) ? 1 : 0) - (NEW.includes(a.name) ? 1 : 0));

  return (
    <div className="md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto sm:px-6 text-(--text-primary) flex flex-col overflow-hidden">
      <div className="flex flex-col gap-1 mb-6 sm:mb-8 min-w-0">
        <h1 className="title-two shrink-0">{categoryData.name}</h1>
        <p className="text-sm text-(--text-muted)">
          {items.length} component{items.length === 1 ? '' : 's'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-24 gap-2 text-center">
          <p className="text-(--text-primary)">No components in this category yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map(item => (
            <LazyRender key={item.videoKey}>
              <ComponentCard item={item} />
            </LazyRender>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryGridPage;