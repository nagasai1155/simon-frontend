"use client"

import { Home } from "lucide-react"

export function SubaccountDropdown() {
  return (
    <div className="flex items-center gap-2 p-2 bg-secondary rounded-md">
      <Home className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-foreground">Home</span>
    </div>
  )
}
