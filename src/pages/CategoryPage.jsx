import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { componentMap } from '../constants/componentMap';
import { componentMetadata } from '../constants/Information';


import ComponentsSkeleton from '../components/common/Skeleton/ComponentsSkeleton';
import { IntroductionSkeleton } from '../components/common/Skeleton/IntroductionSkeleton';
import AllComponentsSkeleton from '../components/common/Skeleton/AllComponentsSkeleton';
import { useSEO } from '../hooks/useSEO';

const toMetaKey = (category, subcategory) => {
  const cat = category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  const sub = subcategory
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return `${cat}/${sub}`;
};

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const key = `${category}/${subcategory}`;

  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  const pageTitle = subcategory
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const isDoc = subcategory === 'introduction' || subcategory === 'installation';
  const seoTitle = `React Bytes - ${pageTitle}`;

  let seoDescription;
  if (isDoc) {
    seoDescription = `${pageTitle} — Learn how to get started with React Bytes component library.`;
  } else {
    const metaKey = toMetaKey(category, subcategory);
    const meta = componentMetadata[metaKey];
    seoDescription = meta?.description ?? `${pageTitle} — Interactive animated React component with live preview, props table, and copy-paste code.`;
  }

  const categoryLabel = category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  useSEO({
    title: seoTitle,
    description: seoDescription,
    path: `/${category}/${subcategory}`,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: categoryLabel, path: `/${category}` },
      { name: pageTitle, path: `/${category}/${subcategory}` }
    ]
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setComponent(null);

    const loader = componentMap[key];

    if (!loader) {
      setLoading(false);
      return;
    }

    loader()
      .then(mod => setComponent(() => mod.default))
      .finally(() => setLoading(false));
  }, [key]);

  if (loading) {
    const isDocPage = subcategory === 'introduction' || subcategory === 'installation';
    const isAllComponents = subcategory === 'all-components';
    if (isAllComponents) return <AllComponentsSkeleton />;
    return isDocPage ? <IntroductionSkeleton /> : <ComponentsSkeleton />;
  }

  if (!Component) {
    return (
      <div style={{ color: '#8a8a9a', marginTop: '4rem', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>404</p>
        <p style={{ marginTop: '8px' }}>
          No component found for <code style={{ color: '#a855f7' }}>{key}</code>
        </p>
      </div>
    );
  }

  return <Component />;
};

export default CategoryPage;