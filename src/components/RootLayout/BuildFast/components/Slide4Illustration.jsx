import { FiMonitor, FiSmartphone, FiTablet } from 'react-icons/fi';
import '../BuildFast.css';

export function Slide4Illustration({ animKey }) {
  return (
    <div
      key={animKey}
      className="illus-enter relative md:flex md:flex-col items-center justify-center gap-4.5 h-48 md:h-full w-full overflow-hidden px-3 py-4 md:py-0"
    >
      {/* overflow-x hidden on wrapper so shrinking browser doesn't cause scroll */}
      <div className="flex items-center justify-center w-full overflow-hidden">
        <div className="s4-browser bg-(--bg) rounded-md border border-(--border-secondary) p-3.5 flex flex-col gap-3 overflow-hidden">

          {/* Browser Header */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-(--bg-white)/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-(--bg-white)/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-(--bg-white)/10" />
            </div>
            <div className="flex-1 mx-3 h-4 rounded bg-(--bg-white)/6 border border-(--border-secondary)" />
          </div>

          {/* Hero */}
          <div className="s4-hero flex flex-col items-center gap-2 py-4 border-b border-(--border-secondary)">
            <div className="s4-bar-1 relative h-2 rounded-full bg-(--bg-white)/[0.07] overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-(--bg-white)/30 build-bar-1" />
            </div>
            <div className="s4-bar-2 relative h-1.5 rounded-full bg-(--bg-white)/[0.07] overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-(--bg-white)/15 build-bar-2" />
            </div>
            <div className="s4-btn-wrap relative rounded-full bg-(--bg-white)/6 overflow-hidden mt-1.5">
              <div className="absolute inset-0 rounded-full bg-(--bg-white)/10 build-btn" />
            </div>
          </div>

          {/* Cards */}
          <div className="s4-cards">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={`build-card-${i} s4-card bg-(--bg-white)/4 border border-(--border-secondary) rounded-lg flex flex-col justify-end p-1.5 gap-1`}
              >
                <div className="w-full h-1 rounded-full bg-(--bg-white)/10" />
                <div className="w-3/5 h-1 rounded-full bg-(--bg-white)/[0.07]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device icon */}
      <div className="s4-label-wrap relative h-6 w-20">
        <div className="s4-lbl s4-lbl-desktop absolute left-1/2 -translate-x-1/2">
          <FiMonitor size={50} className="text-(--text-white)/25" />
        </div>
        <div className="s4-lbl s4-lbl-tablet absolute left-1/2 -translate-x-1/2">
          <FiTablet size={30} className="text-(--text-white)/25" />
        </div>
        <div className="s4-lbl s4-lbl-mobile absolute left-1/2 -translate-x-1/2">
          <FiSmartphone size={30} className="text-(--text-white)/25" />
        </div>
      </div>
    </div>
  );
}
