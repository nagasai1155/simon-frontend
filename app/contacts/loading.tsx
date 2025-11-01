import { Skeleton } from "@/components/ui/skeleton"

export default function ContactsLoading() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar skeleton */}
      <div className="w-56 h-full bg-card border-r border-border">
        <div className="p-4">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="px-2 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Filters skeleton */}
          <div className="border rounded-lg p-6">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="border rounded-lg">
            <div className="p-6 border-b">
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
