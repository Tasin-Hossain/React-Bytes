import Ads from '../navbers/Ads';
import Header from '../navbers/Header';
import Sidebar from '../navbers/Sidebar';



export function SidebarLayout({ children }) {
  return (
    <main className="bg-(--bg) min-h-screen">
      <Header />

      {/* 3-col wrapper — starts below fixed header (57px) */}
      <div className="flex pt-14.25">

        {/* ── Left sidebar (fixed inside Sidebar component) */}
        <Sidebar onSearchOpen={() => {}} />

        {/* ── Main content */}
        <div className="
          flex-1 min-w-0
          md:ml-[calc(var(--sidebar-width)+2rem)]
          xl:mr-[calc(var(--right-panel-width)+2rem)]
          px-4 md:px-8
          py-8
        ">
          {children}
        </div>

        {/* ── Right side (sponsor) */}
        <div className="hidden xl:block shrink-0 w-(--right-panel-width)
          fixed right-6 top-14.25 h-[calc(100vh-57px)] overflow-y-auto py-6">
          <Ads />
        </div>

      </div>
    </main>
  );
}

export default SidebarLayout;
