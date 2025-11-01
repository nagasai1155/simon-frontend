import { Skeleton } from "@/components/ui/skeleton"

export default function IntegrationsLoading() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Available Integrations */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div className="text-center space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Calendars */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
