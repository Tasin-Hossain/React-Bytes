// components/shared/LazyRender.jsx
import { useEffect, useRef, useState } from 'react';

const LazyRender = ({ children, height = 220, rootMargin = '200px' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : height }}>
      {visible ? children : null}
    </div>
  );
};

export default LazyRender;