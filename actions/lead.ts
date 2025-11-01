"use server"

import "server-only"

/**
 * A minimal Lead shape. Extend when real data is wired up.
 */
export interface Lead {
  id: string
  contact_name: string | null
  email: string | null
  phone: string | null
  status: string | null
  company_name: string | null
}

/**
 * Server Action: fetch all leads.
 * NOTE: This stub simply returns an empty array so the build passes.
 * Replace the body with a Supabase REST fetch when you are ready.
 */
export async function getAllLeads(): Promise<Lead[]> {
  return []
}
