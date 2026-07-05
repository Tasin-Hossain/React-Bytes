import { useEffect } from 'react';
import { DOMAIN_URL } from '../constants/site';


const DEFAULT_IMAGE = `${DOMAIN_URL}/og-image.png`;

const setMeta = (attr, key, content) => {
  if (!content) return;
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const setCanonical = (href) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const setJsonLd = (id, data) => {
  let script = document.getElementById(id);
  if (!data) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

/**
 * Manually syncs document head tags for the current route.
 * Call once per page/route component.
 *
 * @param {Object} opts
 * @param {string} opts.title       Full page title (already includes "React Bytes -")
 * @param {string} opts.description Meta description (~150-160 chars ideal)
 * @param {string} [opts.path]      Route path e.g. "/text-animations/curtain-text". Defaults to current location.
 * @param {string} [opts.image]     Absolute OG image URL. Defaults to site-wide og-image.png
 * @param {boolean} [opts.noindex]  Set true for pages that shouldn't be indexed
 * @param {Array<{name: string, path: string}>} [opts.breadcrumbs] Breadcrumb trail for BreadcrumbList schema
 */
export const useSEO = ({ title, description, path, image = DEFAULT_IMAGE, noindex = false, breadcrumbs }) => {
  useEffect(() => {
    const url = `${DEFAULT_IMAGE}${path ?? window.location.pathname}`;

    if (title) document.title = title;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:url', url);

    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    setCanonical(url);

    if (breadcrumbs?.length) {
      setJsonLd('breadcrumb-jsonld', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: `${DEFAULT_IMAGE}${crumb.path}`
        }))
      });
    } else {
      setJsonLd('breadcrumb-jsonld', null);
    }
  }, [title, description, path, image, noindex, breadcrumbs]);
};