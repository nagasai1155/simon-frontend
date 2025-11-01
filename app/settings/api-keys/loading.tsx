import { Skeleton } from "@/components/ui/skeleton"

export default function ApiKeysLoading() {
  return (
    <div className="container py-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="bg-muted/20 rounded-md overflow-hidden">
        <div className="grid grid-cols-12 py-3 px-4 border-b border-border">
          <Skeleton className="h-5 w-16 col-span-4" />
          <Skeleton className="h-5 w-24 col-span-5" />
          <Skeleton className="h-5 w-16 col-span-2" />
          <div className="col-span-1"></div>
        </div>

        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-12 py-3 px-4 border-b border-border items-center">
            <Skeleton className="h-5 w-32 col-span-4" />
            <Skeleton className="h-5 w-48 col-span-5" />
            <Skeleton className="h-5 w-20 col-span-2" />
            <div className="col-span-1 flex justify-end">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
