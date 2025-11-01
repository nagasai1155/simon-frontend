import { Skeleton } from "@/components/ui/skeleton"

export default function SubAccountsLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Skeleton className="h-8 w-48 mb-1" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-9 w-40" />
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Sub-Accounts Table */}
          <div className="theme-card overflow-hidden mb-8">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/50">
              <Skeleton className="h-4 w-20 col-span-3" />
              <Skeleton className="h-4 w-16 col-span-2" />
              <Skeleton className="h-4 w-16 col-span-2" />
              <Skeleton className="h-4 w-16 col-span-1" />
              <Skeleton className="h-4 w-24 col-span-3" />
              <Skeleton className="h-4 w-16 col-span-1" />
            </div>

            {/* Table Body */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0">
                <div className="col-span-3 flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="col-span-2 flex items-center">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="col-span-2 flex items-center">
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="col-span-1 flex items-center">
                  <Skeleton className="h-5 w-8" />
                </div>
                <div className="col-span-3 flex items-center">
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>

          {/* Credit Usage Summary */}
          <div className="mb-8">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="theme-card p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
