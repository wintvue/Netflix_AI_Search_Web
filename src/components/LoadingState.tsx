"use client";

interface SearchSkeletonProps {
  showAiOverview?: boolean;
}

export function SearchSkeleton({ showAiOverview = false }: SearchSkeletonProps) {
  return (
    <div className="animate-pulse space-y-8">
      {/* AI Overview Skeleton - only show if AI overview is enabled */}
      {showAiOverview && (
        <div className="bg-[#1a1a1a] rounded p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-zinc-800 rounded" />
            <div>
              <div className="h-4 w-24 bg-zinc-800 rounded" />
              <div className="h-3 w-32 bg-zinc-800 rounded mt-1" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-800 rounded w-4/5" />
            <div className="h-4 bg-zinc-800 rounded w-3/5" />
          </div>
        </div>
      )}

      {/* Movie Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 rounded overflow-hidden">
            <div className="aspect-[2/3] bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="bg-zinc-900 rounded overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-zinc-800" />
    </div>
  );
}

export function AIOverviewSkeleton() {
  return (
    <div className="bg-[#1a1a1a] rounded p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-zinc-800 rounded" />
        <div>
          <div className="h-4 w-24 bg-zinc-800 rounded" />
          <div className="h-3 w-32 bg-zinc-800 rounded mt-1" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-zinc-800 rounded w-full" />
        <div className="h-4 bg-zinc-800 rounded w-4/5" />
        <div className="h-4 bg-zinc-800 rounded w-3/5" />
      </div>
    </div>
  );
}

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-[#E50914] border-t-transparent rounded-full animate-spin`}
    />
  );
}
