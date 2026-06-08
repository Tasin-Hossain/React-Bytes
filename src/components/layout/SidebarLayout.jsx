import Ads from '../navbers/Ads';
import Header from '../navbers/Header';
import Sidebar from '../navbers/Sidebar';

export function SidebarLayout({ children }) {
  return (
    <main className="bg-(--bg) min-h-screen">
      <Header />

      <div className="flex pt-14.25">

        {/* Left sidebar */}
        <Sidebar onSearchOpen={() => {}} />

        {/* Main content — fills all remaining space when ads hidden */}
        <div className="
          flex-1 min-w-0
          md:ml-[calc(var(--sidebar-width)+2rem)]
          px-4 md:px-4
          py-8
          xl:mr-[calc(var(--right-panel-width)+1.5rem)]
        ">
          {children}
        </div>

        {/* Right side (sponsor) — fixed, only xl+ */}
        <div className="hidden xl:block shrink-0 w-(--right-panel-width)
          fixed right-6 top-14.25 h-[calc(100vh-57px)] overflow-y-auto py-6">
          <Ads />
        </div>

      </div>
    </main>
  );
}

export default SidebarLayout;
