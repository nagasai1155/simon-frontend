"use server"

import { executeLeadResearch } from "./campaign-execution"

interface ScheduledCampaign {
  id: string
  name: string
  type: string
  lead_list_id: string
  channels: string[]
  settings: {
    timezone: string
    activeDays: string[]
    workingHours: {
      start: string
      end: string
    }
    doubleDial: boolean
    personalization: boolean
  }
  status: string
  created_at: string
}

// Convert time string to minutes (e.g., "9:00 AM" -> 540)
function timeToMinutes(timeStr: string): number {
  const [time, period] = timeStr.split(" ")
  const [hours, minutes] = time.split(":").map(Number)
  let totalMinutes = hours * 60 + minutes

  if (period === "PM" && hours !== 12) {
    totalMinutes += 12 * 60
  } else if (period === "AM" && hours === 12) {
    totalMinutes = minutes
  }

  return totalMinutes
}

// Check if current time is within working hours
function isWithinWorkingHours(
  timezone: string,
  workingHours: { start: string; end: string },
  activeDays: string[],
): boolean {
  try {
    const now = new Date()
    const timeInTimezone = new Date(now.toLocaleString("en-US", { timeZone: timezone }))

    // Check if today is an active day
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const currentDay = dayNames[timeInTimezone.getDay()]

    if (!activeDays.includes(currentDay)) {
      return false
    }

    // Check if current time is within working hours
    const currentMinutes = timeInTimezone.getHours() * 60 + timeInTimezone.getMinutes()
    const startMinutes = timeToMinutes(workingHours.start)
    const endMinutes = timeToMinutes(workingHours.end)

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes
  } catch (error) {
    console.error("Error checking working hours:", error)
    return false
  }
}

// Get all campaigns that need processing
export async function getPendingCampaigns(): Promise<ScheduledCampaign[]> {
  try {
    const response = await fetch(
      `https://sfktedqfipvuucelpggb.supabase.co/rest/v1/campaigns?status=eq.research_pending&select=*`,
      {
        method: "GET",
        headers: {
          apikey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch pending campaigns: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching pending campaigns:", error)
    return []
  }
}

// Process campaigns that are within their working hours
export async function processCampaignsInWorkingHours(): Promise<void> {
  try {
    console.log("Checking for campaigns to process...")

    const pendingCampaigns = await getPendingCampaigns()

    if (pendingCampaigns.length === 0) {
      console.log("No pending campaigns found")
      return
    }

    console.log(`Found ${pendingCampaigns.length} pending campaigns`)

    for (const campaign of pendingCampaigns) {
      try {
        const { timezone, activeDays, workingHours } = campaign.settings

        // Check if campaign should be processed now
        if (isWithinWorkingHours(timezone, workingHours, activeDays)) {
          console.log(`Processing campaign ${campaign.id} - ${campaign.name}`)

          // Update status to processing
          await updateCampaignStatus(campaign.id, "research_processing")

          // Start lead research
          await executeLeadResearch({
            campaignId: campaign.id,
            leadListId: campaign.lead_list_id,
            channels: campaign.channels,
            settings: campaign.settings,
          })

          console.log(`Campaign ${campaign.id} research completed`)
        } else {
          console.log(`Campaign ${campaign.id} is outside working hours - skipping`)
        }
      } catch (error) {
        console.error(`Error processing campaign ${campaign.id}:`, error)
        await updateCampaignStatus(campaign.id, "research_failed", {
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }
  } catch (error) {
    console.error("Error in processCampaignsInWorkingHours:", error)
  }
}

// Update campaign status
async function updateCampaignStatus(campaignId: string, status: string, metadata?: any): Promise<void> {
  try {
    const updateData = {
      status: status,
      metadata: metadata || {},
      updated_at: new Date().toISOString(),
    }

          const response = await fetch(`https://sfktedqfipvuucelpggb.supabase.co/rest/v1/campaigns?id=eq.${campaignId}`, {
        method: "PATCH",
        headers: {
          apikey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error(`Failed to update campaign status: ${response.status}`)
    }
  } catch (error) {
    console.error("Error updating campaign status:", error)
    throw error
  }
}

// Initialize campaign scheduler (call this periodically)
export async function initializeCampaignScheduler(): Promise<void> {
  console.log("Campaign scheduler initialized")

  // Process campaigns immediately
  await processCampaignsInWorkingHours()

  // Set up interval to check every 5 minutes
  setInterval(
    async () => {
      await processCampaignsInWorkingHours()
    },
    5 * 60 * 1000,
  ) // 5 minutes
}
