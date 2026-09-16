// components/inventory/PreviewModal.jsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  RiCloseLine,
  RiExternalLinkLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiGlobalLine,
  RiLinkM,
  RiCheckLine
} from 'react-icons/ri';
import FlagIcon from '../ui/flag-icon';
import { getCountryCode } from '../../utils/inventoryUtils';

const StatBlock = ({ label, value, accent = false }) => (
  <div className="flex flex-col gap-1 rounded-lg border border-(--border-secondary) bg-(--bg-elevated) shadow-sm px-3.5 py-3">
    <span className="text-[11px] uppercase tracking-wide text-(--text-muted)">{label}</span>
    <span className={`text-lg font-semibold ${accent ? 'text-(--brand)' : 'text-(--text-primary)'}`}>
      {value}
    </span>
  </div>
);

const PricePill = ({ price }) => (
  <span className="inline-flex items-center rounded-lg border border-(--border-button) bg-(--bg-button) px-2 py-1 shadow-sm">
    <span className="text-[13px] font-semibold text-(--brand)">${price}</span>
  </span>
);

const PreviewModal = ({ site, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCopied(false);
  }, [site]);

  if (!site) return null;

  const initial = site.website.replace(/^www\./, '').charAt(0).toUpperCase();
  // Each site now carries its own explicit per-service pricing — no more
  // deriving these from generalPrice/greyPrice via a shared formula.
  const services = site.services ?? [];

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(site.website);
    } catch {
      // clipboard API might be unavailable — fail silently
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-999999 flex flex-col overflow-y-auto px-4 py-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal card */}
      <div
        className="relative m-auto w-full max-w-140 rounded-xl border border-(--border-secondary) bg-(--bg-card) shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-(--border-button) bg-(--bg-button) text-(--text-muted) transition-colors hover:text-(--text-primary) cursor-pointer"
          aria-label="Close preview"
        >
          <RiCloseLine size={18} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 px-6 pt-6 pb-5 border-b border-(--border-secondary)">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-(--brand) to-(--brand-2) text-lg font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[17px] font-semibold text-(--text-primary)">{site.website}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-(--text-muted)">
              <span className="flex items-center gap-1.5">
                <FlagIcon code={getCountryCode(site.country)} className="h-3 w-4.5 rounded-xs object-cover" />
                {site.country}
              </span>
              <span className="flex items-center gap-1">
                <RiGlobalLine size={13} /> {site.niche}
              </span>
              <span className="flex items-center gap-1">
                <RiTimeLine size={13} /> {site.tat}
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5 px-6 pt-5 sm:grid-cols-3">
          <StatBlock label="Moz DA" value={site.da} />
          <StatBlock label="Ahrefs DR" value={site.dr} />
          <StatBlock label="Traffic" value={site.traffic} />
          <StatBlock label="Max Dofollow" value={site.maxDofollow} />
          <StatBlock label="General Price" value={`$${site.generalPrice}`} accent />
          <StatBlock label="Grey Niche Price" value={`$${site.greyPrice}`} accent />
        </div>

        {/* Service prices table */}
        {services.length > 0 && (
          <div className="mx-6 mt-5 overflow-hidden rounded-lg border border-(--border-secondary) shadow-sm">
            <div className="border-b border-(--border-secondary) bg-(--bg-elevated) px-4 py-3">
              <span className="text-[13px] font-semibold text-(--text-primary)">Service prices</span>
            </div>

            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 px-4 pt-3 pb-1">
              <span className="text-[10.5px] uppercase tracking-wide text-(--text-primary)">Service</span>
              <span className="text-[10.5px] uppercase tracking-wide text-(--text-primary)">Regular niche</span>
              <span className="text-[10.5px] uppercase tracking-wide text-(--text-primary)">Gray niche</span>
            </div>

            <div>
              {services.map(s => (
                <div
                  key={s.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 border-t border-(--border-secondary) px-4 py-3"
                >
                  <span className="text-[13px] font-medium text-(--text-muted)">{s.label}</span>
                  <PricePill price={s.regular} />
                  <PricePill price={s.gray} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust note */}
        <div className="mx-6 shadow-sm mt-5 mb-2 flex items-start gap-2.5 rounded-lg border border-(--border-secondary) bg-(--bg-elevated) px-3.5 py-3 text-[12.5px] leading-relaxed text-(--text-muted)">
          <RiShieldCheckLine size={16} className="mt-0.5 shrink-0 text-(--brand)" />
          <span>
            Not fixed pricing, verified metrics. Publish time is typically <strong className="text-(--text-primary)">{site.tat.toLowerCase()}</strong> once
            content is approved.
          </span>
        </div>

        {/* Footer actions */}
        <div className="relative flex items-center gap-2.5 px-6 pb-6 pt-4">
          <a
            href={`https://${site.website.replace(/^www\./, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-none flex-1 justify-center gap-1.5"
          >
            <RiExternalLinkLine size={15} />
            Visit Website
          </a>
          <button
            onClick={handleCopy}
            className="btn flex items-center justify-center gap-1.5 flex-1"
            type="button"
          >
            {copied ? <RiCheckLine size={15} /> : <RiLinkM size={15} />}
            {copied ? 'Copied!' : 'Copy Domain'}
          </button>

          {/* Toast message */}
          <div
            className={`pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full rounded-md border border-(--border-secondary) bg-(--bg-elevated) px-3 py-1.5 text-[12px] text-(--text-primary) shadow-lg transition-all duration-200
              ${copied ? 'opacity-100 -translate-y-[calc(100%+8px)]' : 'opacity-0 -translate-y-full'}`}
          >
            ✓ Domain copied to clipboard
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PreviewModal;