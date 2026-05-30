import '../BuildFast.css';

export function Slide1Illustration({ animKey }) {
  return (
    <div key={animKey} className="illus-enter relative flex items-center justify-center h-50 md:h-full w-full px-3">
      {/* browser card — full width on mobile, fixed on desktop */}
      <div className="w-full overflow-hidden h-40 max-w-65 sm:max-w-[320px] md:w-100 md:max-w-none md:h-70 bg-(--bg) rounded-md border border-(--border-secondary) p-3.5 flex flex-col gap-3 shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-(--bg-white)/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-(--bg-white)/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-(--bg-white)/10" />
          </div>
          <div className="flex-1 mx-3 h-4 rounded bg-(--bg-white)/6 border border-(--border-secondary)" />
        </div>

        {/* Hero skeleton */}
        <div className="flex flex-col items-center gap-2 py-4 border-b border-(--border-secondary)">
          <div className="relative w-32 h-2 rounded-full bg-(--bg-white)/[0.07] overflow-hidden">
            <div className="absolute inset-0 rounded-full bg-(--bg-white)/30 build-bar-1" />
          </div>
          <div className="relative w-24 h-1.5 rounded-full bg-(--bg-white)/[0.07] overflow-hidden">
            <div className="absolute inset-0 rounded-full bg-(--bg-white)/15 build-bar-2" />
          </div>
          <div className="relative w-20 h-6 rounded-full bg-(--bg-white)/6 overflow-hidden mt-1.5">
            <div className="absolute inset-0 rounded-full bg-(--bg-white)/10 build-btn" />
          </div>
        </div>

        {/* Cards row 1 */}
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`build-card-${i} flex-1 h-12 bg-(--bg-white)/4 border border-(--border-secondary) rounded-lg flex flex-col justify-end p-1.5 gap-1`}
            >
              <div className="w-full h-1 rounded-full bg-(--bg-white)/10" />
              <div className="w-3/5 h-1 rounded-full bg-(--bg-white)/[0.07]" />
            </div>
          ))}
        </div>

        {/* Cards row 2 */}
        <div className="flex gap-2">
          {[3, 4, 5].map(i => (
            <div
              key={i}
              className={`build-card-${i} flex-1 h-12 bg-(--bg-white)/4 border border-(--border-secondary) rounded-lg flex flex-col justify-end p-1.5 gap-1`}
            >
              <div className="w-full h-1 rounded-full bg-(--bg-white)/10" />
              <div className="w-3/5 h-1 rounded-full bg-(--bg-white)/[0.07]" />
            </div>
          ))}
        </div>
      </div>

      {/* Check badge */}
      <div className="build-check absolute bottom-3 right-2 md:bottom-6 md:right-7 w-6 h-6 md:w-8 md:h-8 rounded-full bg-(--bg-white)/50 flex items-center justify-center shadow-lg">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7L5.5 10.5L11.5 3.5" stroke="var(--bg)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
