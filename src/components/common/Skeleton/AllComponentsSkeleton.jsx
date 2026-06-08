const Bone = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-(--bg-white)/10 ${className}`} />
);

const CardSkeleton = () => (
  <div className="rounded-md border border-(--border-secondary) bg-(--bg-card) overflow-hidden">
    {/* video/thumbnail area */}
    <div className="w-full aspect-4/3 bg-(--bg-white)/5 animate-pulse" />
    {/* card body */}
    <div className="px-3.5 py-3 flex flex-col gap-2">
      <Bone className="w-3/4 h-4 rounded" />
      <Bone className="w-1/3 h-3 rounded" />
    </div>
  </div>
);

const AllComponentsSkeleton = () => {
  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col">

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        {/* title */}
        <Bone className="w-48 h-8 rounded-md" />

        {/* search + dropdown row */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Bone className="w-full sm:w-64 h-9 rounded-md" />
          <Bone className="w-36 h-9 rounded-md shrink-0" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

    </div>
  );
};

export default AllComponentsSkeleton;
