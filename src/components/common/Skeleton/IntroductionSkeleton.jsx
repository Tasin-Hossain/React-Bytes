const Bone = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-(--bg-white)/10 ${className}`} />
);

export function IntroductionSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6">

      {/* Header */}
      <div className="mb-10">
        {/* "Get Started" label */}
        <Bone className="w-24 h-3 rounded mb-3" />
        {/* h1 title */}
        <Bone className="w-52 h-9 rounded-md mb-4" />
        {/* 3 paragraphs */}
        {[
          ["w-full", "w-5/6", "w-4/6"],
          ["w-full", "w-3/4"],
          ["w-full", "w-5/6", "w-2/3"],
          ["w-3/4"],
        ].map((lines, pi) => (
          <div key={pi} className="flex flex-col gap-2 mb-4">
            {lines.map((w, i) => (
              <Bone key={i} className={`h-4 rounded ${w}`} />
            ))}
          </div>
        ))}
      </div>

      {/* Goal section */}
      <section className="mb-10">
        {/* h2 */}
        <Bone className="w-20 h-7 rounded-md mb-4" />
        {/* paragraph */}
        <div className="flex flex-col gap-2 mb-4">
          {["w-full", "w-5/6", "w-4/5"].map((w, i) => (
            <Bone key={i} className={`h-4 rounded ${w}`} />
          ))}
        </div>
        {/* bullet list — 4 items */}
        <div className="space-y-3">
          {[
            { label: "w-20", text: "w-3/4" },
            { label: "w-28", text: "w-2/3" },
            { label: "w-24", text: "w-4/5" },
            { label: "w-32", text: "w-3/5" },
          ].map(({ label, text }, i) => (
            <div key={i} className="flex items-center gap-3">
              {/* dot */}
              <Bone className="w-1.5 h-1.5 rounded-full shrink-0" />
              {/* bold label */}
              <Bone className={`h-3.5 rounded ${label}`} />
              {/* muted text */}
              <Bone className={`h-3.5 rounded ${text}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Contributing section */}
      <section className="mb-10">
        {/* h2 */}
        <Bone className="w-36 h-7 rounded-md mb-3" />
        {/* paragraph */}
        <div className="flex flex-col gap-2">
          {["w-full", "w-5/6", "w-4/6"].map((w, i) => (
            <Bone key={i} className={`h-4 rounded ${w}`} />
          ))}
        </div>
      </section>

      {/* Next step card */}
      <div className="rounded-md border border-(--border-secondary) bg-(--bg-card) p-6 flex items-center justify-between gap-4">
        <div>
          <Bone className="w-10 h-3 rounded mb-2" />
          <Bone className="w-24 h-5 rounded" />
        </div>
        <Bone className="w-32 h-9 rounded-md" />
      </div>

    </div>
  );
}