// pages/TemplateDetailPage.jsx
import { useParams, Link, Navigate } from 'react-router';
import { RiArrowLeftLine, RiArrowRightUpLine, RiCodeSSlashLine } from 'react-icons/ri';
import { TEMPLATES, getTemplateById } from '../constants/Templates';
import { useSEO } from '../hooks/useSEO';

const PriceTag = ({ price }) => {
  if (price.type === 'free') {
    return (
      <span className="shrink-0 font-mono text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md text-emerald-400 border border-emerald-400/40 bg-emerald-400/10">
        Free
      </span>
    );
  }
  return (
    <span className="shrink-0 font-mono text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md text-(--brand) border border-(--brand)/50 bg-(--brand)/15">
      {price.amount}
    </span>
  );
};

const TemplateDetailPage = () => {
  const { slug } = useParams();
  const template = getTemplateById(slug);

  useSEO({
    title: template ? `React Bytes - ${template.name}` : 'React Bytes - Templates',
    description: template?.tagline,
    path: template ? `/templates/${template.id}` : '/templates',
    breadcrumbs: template
      ? [
          { name: 'Home', path: '/' },
          { name: 'Templates', path: '/templates' },
          { name: template.name, path: `/templates/${template.id}` }
        ]
      : undefined
  });

  if (!template) {
    return <Navigate to="/templates" replace />;
  }

  const otherTemplates = TEMPLATES.filter(t => t.id !== template.id).slice(0, 3);

  return (
    <div className="md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto sm:px-6 text-(--text-primary) flex flex-col overflow-hidden">
      {/* Back link */}
      <Link
        to="/templates"
        className="inline-flex items-center gap-1.5 text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors w-fit mb-5"
      >
        <RiArrowLeftLine size={15} />
        Back to Templates
      </Link>

      {/* ── Big preview ─────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-(--border-secondary) bg-(--bg-card)">
        {template.previewVideo ? (
          <video
            src={template.previewVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto max-h-[70vh] object-contain bg-black mx-auto"
          />
        ) : (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-auto aspect-video object-cover"
          />
        )}
      </div>

      {/* ── Title row ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mt-6">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="title-two shrink-0">{template.name}</h1>
            <PriceTag price={template.price} />
          </div>
          <p className="text-sm text-(--text-muted)">{template.tagline}</p>
        </div>
      </div>

      {/* ── Action buttons ──────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mt-5">
        <a
          href={template.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium text-white bg-(--brand) hover:opacity-90 transition-opacity"
        >
          Live Preview
          <RiArrowRightUpLine size={16} />
        </a>
        <a
          href={template.codeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium text-(--text-primary) border border-(--border-secondary) bg-(--bg-card) hover:bg-(--bg-hover) transition-colors"
        >
          <RiCodeSSlashLine size={16} />
          {template.price.type === 'free' ? 'Get Code' : `Get Code — ${template.price.amount}`}
        </a>
      </div>

      {/* ── Tags ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mt-5">
        <span className="text-xs px-2.5 py-1 rounded-md border border-(--border-secondary) text-(--text-muted)">
          {template.category}
        </span>
        {template.techStack.map(tech => (
          <span
            key={tech}
            className="text-xs px-2.5 py-1 rounded-md border border-(--border-secondary) text-(--text-muted)"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* ── About this template ─────────────────────────────────── */}
      <div className="mt-8 max-w-3xl">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-(--text-muted) mb-3">
          About this template
        </h2>
        <div className="flex flex-col gap-3">
          {template.description.split('\n\n').map((para, i) => (
            <p key={i} className="text-[14px] leading-[1.75] text-(--text-secondary, var(--text-primary))">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* ── Special Features ────────────────────────────────────── */}
      {template.specialFeatures?.length > 0 && (
        <div className="mt-8 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-(--text-muted) mb-3">
            Special Features
          </h2>
          <ul className="flex flex-col gap-2">
            {template.specialFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.6] text-(--text-primary)">
                <span className="mt-2 size-1.25 rounded-full bg-(--brand) shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Included Sections ───────────────────────────────────── */}
      {template.includedSections?.length > 0 && (
        <div className="mt-8 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-(--text-muted) mb-3">
            Included Sections
          </h2>
          <ul className="flex flex-col gap-2">
            {template.includedSections.map((section, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.6] text-(--text-primary)">
                <span className="mt-2 size-1.25 rounded-full bg-(--brand) shrink-0" />
                {section}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── More templates ──────────────────────────────────────── */}
      {otherTemplates.length > 0 && (
        <div className="mt-12 mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-(--text-muted) mb-4">
            More templates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {otherTemplates.map(t => (
              <Link
                key={t.id}
                to={`/templates/${t.id}`}
                className="group relative rounded-2xl overflow-hidden border border-white/4 bg-(--bg-card) p-1.5 transition-colors duration-200 hover:border-white/10"
              >
                <div className="relative w-full overflow-hidden rounded-xl bg-(--bg)" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={t.thumbnail}
                    alt={t.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="px-2 pt-3 pb-1.5">
                  <p className="text-sm text-(--text-primary) truncate" style={{ fontWeight: 500 }}>
                    {t.name}
                  </p>
                  <p className="text-xs text-(--text-muted) mt-0.5 truncate">{t.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDetailPage;