"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

function isUUID(v: unknown): v is string {
  return typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
}

const SUPABASE_URL = "https://sfktedqfipvuucelpggb.supabase.co"
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k"

// Extract text content from CSV file
async function extractCSVContent(file: File): Promise<{ headers: string[]; data: any[] }> {
  try {
    const text = await file.text()

    if (!text || text.trim().length === 0) {
      throw new Error("CSV file is empty")
    }

    // Handle different line endings and split into lines
    const lines = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .filter((line) => line.trim())

    if (lines.length < 2) {
      throw new Error("CSV file must have at least a header row and one data row")
    }

    // Parse CSV properly handling quoted fields
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = []
      let current = ""
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          result.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }

      result.push(current.trim())
      return result.map((field) => field.replace(/^"|"$/g, "")) // Remove surrounding quotes
    }

    const headers = parseCSVLine(lines[0]).filter((h) => h.length > 0)

    if (headers.length === 0) {
      throw new Error("No valid headers found in CSV file")
    }

    const data = lines
      .slice(1)
      .map((line, index) => {
        try {
          const values = parseCSVLine(line)
          const row: any = {}

          headers.forEach((header, headerIndex) => {
            row[header] = values[headerIndex] || ""
          })

          return row
        } catch (error) {
          console.warn(`Error parsing line ${index + 2}:`, error)
          return null
        }
      })
      .filter((row) => row !== null && Object.values(row).some((val) => String(val).trim().length > 0))

    if (data.length === 0) {
      throw new Error("No valid data rows found in CSV file")
    }

    return { headers, data }
  } catch (error) {
    console.error("Error parsing CSV:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to parse CSV file")
  }
}

export async function createLeadList(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const file = formData.get("file") as File
    const orgInput = formData.get("organization_id")
    const organizationId = isUUID(orgInput) ? (orgInput as string) : null

    if (!name || !file) {
      return { success: false, error: "Name and file are required" }
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return { success: false, error: "Only CSV files are supported" }
    }

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 10MB" }
    }

    // Extract CSV content
    const { headers, data } = await extractCSVContent(file)

    // Upload CSV to Vercel Blob storage
    const timestamp = Date.now()
    const filename = `lead-lists/${organizationId}/${timestamp}-${file.name}`

    const blob = await put(filename, file, {
      access: "public",
    })

    // Create lead list record
    const leadListData: Record<string, unknown> = {
      name: name.trim(),
      description: description?.trim() || `Lead list created from ${file.name}`,
      sub_account_id: null,
      file_path: filename,
      file_url: blob.url,
      uploaded: true,
      "created date": new Date().toISOString(),
      "modified date": new Date().toISOString(),
    }
    if (organizationId) leadListData.organization_id = organizationId

    // Insert lead list into Supabase
    const leadListResponse = await fetch(`${SUPABASE_URL}/rest/v1/lead_list`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(leadListData),
    })

    if (!leadListResponse.ok) {
      const errorData = await leadListResponse.text()
      console.error("Supabase error:", errorData)
      return { success: false, error: "Failed to create lead list" }
    }

    const leadListResult = await leadListResponse.json()
    const leadListId = leadListResult[0].id

    revalidatePath("/contacts")
    return {
      success: true,
      message: `Lead list "${name}" created successfully`,
      data: { leadListId, headers, csvData: data, blobUrl: blob.url },
    }
  } catch (error) {
    console.error("Create lead list error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function createManualLead(leadListName: string, leadData: any, organizationId: string | null = null) {
  try {
    if (!leadListName.trim()) {
      return { success: false, error: "Lead list name is required" }
    }

    if (!leadData.contact_name?.trim() || !leadData.email?.trim()) {
      return { success: false, error: "Contact name and email are required" }
    }

    console.log("Creating manual lead list and lead...")

    // First, create the lead list
    const leadListData: Record<string, unknown> = {
      name: leadListName.trim(),
      description: `Manual lead list created with ${leadData.contact_name}`,
      sub_account_id: null,
      file_path: null,
      file_url: null,
      uploaded: false,
      "created date": new Date().toISOString(),
      "modified date": new Date().toISOString(),
    }
    if (organizationId) leadListData.organization_id = organizationId

    const leadListResponse = await fetch(`${SUPABASE_URL}/rest/v1/lead_list`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(leadListData),
    })

    if (!leadListResponse.ok) {
      const errorData = await leadListResponse.text()
      console.error("Supabase lead list error:", errorData)
      return { success: false, error: "Failed to create lead list" }
    }

    const leadListResult = await leadListResponse.json()
    const leadListId = leadListResult[0].id

    // Then, create the lead
    const leadRecord = {
      lead_list_id: leadListId,
      sub_account_id: null,
      contact_name: leadData.contact_name.trim(),
      email: leadData.email.trim(),
      phone: leadData.phone?.trim() || "",
      company_name: leadData.company_name?.trim() || "",
      linkedin: leadData.linkedin?.trim() || "",
      notes: leadData.notes?.trim() || "",
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "manual",
      called_or_not: false,
      ai_reply: null,
      conversation: null,
      campaign_id: null,
      ai_agent_id: null,
    }
    if (organizationId) {
      // @ts-ignore
      leadRecord.organization_id = organizationId
    }

    const leadResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(leadRecord),
    })

    if (!leadResponse.ok) {
      const errorData = await leadResponse.text()
      console.error("Supabase lead error:", errorData)
      return { success: false, error: "Failed to create lead" }
    }

    const leadResult = await leadResponse.json()

    console.log("Manual lead created successfully:", leadResult[0])

    revalidatePath("/contacts")
    return {
      success: true,
      message: `Lead "${leadData.contact_name}" added successfully to "${leadListName}"`,
      data: { leadListId, leadId: leadResult[0].id },
    }
  } catch (error) {
    console.error("Create manual lead error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create manual lead",
    }
  }
}

export async function createLeadsFromCSV(leadListId: string, mappedData: any[], organizationId: string | null = null) {
  try {
    if (!leadListId || !mappedData || mappedData.length === 0) {
      return { success: false, error: "Invalid data provided" }
    }

    console.log("Creating leads for lead list:", leadListId)
    console.log("Mapped data sample:", mappedData[0])

    // Prepare leads data for bulk insert
    const leadsData = mappedData.map((row, index) => {
      // Ensure required fields
      const contactName = String(row.contact_name || row.name || `Contact ${index + 1}`).trim()
      const email = String(row.email || "").trim()
      const phone = String(row.phone || "").trim()
      const companyName = String(row.company_name || row.company || "").trim()
      const notes = String(row.notes || "").trim()
      const linkedin = String(row.linkedin || "").trim()

      const base = {
        lead_list_id: leadListId,
        sub_account_id: null,
        contact_name: contactName,
        email,
        phone,
        company_name: companyName,
        status: "new",
        notes,
        linkedin,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "system",
        called_or_not: false,
        ai_reply: null,
        conversation: null,
        campaign_id: null,
        ai_agent_id: null,
      }
      if (organizationId) {
        // @ts-ignore  (dynamic spread)
        base.organization_id = organizationId
      }
      return base as any
    })

    console.log("Prepared leads data:", leadsData.length, "records")

    // Insert leads into Supabase in batches
    const batchSize = 50
    const results = []

    for (let i = 0; i < leadsData.length; i += batchSize) {
      const batch = leadsData.slice(i, i + batchSize)

      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(leadsData.length / batchSize)}`)

      const leadsResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(batch),
      })

      if (!leadsResponse.ok) {
        const errorData = await leadsResponse.text()
        console.error("Supabase batch error:", errorData)
        throw new Error(`Failed to create leads batch ${Math.floor(i / batchSize) + 1}: ${errorData}`)
      }

      const batchResult = await leadsResponse.json()
      results.push(...batchResult)

      console.log(`Batch ${Math.floor(i / batchSize) + 1} completed:`, batchResult.length, "records")
    }

    console.log("All leads created successfully:", results.length)

    revalidatePath("/contacts")
    return {
      success: true,
      message: `Successfully created ${results.length} leads`,
      data: results,
    }
  } catch (error) {
    console.error("Create leads error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create leads",
    }
  }
}

export async function getLeadLists(organizationId: string | null = null) {
  try {
    let url = `${SUPABASE_URL}/rest/v1/lead_list?select=*&order=created date.desc`
    if (organizationId) {
      url += `&organization_id=eq.${organizationId}`
    }

    const response = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch lead lists")
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Fetch lead lists error:", error)
    return { success: false, error: "Failed to load lead lists", data: [] }
  }
}

export async function getLeadsByListId(leadListId: string) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?lead_list_id=eq.${leadListId}&select=*&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch leads")
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Fetch leads error:", error)
    return { success: false, error: "Failed to load leads", data: [] }
  }
}

export async function deleteLeadList(id: string) {
  try {
    console.log(`Starting deletion of lead list: ${id}`)

    // First, get the count of leads to be deleted for logging
    const leadsCountResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads?lead_list_id=eq.${id}&select=id`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    })

    let leadsCount = 0
    if (leadsCountResponse.ok) {
      const leadsData = await leadsCountResponse.json()
      leadsCount = leadsData.length
      console.log(`Found ${leadsCount} leads to delete`)
    }

    // Delete all leads associated with this lead list
    const deleteLeadsResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads?lead_list_id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!deleteLeadsResponse.ok) {
      const errorData = await deleteLeadsResponse.text()
      console.error("Failed to delete leads:", errorData)
      throw new Error("Failed to delete associated leads")
    }

    console.log(`Successfully deleted ${leadsCount} leads`)

    // Then delete the lead list
    const deleteListResponse = await fetch(`${SUPABASE_URL}/rest/v1/lead_list?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!deleteListResponse.ok) {
      const errorData = await deleteListResponse.text()
      console.error("Failed to delete lead list:", errorData)
      throw new Error("Failed to delete lead list")
    }

    console.log(`Successfully deleted lead list: ${id}`)

    revalidatePath("/contacts")
    return {
      success: true,
      message: `Lead list and ${leadsCount} associated contacts deleted successfully`,
    }
  } catch (error) {
    console.error("Delete lead list error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete lead list",
    }
  }
}
