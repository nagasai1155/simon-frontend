import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Group leads by their status so the Kanban board can render columns
export function organizeLeadsByStatus<T extends { status: string }>(leads: T[]) {
  const statuses = ["new", "contacted", "replied", "booked"]
  return statuses.map((key) => ({
    id: key,
    title: key === "new" ? "New Leads" : key.charAt(0).toUpperCase() + key.slice(1),
    leads: leads.filter((l) => l.status === key),
  }))
}
