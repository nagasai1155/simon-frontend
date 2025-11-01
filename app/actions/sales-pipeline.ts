"use server"

const SUPABASE_URL = "https://sfktedqfipvuucelpggb.supabase.co"
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k"

export interface Lead {
  id: string
  contact_name: string
  email: string
  phone: string
  company_name: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
  campaign_id?: string
  ai_agent_id?: string
  organization_id: string
  lead_list_id?: string
  ai_reply?: string
  called_or_not: boolean
  conversation?: any
  // Additional fields from the database
  sub_account_id?: string
  linkedin?: string
  website?: string
  job_title?: string
  "type of lead"?: string
  "all call data"?: string
  "call analytics id"?: string
  "email analytics id"?: string
  email_sequence_started?: boolean
  opener_line?: string
  email_opened_count?: number
  reoon_email_verification?: string
  campaign_name?: string
  calling_prompt_used?: string
  icp_type?: string
  call_summary?: string
  work_number?: string
  personal_phone_number?: string
  retell_chat_created?: boolean
  call_id?: string
  sms_messages_sent?: number
  last_sms_sent?: string
  last_sms_sent_number?: number
  industry?: string
  location?: string
  company_short_description?: string
  email_opened?: boolean
  last_email_opened_step?: string
  last_email_opened_variant?: string
  email_sent?: boolean
  last_email_sent_step?: string
  last_email_sent_variant?: string
  last_email_sent_subject?: string
  last_email_sent_body?: string
}

export interface PipelineStats {
  totalLeads: number
  newLeads: number
  contactedLeads: number
  repliedLeads: number
  bookedLeads: number
  replyRate: number
  conversionRate: number
}

// Map database status values to pipeline stages
const STATUS_MAPPING = {
  new: "new",
  contacted: "contacted",
  replied: "replied",
  booked: "booked",
  "followed-up": "followed-up",
  qualified: "replied",
  unqualified: "contacted",
  closed: "booked",
  lost: "contacted",
}

export async function getLeads(organizationId = "1"): Promise<Lead[]> {
  try {
    console.log("🔍 Fetching leads for organization:", organizationId)

    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=*&order=updated_at.desc`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.log("⚠️ Non-200 response - returning empty array")
      return []
    }

    const leads = await response.json()
    console.log("✅ Successfully fetched leads:", Array.isArray(leads) ? leads.length : "not array")

    if (!Array.isArray(leads)) {
      console.log("⚠️ Response is not an array - returning empty array")
      return []
    }

    // Normalize status values and ensure required fields
    const normalizedLeads = leads.map((lead: any) => ({
      ...lead,
      contact_name: lead.contact_name || "Unknown Contact",
      email: lead.email || "",
      phone: lead.phone || "",
      company_name: lead.company_name || "Unknown Company",
      status: STATUS_MAPPING[lead.status as keyof typeof STATUS_MAPPING] || lead.status || "new",
      notes: lead.notes || "",
      called_or_not: Boolean(lead.called_or_not),
    }))

    console.log("✅ Returning normalized leads:", normalizedLeads.length)
    return normalizedLeads
  } catch (error) {
    console.error("💥 Error fetching leads:", error)
    return []
  }
}

export async function getLeadsByStatus(status: string, organizationId = "1"): Promise<Lead[]> {
  try {
    console.log("🔍 Fetching leads by status:", status)

    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?status=eq.${status}&select=*&order=updated_at.desc`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.log("⚠️ Non-200 response - returning empty array")
      return []
    }

    const leads = await response.json()

    if (!Array.isArray(leads)) {
      return []
    }

    return leads.map((lead: any) => ({
      ...lead,
      contact_name: lead.contact_name || "Unknown Contact",
      email: lead.email || "",
      phone: lead.phone || "",
      company_name: lead.company_name || "Unknown Company",
      status: STATUS_MAPPING[lead.status as keyof typeof STATUS_MAPPING] || lead.status || "new",
      notes: lead.notes || "",
      called_or_not: Boolean(lead.called_or_not),
    }))
  } catch (error) {
    console.error("💥 Error fetching leads by status:", error)
    return []
  }
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: string,
): Promise<{ success: boolean; message: string }> {
  try {
    console.log("📝 Updating lead status:", leadId, "to", newStatus)

    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${leadId}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
        updated_at: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Failed to update lead status:", errorText)
      return {
        success: false,
        message: "Failed to update lead status",
      }
    }

    console.log("✅ Lead status updated successfully")
    return {
      success: true,
      message: "Lead status updated successfully",
    }
  } catch (error) {
    console.error("💥 Error updating lead status:", error)
    return {
      success: false,
      message: "Failed to update lead status",
    }
  }
}

export async function deleteLead(leadId: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log("🗑️ Deleting lead:", leadId)

    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${leadId}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Failed to delete lead:", errorText)
      return {
        success: false,
        message: "Failed to delete lead",
      }
    }

    console.log("✅ Lead deleted successfully")
    return {
      success: true,
      message: "Lead deleted successfully",
    }
  } catch (error) {
    console.error("💥 Error deleting lead:", error)
    return {
      success: false,
      message: "Failed to delete lead",
    }
  }
}

export async function getPipelineStats(organizationId = "1"): Promise<PipelineStats> {
  try {
    console.log("📊 Calculating pipeline stats for organization:", organizationId)

    const leads = await getLeads(organizationId)

    const totalLeads = leads.length
    const newLeads = leads.filter((lead) => lead.status === "new").length
    const contactedLeads = leads.filter((lead) => lead.status === "contacted").length
    const repliedLeads = leads.filter((lead) => lead.status === "replied").length
    const bookedLeads = leads.filter((lead) => lead.status === "booked").length

    const replyRate = totalLeads > 0 ? Math.round(((repliedLeads + bookedLeads) / totalLeads) * 100) : 0
    const conversionRate = totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 0

    const stats = {
      totalLeads,
      newLeads,
      contactedLeads,
      repliedLeads,
      bookedLeads,
      replyRate,
      conversionRate,
    }

    console.log("✅ Pipeline stats calculated:", stats)
    return stats
  } catch (error) {
    console.error("💥 Error calculating pipeline stats:", error)
    return {
      totalLeads: 0,
      newLeads: 0,
      contactedLeads: 0,
      repliedLeads: 0,
      bookedLeads: 0,
      replyRate: 0,
      conversionRate: 0,
    }
  }
}

export async function searchLeads(query: string, organizationId = "1"): Promise<Lead[]> {
  try {
    console.log("🔍 Searching leads with query:", query)

    if (!query.trim()) {
      return await getLeads(organizationId)
    }

    const leads = await getLeads(organizationId)

    const filteredLeads = leads.filter(
      (lead) =>
        lead.contact_name.toLowerCase().includes(query.toLowerCase()) ||
        lead.email.toLowerCase().includes(query.toLowerCase()) ||
        lead.company_name.toLowerCase().includes(query.toLowerCase()) ||
        (lead.phone && lead.phone.includes(query)),
    )

    console.log("✅ Search completed, found:", filteredLeads.length, "leads")
    return filteredLeads
  } catch (error) {
    console.error("💥 Error searching leads:", error)
    return []
  }
}

export async function getCampaignName(campaignId: string): Promise<string> {
  try {
    if (!campaignId) return "No Campaign"

    const response = await fetch(`${SUPABASE_URL}/rest/v1/campaigns?id=eq.${campaignId}&select=name`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return "Unknown Campaign"
    }

    const campaigns = await response.json()
    return campaigns.length > 0 ? campaigns[0].name : "Unknown Campaign"
  } catch (error) {
    console.error("💥 Error fetching campaign name:", error)
    return "Unknown Campaign"
  }
}

// Helper function to organize leads by status for board view
export async function organizeLeadsByStatus(leads: Lead[]) {
  const columns = [
    {
      id: "new",
      title: "New Leads",
      leads: leads.filter((lead) => lead.status === "new"),
    },
    {
      id: "contacted",
      title: "Contacted",
      leads: leads.filter((lead) => lead.status === "contacted"),
    },
    {
      id: "replied",
      title: "Replied",
      leads: leads.filter((lead) => lead.status === "replied"),
    },
    {
      id: "booked",
      title: "Booked",
      leads: leads.filter((lead) => lead.status === "booked"),
    },
  ]

  return columns
}
