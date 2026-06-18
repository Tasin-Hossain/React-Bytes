const reactBytesTheme = {
  plain: { color: 'var(--text-muted)', backgroundColor: 'transparent', fontWeight: '500' },
  styles: [
    // ── existing ──────────────────────────────────────────────
    { types: ['keyword', 'operator'],            style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['function'],                        style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['string', 'attr-value'],            style: { color: '#0d9488' } ,fontFamily:'var(--font-geist-mono)', fontWeight: '500'},
    { types: ['number', 'boolean'],               style: { color: 'var(--text-muted)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['comment'],                         style: { color: 'var(--text-muted)',fontFamily:'var(--font-geist-mono)', fontWeight: '500', fontStyle: 'italic' } },
    { types: ['class-name', 'maybe-class-name'],  style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['tag'],                             style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['attr-name'],                       style: { color: 'var(--text-primary)' ,fontFamily:'var(--font-geist-mono)', fontWeight: '500'} },
    { types: ['punctuation'],                     style: { color: 'var(--text-primary)' ,fontFamily:'var(--font-geist-mono)', fontWeight: '500'} },
    { types: ['parameter'],                       style: { color: '#0d9488' ,fontFamily:'var(--font-geist-mono)', fontWeight: '500'} },
    { types: ['property'],                        style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['constant', 'symbol'],              style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },

    // ── markup (html/xml/jsx) extras ─────────────────────────
    { types: ['prolog', 'doctype', 'cdata'],      style: { color: 'var(--text-muted)',fontFamily:'var(--font-geist-mono)', fontWeight: '500', fontStyle: 'italic' } },
    { types: ['namespace'],                       style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500', opacity: 0.7 } },
    { types: ['selector'],                        style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['entity'],                          style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500', cursor: 'help' } },
    { types: ['char'],                             style: { color: '#0d9488',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['builtin'],                          style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },

    // ── css extras ────────────────────────────────────────────
    { types: ['atrule'],                           style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['url'],                              style: { color: '#0d9488',fontFamily:'var(--font-geist-mono)', fontWeight: '500', textDecoration: 'underline' } },
    { types: ['unit'],                             style: { color: 'var(--text-muted)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },

    // ── js/ts/jsx extras ──────────────────────────────────────
    { types: ['regex'],                            style: { color: '#0d9488',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['important'],                        style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['variable'],                         style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['function-variable'],                style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['interpolation', 'template-string'], style: { color: '#0d9488',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['decorator', 'annotation'],          style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['module'],                           style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },

    // ── diff (added/removed lines) ───────────────────────────
    { types: ['inserted'],                         style: { color: '#16a34a',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['deleted'],                          style: { color: '#ef4444',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['unchanged'],                        style: { color: 'var(--text-muted)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['coord'],                             style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },

    // ── json/yaml extras ──────────────────────────────────────
    { types: ['key'],                              style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['null'],                              style: { color: 'var(--text-muted)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },

    // ── bash/shell extras ─────────────────────────────────────
    { types: ['shebang'],                          style: { color: 'var(--text-muted)',fontFamily:'var(--font-geist-mono)', fontWeight: '500', fontStyle: 'italic' } },

    // ── markdown extras ───────────────────────────────────────
    { types: ['title'],                            style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['bold'],                              style: { fontWeight: '500' } },
    { types: ['italic'],                            style: { fontWeight: '500', fontStyle: 'italic' } },
    { types: ['strike'],                            style: { color: 'var(--text-muted)',fontFamily:'var(--font-geist-mono)', fontWeight: '500', textDecoration: 'line-through' } },
    { types: ['list'],                              style: { color: 'var(--text-muted)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['code'],                              style: { color: '#0d9488',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['table'],                              style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['hr', 'blockquote'],                  style: { color: 'var(--text-muted)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },

    // ── css extras (pt 2) ─────────────────────────────────────
    { types: ['pseudo-class', 'pseudo-element'],   style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['hexcode'],                          style: { color: '#0d9488',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['value'],                            style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },

    // ── bash extras (pt 2) ────────────────────────────────────
    { types: ['environment'],                      style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },

    // ── rust / c / macro-style languages ─────────────────────
    { types: ['macro', 'macro-name'],              style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['lifetime'],                          style: { color: 'var(--text-muted)',fontFamily:'var(--font-geist-mono)', fontWeight: '500', fontStyle: 'italic' } },
    { types: ['attribute'],                         style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['directive', 'directive-hash'],      style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['expression'],                        style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },

    // ── oop / typed languages ──────────────────────────────────
    { types: ['method'],                            style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['field'],                              style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['generic-function'],                  style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['type'],                               style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },

    // ── misc structural ─────────────────────────────────────────
    { types: ['delimiter'],                          style: { color: 'var(--text-primary)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
    { types: ['escape'],                             style: { color: 'var(--brand)',fontFamily:'var(--font-geist-mono)', fontWeight: '500' } },
  ],
};

export default reactBytesTheme;