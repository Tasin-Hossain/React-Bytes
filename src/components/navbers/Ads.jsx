const Ads = () => {
  return (
    <aside className="hidden xl:flex flex-col gap-4 w-(--right-panel-width) shrink-0">
      {/* Sponsor card */}
      <div className="sticky top-20.25 flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-(--text-muted)">Sponsored</p>

        <div
          className="rounded-xl border border-(--border-secondary) bg-(--bg-card)
        p-4 flex flex-col gap-3 hover:border-(--border-primary) transition-colors duration-200"
        >
          {/* logo placeholder */}
          <div className="w-8 h-8 rounded-lg bg-white/10" />
          <div>
            <p className="text-[13px] font-semibold text-(--text-primary) mb-1">Your Ad Here</p>
            <p className="text-[12px] text-(--text-muted) leading-relaxed">
              Reach thousands of React developers every day.
            </p>
          </div>
          <a href="#" className="text-[12px] font-semibold text-(--brand) hover:underline">
            Learn more →
          </a>
        </div>

        {/* second small card */}
        <div
          className="rounded-xl border border-(--border-secondary) bg-(--bg-card)
        p-4 flex flex-col gap-2 hover:border-(--border-primary) transition-colors duration-200"
        >
          <div className="w-8 h-8 rounded-lg bg-white/10" />
          <p className="text-[13px] font-semibold text-(--text-primary)">Another Sponsor</p>
          <p className="text-[12px] text-(--text-muted) leading-relaxed">Short sponsor description goes here.</p>
          <a href="#" className="text-[12px] font-semibold text-(--brand) hover:underline">
            Visit →
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Ads;
