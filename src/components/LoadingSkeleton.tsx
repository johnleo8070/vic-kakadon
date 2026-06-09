export function ProductCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-2">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl bg-gray-200 aspect-square animate-pulse" />
  );
}

export function TextSkeleton({ lines = 3, width = "full" }: { lines?: number; width?: string }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 rounded ${
            i === lines - 1 ? `w-2/3 ${width}` : `w-${width}`
          }`}
        />
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-gray-200 rounded-lg" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-lg" />
      ))}
    </div>
  );
}
