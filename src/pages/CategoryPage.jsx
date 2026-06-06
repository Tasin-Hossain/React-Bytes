import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { componentMap } from '../constants/componentMap';
// import { LoaderDemo } from '../components/common/Loader/Loader';

import ComponentsSkeleton from '../components/common/Loader/Skeletons';

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const key = `${category}/${subcategory}`;

  const [Component, setComponent] = useState(null);
  const [loading, setLoading]     = useState(true);

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
      .then((mod) => setComponent(() => mod.default))
      .finally(() => setLoading(false));
  }, [key]);

  if (loading) {
    return (
      <ComponentsSkeleton/>
    );
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
