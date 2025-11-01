import { Skeleton } from "@/components/ui/skeleton"
import Sidebar from "@/components/sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { generateSkeletonArray } from "@/lib/ux-utils"

export default function BoardViewLoading() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-5 w-72" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                  <Skeleton className="h-10 w-full sm:w-60" />
                  <Skeleton className="h-10 w-full sm:w-32" />
                </div>
              </div>

              {/* Stats Cards Skeleton */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {generateSkeletonArray(4).map((i) => (
                  <Card key={i} className="border-border bg-card">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-7 w-16" />
                          <Skeleton className="h-3 w-32 hidden sm:block" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* View Switcher Skeleton */}
            <div className="flex justify-center">
              <Skeleton className="h-10 w-64" />
            </div>

            {/* Board Skeleton */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-10 w-full sm:w-80" />
                </div>
                <Skeleton className="h-5 w-20 mt-2" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex gap-4 overflow-x-auto pb-4 px-1">
                  {generateSkeletonArray(4).map((i) => (
                    <div key={i} className="flex-shrink-0 w-72 sm:w-80">
                      <Card className="h-full border-border bg-card">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-8" />
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <div className="space-y-3 min-h-[300px]">
                            {generateSkeletonArray(3).map((j) => (
                              <Card key={j} className="border-border bg-background">
                                <CardContent className="p-3">
                                  <div className="space-y-2">
                                    <Skeleton className="h-5 w-full" />
                                    <div className="space-y-1">
                                      <Skeleton className="h-4 w-3/4" />
                                      <Skeleton className="h-3 w-1/2" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <Skeleton className="h-4 w-16" />
                                      <Skeleton className="h-4 w-20" />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
