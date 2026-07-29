// constants/Templates.js
//
// Data source for the "Templates" section (full website templates — free or
// paid — as opposed to the copy-paste components in the rest of the site).
//
// To add a new template, just push a new object into TEMPLATES below.
//
// Fields:
//   id            unique slug, used in the URL: /templates/:id
//   name          display name
//   tagline       one-line summary shown on the grid card
//   description   longer description shown on the detail page (supports \n\n for paragraphs)
//   category      short tag, e.g. "SaaS", "Portfolio", "E-commerce"
//   price         { type: 'free' | 'paid', amount?: string }  amount only needed when type is 'paid', e.g. "$29"
//   techStack     array of strings, e.g. ['React', 'Tailwind CSS']
//   thumbnail     preview image shown on the card + top of the detail page (fallback if no previewVideo)
//   previewVideo  optional .mp4 — if present, it's used instead of the thumbnail and autoplays on hover/detail page
//   liveUrl       link opened by the "Live Preview" button (new tab)
//   codeUrl       link opened by the "Get Code" button (new tab) — GitHub repo, gumroad/lemonsqueezy page, etc.
//   isNew         optional — shows a "New" badge on the card

export const TEMPLATES = [
  // {
  //   id: 'nova-saas-landing',
  //   name: 'Nova SaaS Landing',
  //   tagline: 'Clean, conversion-focused landing page for SaaS products.',
  //   description:
  //     'Nova is a modern SaaS landing page template built with React and Tailwind CSS. It ships with a hero section, feature grid, pricing table, testimonials, FAQ accordion and a footer — all fully responsive and ready to customize.\n\nPerfect for product launches, startups, and indie hackers who want a polished site without starting from scratch.',
  //   category: 'SaaS',
  //   price: { type: 'paid', amount: '$29' },
  //   techStack: ['React', 'Tailwind CSS', 'Framer Motion'],
  //   thumbnail: 'https://placehold.co/1200x750/141018/a855f7?text=Nova+SaaS+Landing&font=raleway',
  //   previewVideo: '',
  //   liveUrl: 'https://example.com/templates/nova-saas-landing',
  //   codeUrl: 'https://example.com/templates/nova-saas-landing/buy',
  //   isNew: true
  // },
  {
    id: 'minecraft-survival',
    name: 'Minecraft Survival',
    tagline: 'Frontend landing site for a Minecraft survival server community.',
    description:
      'BDZONE is a complete Minecraft server website, not just a hero section — a pixel-art homepage, a store with ranks/crates/currency and top-donator tabs, a voting hub with leaderboards and a player-search wall of fame, a staff roster, a news blog with detail pages, and Microsoft/Xbox sign-in with a live cart.\n\nBuilt on plain React + React Router + Tailwind, with a custom pixel-bordered UI kit (PixelBox, PixelButton, PixelPanel) and a parallax pixel-art hero — no animation libraries required. Every list (game modes, reasons, staff, nav links, store tabs) is config-driven from a single data file, so re-skinning it for another server is mostly swapping data and assets.',
    category: 'Gaming',
    price: { type: 'free' },
    techStack: ['React', 'React Router', 'Tailwind CSS', 'Lucide Icons'],
    thumbnail: 'https://placehold.co/1200x750/141018/60a5fa?text=Minecraft+Survival&font=raleway',
    previewVideo: '/videos/minecraft-survival.mp4',
    liveUrl: 'https://minecraft-01.vercel.app/',
    codeUrl: 'https://github.com/Tasin-Hossain/Minecraft-01',
    isNew: true,
    specialFeatures: [
      'Parallax pixel-art hero with animated sea, foreground, and drifting bee layers',
      'One-tap server IP copy with clipboard-API and legacy execCommand fallback',
      'Custom pixel-bordered UI kit (PixelBox, PixelButton, PixelPanel) with tone variants',
      'Cart with live item-count badge via a shared cart context',
      'Microsoft/Xbox sign-in flow with post-login redirect',
      'Config-driven nav, game modes, reasons, and footer columns — edit one data file, not the components',
      'Fully responsive with a mobile slide-out nav panel',
      'Per-page SEO: dynamic title, meta description, canonical URL, and Open Graph/Twitter tags',
      'Auto-generated sitemap.xml build script',
      'Custom pixel fonts (Minecraftia + bundled primary typeface)'
    ],
    includedSections: [
      'Sticky pixel-bordered header with mobile hamburger nav and live cart badge',
      'Hero with layered pixel-art parallax background and copy-IP call to action',
      '"Why Play" reasons strip — eight scrollable cards on server reliability and community',
      'Game modes grid (Survival, PvP Arena, Minigames, Skyblock) with per-mode perk lists',
      'Latest news teaser pulling the three newest posts from the blog data source',
      'How to Join guide — four-step walkthrough plus Java/Bedrock address copy cards',
      'Store page: overview stats and tabbed Ranks, Crates, Currency Packs, and Top Donators',
      'Vote page: voting sites list, rewards, leaderboards, wall of fame, and player search',
      'Staff page: tiered roster (Owner, Admin, Moderator, Helper) with Discord links and online status',
      'Full news listing and single-post detail pages',
      'Cart page for reviewing added items before checkout',
      'Sign-in page with Microsoft/Xbox authentication',
      'Footer with social links and grouped Product/Company link columns'
    ]
  }
];

export const getTemplateById = id => TEMPLATES.find(t => t.id === id);
