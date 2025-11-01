"use server"

import { revalidatePath } from "next/cache"

const RETELL_API_KEY = "key_58535ceeedb33ccf1f1a377a4c10"
const RETELL_BASE_URL = "https://api.retellai.com"
const SUPABASE_URL = "https://sfktedqfipvuucelpggb.supabase.co"
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k"

// Helper function to format phone number for Retell.ai API
function formatPhoneNumberForRetell(phoneNumber: string): string {
  // Ensure phoneNumber is a string and not null/undefined
  if (!phoneNumber || typeof phoneNumber !== "string") {
    throw new Error("Phone number must be a valid string")
  }

  // Remove any existing formatting and ensure it starts with +
  let formatted = phoneNumber.replace(/[^\d+]/g, "")

  // If it doesn't start with +, add +1 (US country code)
  if (!formatted.startsWith("+")) {
    // If it starts with 1, add + prefix
    if (formatted.startsWith("1")) {
      formatted = "+" + formatted
    } else {
      // Otherwise add +1 prefix
      formatted = "+1" + formatted
    }
  }

  return formatted
}

export async function createPhoneNumber(formData: FormData) {
  try {
    // Add detailed logging
    console.log("createPhoneNumber called with formData:", formData)

    if (!formData) {
      console.error("FormData is null or undefined")
      return { success: false, error: "Form data is missing" }
    }

    const areaCode = formData.get("areaCode") as string
    const nickname = formData.get("nickname") as string

    console.log("Extracted values:", { areaCode, nickname })

    if (!areaCode || !nickname) {
      return { success: false, error: "Area code and nickname are required" }
    }

    // Step 1: Create phone number in Retell.ai first
    console.log("Creating phone number in Retell.ai...")
    const retellResponse = await fetch(`${RETELL_BASE_URL}/create-phone-number`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        area_code: Number.parseInt(areaCode),
        nickname: nickname,
        number_provider: "telnyx",
      }),
    })

    if (!retellResponse.ok) {
      const errorText = await retellResponse.text()
      console.error("Retell.ai API error:", errorText)
      return {
        success: false,
        error: `Failed to create phone number in Retell.ai: ${retellResponse.status} ${retellResponse.statusText}`,
      }
    }

    const retellData = await retellResponse.json()
    console.log("Retell.ai response:", retellData)

    // Step 2: Save to Supabase database (only after Retell.ai success)
    console.log("Saving phone number to Supabase...")
    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/phone_numbers`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        phone_number_pretty: retellData.phone_number || retellData.number,
        area_code: areaCode,
        nickname: nickname,
        number_provider: "telnyx",
        adding_method: "purchase",
        type: "purchased",
        country_code: "+1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    })

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text()
      console.error("Supabase error:", errorText)

      // If Supabase fails, we should ideally clean up the Retell.ai number
      // but for now, we'll just log the issue
      return {
        success: false,
        error: `Phone number created in Retell.ai but failed to save to database: ${supabaseResponse.status}`,
      }
    }

    revalidatePath("/phone-numbers")
    return {
      success: true,
      message: `Phone number ${retellData.phone_number || retellData.number} created successfully!`,
      phoneNumber: retellData.phone_number || retellData.number,
    }
  } catch (error) {
    console.error("Error creating phone number:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function createSipTrunkNumber(formData: FormData) {
  try {
    console.log("createSipTrunkNumber called with formData:", formData)

    if (!formData) {
      console.error("FormData is null or undefined")
      return { success: false, error: "Form data is missing" }
    }

    const phoneNumber = formData.get("phoneNumber") as string
    const terminationUri = formData.get("terminationUri") as string
    const sipUsername = formData.get("sipUsername") as string
    const sipPassword = formData.get("sipPassword") as string
    const nickname = formData.get("nickname") as string

    console.log("Extracted SIP values:", { phoneNumber, terminationUri, sipUsername, nickname })

    if (!phoneNumber || !terminationUri || !nickname) {
      return { success: false, error: "Phone number, termination URI, and nickname are required" }
    }

    // Format phone number for Retell.ai API
    const formattedPhoneNumber = formatPhoneNumberForRetell(phoneNumber)
    console.log("Formatted phone number for Retell.ai:", formattedPhoneNumber)

    // Step 1: Import phone number to Retell.ai first
    console.log("Importing SIP trunk number to Retell.ai...")
    const retellPayload = {
      phone_number: formattedPhoneNumber,
      termination_uri: terminationUri,
      nickname: nickname,
    }

    // Add SIP auth credentials if provided
    if (sipUsername) {
      retellPayload.sip_trunk_auth_username = sipUsername
    }
    if (sipPassword) {
      retellPayload.sip_trunk_auth_password = sipPassword
    }

    const retellResponse = await fetch(`${RETELL_BASE_URL}/import-phone-number`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(retellPayload),
    })

    if (!retellResponse.ok) {
      const errorText = await retellResponse.text()
      console.error("Retell.ai SIP import error:", errorText)
      return {
        success: false,
        error: `Failed to import SIP trunk number in Retell.ai: ${retellResponse.status} ${retellResponse.statusText}`,
      }
    }

    const retellData = await retellResponse.json()
    console.log("Retell.ai SIP import response:", retellData)

    // Step 2: Save to Supabase database (only after Retell.ai success)
    console.log("Saving SIP trunk number to Supabase...")
    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/phone_numbers`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        phone_number_pretty: formattedPhoneNumber,
        nickname: nickname,
        adding_method: "sip",
        type: "sip_trunk",
        termination_uri: terminationUri,
        sip_username: sipUsername || null,
        sip_password: sipPassword || null,
        country_code: formattedPhoneNumber.startsWith("+1") ? "+1" : "+",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    })

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text()
      console.error("Supabase SIP save error:", errorText)

      // If Supabase fails, we should ideally clean up the Retell.ai number
      return {
        success: false,
        error: `SIP trunk number imported to Retell.ai but failed to save to database: ${supabaseResponse.status}`,
      }
    }

    revalidatePath("/phone-numbers")
    return {
      success: true,
      message: `SIP trunk number ${formattedPhoneNumber} connected successfully!`,
      phoneNumber: formattedPhoneNumber,
    }
  } catch (error) {
    console.error("Error creating SIP trunk number:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function deletePhoneNumber(prevState: any, formData: FormData) {
  try {
    console.log("deletePhoneNumber called with formData:", formData)

    if (!formData) {
      return { success: false, error: "Form data is missing" }
    }

    const phoneNumber = formData.get("phoneNumber") as string

    console.log("Phone number to delete:", phoneNumber, "Type:", typeof phoneNumber)

    if (!phoneNumber || typeof phoneNumber !== "string") {
      return { success: false, error: "Phone number is required and must be a valid string" }
    }

    // Format phone number for Retell.ai API (must include + prefix)
    const formattedPhoneNumber = formatPhoneNumberForRetell(phoneNumber)
    console.log("Original phone number:", phoneNumber)
    console.log("Formatted for Retell.ai:", formattedPhoneNumber)

    // Step 1: Delete from Retell.ai first
    console.log("Deleting phone number from Retell.ai:", formattedPhoneNumber)
    const retellResponse = await fetch(
      `${RETELL_BASE_URL}/delete-phone-number/${encodeURIComponent(formattedPhoneNumber)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${RETELL_API_KEY}`,
        },
      },
    )

    if (!retellResponse.ok) {
      const errorText = await retellResponse.text()
      console.error("Retell.ai delete error:", errorText)
      return {
        success: false,
        error: `Failed to delete phone number from Retell.ai: ${retellResponse.status} ${retellResponse.statusText}`,
      }
    }

    console.log("Successfully deleted from Retell.ai")

    // Step 2: Delete from Supabase database (only after Retell.ai success)
    console.log("Deleting phone number from Supabase...")
    const supabaseResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/phone_numbers?phone_number_pretty=eq.${encodeURIComponent(phoneNumber)}`,
      {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text()
      console.error("Supabase delete error:", errorText)
      return {
        success: false,
        error: `Phone number deleted from Retell.ai but failed to delete from database: ${supabaseResponse.status}`,
      }
    }

    revalidatePath("/phone-numbers")
    return {
      success: true,
      message: `Phone number ${phoneNumber} deleted successfully!`,
    }
  } catch (error) {
    console.error("Error deleting phone number:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getPhoneNumbers() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/phone_numbers?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch phone numbers: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching phone numbers:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch phone numbers",
    }
  }
}
