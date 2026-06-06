// ─── Skeleton pulse atom ──────────────────────────────────────────────────────
const Bone = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-(--bg-white)/10 ${className}`} />
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export default function ComponentsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto  text-(--text-white)">

      {/* ── Title row ── */}
      <div className="flex justify-between items-center mb-5">
        <Bone className="w-48 h-10 rounded-md" />
        <div className="flex gap-2">
          <Bone className="w-9 h-9 rounded-md" />
          <Bone className="w-28 h-9 rounded-md" />
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-1 mb-5">
        <Bone className="w-24 h-9 rounded-md" />
        <Bone className="w-20 h-9 rounded-md" />
      </div>

      {/* ── Preview panel ── */}
      <Bone className="w-full h-44 rounded-xl mb-4" />

      {/* ── Customize section ── */}
      <div className="flex flex-col gap-2.5 mb-8">
        <Bone className="w-24 h-3 rounded" />
        <div className="grid grid-cols-3 gap-2.5">
          <Bone className="h-10 rounded-md" />
          <Bone className="h-10 rounded-md" />
          <Bone className="h-10 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Bone className="h-10 rounded-md" />
          <Bone className="h-10 rounded-md" />
        </div>
      </div>

      {/* ── Props heading ── */}
      <Bone className="w-20 h-7 rounded-md mb-4" />

      {/* ── Props table ── */}
      <div className="rounded-md border border-(--border-secondary) overflow-hidden mb-8">
        {/* header */}
        <div className="grid gap-3 px-4 py-2.5 border-b border-(--border-secondary) bg-(--bg-white)/5"
          style={{ gridTemplateColumns: "1.2fr 0.8fr 1.1fr 2fr" }}>
          {[20, 14, 18, 30].map((w, i) => (
            <Bone key={i} className={`h-3 rounded w-${w}`} />
          ))}
        </div>
        {/* rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`grid gap-3 px-4 py-2.5 ${i < 7 ? "border-b border-(--border-secondary)" : ""} ${i % 2 ? "bg-(--bg-white)/1.5" : ""}`}
            style={{ gridTemplateColumns: "1.2fr 0.8fr 1.1fr 2fr" }}
          >
            <Bone className="h-5 rounded w-3/4" />
            <Bone className="h-3 rounded w-12" />
            <Bone className="h-5 rounded w-4/5" />
            <Bone className="h-3 rounded w-2/3" />
          </div>
        ))}
      </div>

      {/* ── Dependencies ── */}
      <Bone className="w-32 h-7 rounded-md mb-3" />
      <div className="flex gap-2">
        <Bone className="w-16 h-7 rounded-md" />
        <Bone className="w-28 h-7 rounded-md" />
      </div>

    </div>
  );
}
