"use server"

import { revalidatePath } from "next/cache"

const SUPABASE_URL = "https://sfktedqfipvuucelpggb.supabase.co"
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k"

export async function createEmailAccount(formData: FormData) {
  try {
    const emailData = {
      email_address: formData.get("email_address") as string,
      password: formData.get("smtp_password") as string, // Changed from "password" to "smtp_password"
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      smtp_host: formData.get("smtp_host") as string,
      smtp_port: Number.parseInt(formData.get("smtp_port") as string),
      smtp_username: (formData.get("smtp_username") as string) || null,
      imap_host: formData.get("imap_host") as string,
      imap_port: Number.parseInt(formData.get("imap_port") as string),
      imap_username: formData.get("imap_username") as string,
      provider_type: "custom",
      status: "active",
      health: formData.get("email_quality") as string,
      daily_limit: 50, // Default daily limit
      daily_used: 0,
      smtp_secure: true,
      imap_secure: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/email_accounts`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create email account: ${error}`)
    }

    const result = await response.json()
    revalidatePath("/email-accounts")

    return { success: true, data: result }
  } catch (error) {
    console.error("Error creating email account:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getEmailAccounts() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/email_accounts?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch email accounts")
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching email accounts:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteEmailAccount(id: string) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/email_accounts?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete email account")
    }

    revalidatePath("/email-accounts")
    return { success: true }
  } catch (error) {
    console.error("Error deleting email account:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateEmailLimit(id: string, dailyLimit: number) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/email_accounts?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        daily_limit: dailyLimit,
        updated_at: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to update email limit")
    }

    revalidatePath("/email-accounts")
    return { success: true }
  } catch (error) {
    console.error("Error updating email limit:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function createBulkEmailAccounts(accounts: any[]) {
  try {
    const emailAccounts = accounts.map((account) => ({
      ...account,
      provider_type: "custom",
      status: "active",
      daily_used: 0,
      smtp_secure: true,
      imap_secure: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const response = await fetch(`${SUPABASE_URL}/rest/v1/email_accounts`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(emailAccounts),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create bulk email accounts: ${error}`)
    }

    const result = await response.json()
    revalidatePath("/email-accounts")

    return { success: true, data: result }
  } catch (error) {
    console.error("Error creating bulk email accounts:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
