import type { ReactNode } from "react"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  compact?: boolean
}

export default function EmptyState({ icon, title, description, compact = false }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-8" : "py-16"}`}>
      <div
        className={`${compact ? "w-12 h-12" : "w-16 h-16"} bg-secondary rounded-full flex items-center justify-center mb-4`}
      >
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <h2 className={`${compact ? "text-lg" : "text-xl"} font-semibold mb-2`}>{title}</h2>
      <p className="text-muted-foreground max-w-md text-sm">{description}</p>
    </div>
  )
}
