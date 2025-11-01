"use server"

import "server-only"

/**
 * Minimal Lead shape – extend when wiring-up real data later.
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
 * Currently returns an empty array so the build succeeds.
 * TODO: replace with a Supabase REST request.
 */
export async function getAllLeads(): Promise<Lead[]> {
  return []
}
