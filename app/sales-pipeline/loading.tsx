import { Skeleton } from "@/components/ui/skeleton"
import Sidebar from "@/components/sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { generateSkeletonArray } from "@/lib/ux-utils"

export default function SalesPipelineLoading() {
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
                <div className="w-full lg:w-auto">
                  <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-5 w-72" />
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

            {/* Table Skeleton */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-10 w-full sm:w-80" />
                </div>
                <Skeleton className="h-5 w-20 mt-2" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/20">
                      <tr>
                        {generateSkeletonArray(6).map((i) => (
                          <th key={i} className="p-3 sm:p-4">
                            <Skeleton className="h-4 w-full" />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {generateSkeletonArray(5).map((i) => (
                        <tr key={i} className="border-b">
                          {generateSkeletonArray(6).map((j) => (
                            <td key={j} className="p-3 sm:p-4">
                              <Skeleton className="h-4 w-full" />
                              {j === 1 && (
                                <div className="mt-2 space-y-1">
                                  <Skeleton className="h-3 w-3/4" />
                                  <Skeleton className="h-3 w-1/2" />
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
