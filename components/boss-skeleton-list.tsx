"use client"

export function BossSkeletonList() {
  return (
    <div className="flex flex-col space-y-4 w-full">
      {/* Skeleton header */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-32 bg-muted rounded-md animate-pulse" />
        <div className="h-8 w-16 bg-muted rounded-md animate-pulse" />
      </div>

      {/* Skeleton search input */}
      <div className="h-10 w-full bg-muted rounded-md animate-pulse mb-4" />

      {/* Skeleton progress bar */}
      <div className="h-6 w-full bg-muted rounded-full animate-pulse mb-4" />

      {/* Skeleton boss list items */}
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 p-2 rounded-md bg-muted animate-pulse"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="h-8 w-8 rounded-full bg-card" />
          <div className="h-5 w-full bg-card rounded-md" />
        </div>
      ))}
    </div>
  )
}
