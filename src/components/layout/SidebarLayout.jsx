import { useState } from 'react';
import Ads from '../navbers/Ads';
import Header from '../navbers/Header';
import Sidebar from '../navbers/Sidebar';
import PromoCard from '../navbers/PromoCard';

export function SidebarLayout({ children, showSponsors = true }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main className="bg-(--bg) min-h-screen">
      <Header onMenuClick={() => setDrawerOpen(prev => !prev)} />

      <div className="flex pt-14.25">
        {/* Left sidebar */}
        <Sidebar isDrawerOpen={drawerOpen} onDrawerClose={() => setDrawerOpen(false)} />

        {/* Main content — fills all remaining space when ads hidden */}
        <div
          className={`
          flex-1 min-w-0
          md:ml-[calc(var(--sidebar-width)+2rem)]
          px-4 md:px-4
          py-8
          ${showSponsors ? 'xl:mr-[calc(var(--right-panel-width)+1.5rem)]' : ''}
        `}
        >
          {children}
        </div>

        {/* Right side (sponsor) — fixed, only xl+ */}
        {showSponsors && (
          <div
            className="hidden xl:flex flex-col shrink-0 w-(--right-panel-width)
              fixed right-6 top-14.25 h-[calc(100vh-57px)] overflow-y-auto py-6 gap-4"
          >
            <PromoCard
              badgeText="ReactBytes"
              title="Get verified guest posts across 100+ sites."
              description="Instant placements, fixed pricing"
              stats={['100+ Sites · 12 Countries', 'Fixed Pricing · Instant TAT']}
              buttonText="Browse All Sites"
              buttonHref="/insert-your-post"
            />
            <Ads />
          </div>
        )}
      </div>
    </main>
  );
}

export default SidebarLayout;
