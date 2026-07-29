// pages/TemplatesGridPage.jsx
import { TEMPLATES } from '../constants/Templates';
import TemplateCard from '../components/shared/Templates/TemplateCard';
import LazyRender from '../components/common/LazyRender';
import { useSEO } from '../hooks/useSEO';

const TemplatesGridPage = () => {
  useSEO({
    title: 'React Bytes - Templates',
    description:
      'Browse free and paid website templates — full React + Tailwind CSS templates with live previews and downloadable code.',
    path: '/templates',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Templates', path: '/templates' }
    ]
  });

  return (
    <div className="md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto sm:px-6 text-(--text-primary) flex flex-col overflow-hidden">
      <div className="flex flex-col gap-1 mb-6 sm:mb-8 min-w-0">
        <h1 className="title-two shrink-0">Templates</h1>
        <p className="text-sm text-(--text-muted)">
          {TEMPLATES.length} template{TEMPLATES.length === 1 ? '' : 's'} — free & paid, ready to preview and use
        </p>
      </div>

      {TEMPLATES.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-24 gap-2 text-center">
          <p className="text-(--text-primary)">No templates yet — check back soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {TEMPLATES.map(template => (
            <LazyRender key={template.id}>
              <TemplateCard template={template} />
            </LazyRender>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesGridPage;