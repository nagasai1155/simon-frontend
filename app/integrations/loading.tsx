import Sidebar from "@/components/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function IntegrationsLoading() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Calendars Section Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-12 w-full mb-6 rounded-lg" />

            {/* Cal.com Card Skeleton */}
            <div className="max-w-sm">
              <div className="border rounded-lg p-6">
                <div className="text-center">
                  <Skeleton className="w-16 h-16 rounded-lg mx-auto mb-3" />
                  <Skeleton className="h-6 w-20 mx-auto mb-1" />
                  <Skeleton className="h-4 w-32 mx-auto mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
