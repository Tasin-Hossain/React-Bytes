// pages/TemplateDetailPage.jsx
import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import {
  RiArrowLeftLine,
  RiArrowRightUpLine,
  RiCodeSSlashLine,
  RiCheckLine
} from 'react-icons/ri';
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

// A checklist row shared by "Special Features" and "Included Sections" —
// a check-mark reads as "this is in the box" rather than a neutral bullet.
const ChecklistItem = ({ children }) => (
  <li className="flex items-start gap-2.5 text-[14px] leading-[1.6] text-(--text-primary)">
    <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-(--brand)/12 text-(--brand)">
      <RiCheckLine size={12} strokeWidth={1} />
    </span>
    {children}
  </li>
);

// Developer-facing "spec sheet" — label / value rows in a monospace key,
// echoing a package.json or CLI printout rather than a marketing card.
const SpecRow = ({ label, children }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-(--border-secondary) last:border-b-0">
    <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-(--text-muted) pt-0.5">
      {label}
    </span>
    <span className="text-right text-sm text-(--text-primary)">{children}</span>
  </div>
);

const TemplateDetailPage = () => {
  const { slug } = useParams();
  const template = getTemplateById(slug);
  const [mediaLoaded, setMediaLoaded] = useState(false);

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
    <div className="md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto sm:px-6 text-(--text-primary) flex flex-col">
      {/* Back link */}
      <Link
        to="/templates"
        className="inline-flex items-center gap-1.5 text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors w-fit mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-secondary) rounded-sm"
      >
        <RiArrowLeftLine size={15} />
        Back to Templates
      </Link>

      {/* ── Big preview ─────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-(--border-secondary) bg-(--bg-card)">
        {!mediaLoaded && (
          <div className="absolute inset-0 aspect-video animate-pulse bg-gradient-to-br from-white/[0.03] via-white/[0.06] to-white/[0.03]" />
        )}
        {template.previewVideo ? (
          <video
            src={template.previewVideo}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setMediaLoaded(true)}
            className={`w-full h-auto max-h-[70vh] object-contain bg-black mx-auto transition-opacity duration-500 ${
              mediaLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <img
            src={template.thumbnail}
            alt={template.name}
            onLoad={() => setMediaLoaded(true)}
            className={`w-full h-auto aspect-video object-cover transition-opacity duration-500 ${
              mediaLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>

      {/* ── Full-width stack: title/CTAs/spec sheet first, then everything else ── */}
      <div className="mt-8">
        <div className="mb-10 w-full">
          <h1 className="title-two">{template.name}</h1>
          <p className="text-sm text-(--text-muted) mt-2">{template.tagline}</p>

          <div className="flex flex-row gap-2 mt-5">
            <a
              href={template.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/2 inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium text-white bg-(--brand) hover:opacity-90 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg)"
            >
              Live Preview
              <RiArrowRightUpLine size={16} />
            </a>
            <a
              href={template.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/2 inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium text-(--text-primary) border border-(--border-secondary) bg-(--bg-card) hover:bg-(--bg-hover) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-secondary)"
            >
              <RiCodeSSlashLine size={16} />
              {template.price.type === 'free' ? 'Get Code' : `Get Code — ${template.price.amount}`}
            </a>
          </div>

          {/* Spec sheet — signature element for a code-template product page */}
          <div className="mt-6 rounded-xl border border-(--border-secondary) bg-(--bg-card) px-4">
            <SpecRow label="Price">
              <PriceTag price={template.price} />
            </SpecRow>
            <SpecRow label="Category">{template.category}</SpecRow>
            <SpecRow label="Stack">
              <span className="inline-flex flex-wrap justify-end gap-1.5">
                {template.techStack.map(tech => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-0.5 rounded-md border border-(--border-secondary) text-(--text-muted)"
                  >
                    {tech}
                  </span>
                ))}
              </span>
            </SpecRow>
          </div>
        </div>

        {/* ── Main content ────────────────────────────────────────── */}
        <div className="min-w-0">
          {/* About this template */}
          <div className="w-full">
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

          {/* Special Features + Included Sections, side by side on larger screens */}
          {(template.specialFeatures?.length > 0 || template.includedSections?.length > 0) && (
            <div className="mt-8 w-full grid sm:grid-cols-2 gap-x-10 gap-y-8">
              {template.specialFeatures?.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-(--text-muted) mb-3">
                    Special Features
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {template.specialFeatures.map((feature, i) => (
                      <ChecklistItem key={i}>{feature}</ChecklistItem>
                    ))}
                  </ul>
                </div>
              )}

              {template.includedSections?.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-(--text-muted) mb-3">
                    Included Sections
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {template.includedSections.map((section, i) => (
                      <ChecklistItem key={i}>{section}</ChecklistItem>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ── More templates ────────────────────────────────────── */}
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
                    className="group relative rounded-2xl overflow-hidden border border-white/4 bg-(--bg-card) p-1.5 transition-all duration-200 hover:border-(--brand)/25 hover:-translate-y-0.5"
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
      </div>
    </div>
  );
};

export default TemplateDetailPage;
