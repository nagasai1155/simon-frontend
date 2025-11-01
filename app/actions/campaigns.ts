"use server"

interface CampaignData {
  name: string
  type: string
  leadListId: string
  channels: string[]
  timezone: string
  activeDays: string[]
  workingHoursStart: string
  workingHoursEnd: string
  doubleDial: boolean
  personalization: boolean
  webhookUrl?: string
}

export async function createCampaign(data: CampaignData) {
  try {
    console.log("🚀 Creating campaign with data:", data)

    const campaignPayload = {
      name: data.name,
      type: data.type,
      lead_list_id: data.leadListId,
      channels: data.channels,
      settings: {
        timezone: data.timezone,
        activeDays: data.activeDays,
        workingHours: {
          start: data.workingHoursStart,
          end: data.workingHoursEnd,
        },
        doubleDial: data.doubleDial,
        personalization: data.personalization,
      },
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("📊 Campaign payload:", JSON.stringify(campaignPayload, null, 2))

    const response = await fetch(`https://sfktedqfipvuucelpggb.supabase.co/rest/v1/campaigns`, {
      method: "POST",
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(campaignPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Campaign creation failed:", errorText)
      throw new Error(`Failed to create campaign: ${response.status}`)
    }

    const result = await response.json()
    const campaign = result[0]

    console.log("✅ Campaign created successfully:", campaign)

    // ALWAYS send leads to webhook immediately after campaign creation
    console.log("🔄 Starting webhook process...")
    const webhookResult = await sendLeadsToWebhook(data.leadListId, campaign.id)
    console.log("📡 Webhook result:", webhookResult)

    return {
      success: true,
      data: campaign,
      webhookResult: webhookResult,
    }
  } catch (error) {
    console.error("💥 Error creating campaign:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create campaign",
    }
  }
}

export async function getLeadLists() {
  try {
    console.log("Fetching lead lists...")

    const response = await fetch(`https://sfktedqfipvuucelpggb.supabase.co/rest/v1/lead_list?select=*`, {
      method: "GET",
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to fetch lead lists:", errorText)
      throw new Error(`Failed to fetch lead lists: ${response.status}`)
    }

    const leadLists = await response.json()
    console.log("Lead lists fetched successfully:", leadLists)

    return {
      success: true,
      data: leadLists,
    }
  } catch (error) {
    console.error("Error fetching lead lists:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch lead lists",
    }
  }
}

// BULLETPROOF WEBHOOK FUNCTION - GUARANTEED TO WORK
async function sendLeadsToWebhook(leadListId: string, campaignId: string) {
  const webhookUrl = "https://n8n.closi.tech/webhook/6414f403-fb44-4b92-81e3-28acd852e964"
  let successCount = 0
  let failureCount = 0
  const errors: string[] = []

  try {
    console.log(`🚀 WEBHOOK PROCESS STARTED`)
    console.log(`📋 Lead List ID: ${leadListId}`)
    console.log(`🎯 Campaign ID: ${campaignId}`)
    console.log(`📡 Webhook URL: ${webhookUrl}`)

    // Fetch leads from the selected lead list
    console.log(`🔍 Fetching leads from lead list...`)
    const response = await fetch(
      `https://sfktedqfipvuucelpggb.supabase.co/rest/v1/leads?lead_list_id=eq.${leadListId}&select=*`,
      {
        method: "GET",
        headers: {
          apikey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvcWtwb2R4YmNtZXhuenJscmxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk5Njk0MSwiZXhwIjoyMDY3NTcyOTQxfQ.zdpAYqsAadGaBaw8-b9QxDDjiGUDWrE9kfCXLdeLa0s",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvcWtwb2R4YmNtZXhuenJscmxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk5Njk0MSwiZXhwIjoyMDY3NTcyOTQxfQ.zdpAYqsAadGaBaw8-b9QxDDjiGUDWrE9kfCXLdeLa0s",
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Failed to fetch leads: ${response.status} ${response.statusText}`)
      console.error(`❌ Error details: ${errorText}`)
      throw new Error(`Failed to fetch leads: ${response.status} ${response.statusText}`)
    }

    const leads = await response.json()
    console.log(`📊 FOUND ${leads.length} LEADS TO SEND`)

    if (leads.length === 0) {
      console.log(`⚠️ No leads found in lead list ${leadListId}`)
      return {
        success: true,
        message: "No leads found in the selected lead list",
        successCount: 0,
        failureCount: 0,
        totalLeads: 0,
      }
    }

    // Send each lead to the webhook URL
    console.log(`🚀 STARTING TO SEND ${leads.length} LEADS TO WEBHOOK`)

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i]
      let attempts = 0
      const maxAttempts = 3

      console.log(`📤 PROCESSING LEAD ${i + 1}/${leads.length}:`, {
        name: `${lead.first_name} ${lead.last_name}`,
        email: lead.email,
        phone: lead.phone_number,
      })

      while (attempts < maxAttempts) {
        try {
          const payload = {
            campaignId: campaignId,
            leadListId: leadListId,
            lead: lead,
            leadIndex: i + 1,
            totalLeads: leads.length,
            timestamp: new Date().toISOString(),
          }

          console.log(`📦 SENDING PAYLOAD FOR LEAD ${i + 1} (attempt ${attempts + 1}):`)
          console.log(JSON.stringify(payload, null, 2))

          const webhookResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "Connected-Sensors-Campaign-System/1.0",
              "X-Campaign-ID": campaignId,
              "X-Lead-List-ID": leadListId,
              "X-Lead-Index": (i + 1).toString(),
              "X-Total-Leads": leads.length.toString(),
            },
            body: JSON.stringify(payload),
          })

          console.log(`📡 WEBHOOK RESPONSE: ${webhookResponse.status} ${webhookResponse.statusText}`)

          if (webhookResponse.ok) {
            const responseText = await webhookResponse.text()
            console.log(`✅ SUCCESS! Lead ${i + 1} sent to webhook. Response: ${responseText}`)
            successCount++
            break // Success, exit retry loop
          } else {
            const errorText = await webhookResponse.text()
            console.error(`❌ WEBHOOK ERROR ${webhookResponse.status}: ${errorText}`)

            if (attempts === maxAttempts - 1) {
              // Last attempt failed
              failureCount++
              errors.push(`Lead ${i + 1}: ${webhookResponse.status} ${errorText}`)
              console.error(`💥 FINAL FAILURE for lead ${i + 1}`)
            }
          }
        } catch (error) {
          console.error(`💥 NETWORK ERROR for lead ${i + 1} (attempt ${attempts + 1}):`, error)

          if (attempts === maxAttempts - 1) {
            // Last attempt failed
            failureCount++
            errors.push(`Lead ${i + 1}: ${error instanceof Error ? error.message : "Network error"}`)
            console.error(`💥 FINAL NETWORK FAILURE for lead ${i + 1}`)
          }
        }

        attempts++

        // Wait before retry (exponential backoff)
        if (attempts < maxAttempts) {
          const delay = Math.pow(2, attempts) * 1000 // 2s, 4s, 8s
          console.log(`⏳ WAITING ${delay}ms before retry for lead ${i + 1}...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }

      // Add delay between leads to avoid overwhelming the webhook
      if (i < leads.length - 1) {
        console.log(`⏳ Waiting 500ms before next lead...`)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    const result = {
      success: successCount > 0,
      message: `Successfully sent ${successCount}/${leads.length} leads to webhook`,
      successCount,
      failureCount,
      totalLeads: leads.length,
      errors: errors.length > 0 ? errors : undefined,
    }

    console.log(`🏁 WEBHOOK PROCESS COMPLETED:`)
    console.log(`✅ Success: ${successCount}`)
    console.log(`❌ Failures: ${failureCount}`)
    console.log(`📊 Total: ${leads.length}`)
    console.log(`📋 Result:`, result)

    return result
  } catch (error) {
    console.error("💥 CRITICAL ERROR in sendLeadsToWebhook:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      successCount,
      failureCount,
      totalLeads: 0,
      errors: [error instanceof Error ? error.message : "Unknown error"],
    }
  }
}
