import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { componentMap } from '../constants/componentMap';

import ComponentsSkeleton from '../components/common/Skeleton/ComponentsSkeleton';
import { IntroductionSkeleton } from '../components/common/Skeleton/IntroductionSkeleton';
import AllComponentsSkeleton from '../components/common/Skeleton/AllComponentsSkeleton';

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const key = `${category}/${subcategory}`;

  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPageTitle = () => {
    return subcategory
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const pageTitle = getPageTitle();

  useEffect(() => {
    document.title = `React Bytes - ${pageTitle}`;
    return () => {
      document.title = 'React Bytes — Free Animated React Components';
    };
  }, [pageTitle]);

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