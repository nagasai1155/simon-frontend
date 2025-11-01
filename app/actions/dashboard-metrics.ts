"use server"

const SUPABASE_URL = "https://sfktedqfipvuucelpggb.supabase.co"
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k"

// Instantly AI API configuration
const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY || ""
const INSTANTLY_API_BASE_URL = "https://api.instantly.ai/api/v2"

export interface DashboardMetrics {
  // Top metrics
  totalCampaigns: number
  activeChannels: number
  prospectsContacted: number
  responseRate: number

  // Calling Metrics
  totalCallsMade: number
  totalCallsPickedUp: number
  totalAppointmentsBooked: number
  pickupRate: number
  appointmentBookingRate: number
  conversionRate: number

  // Email analytics
  emailsSent: number
  opened: number
  replied: number
  appointmentsBookedEmails: number
  positiveResponseRate: number
  clickThroughRate: number
  
  // Additional Instantly AI email metrics
  bouncedCount: number
  bouncedRate: number
  unsubscribedCount: number
  unsubscribedRate: number
  linkClickedRate: number
  totalOpportunities: number
  totalLeadsInCampaigns: number
  totalContactedCount: number
  totalOpenedCount: number
  totalReplyCount: number

  // SMS analytics
  smsSent: number
  smsAppointmentsBooked: number
  smsDeliveryRate: number
  smsAppointmentRate: number
  smsPerformanceScore: number

  // Regional and Industry Data
  topCities: Array<{ name: string; appointments: number }>
  topIndustries: Array<{ name: string; appointments: number }>
  topICPs: Array<{ 
    name: string; 
    appointments: number; 
    performanceScore: number;
    emailAppointmentRate: number;
    callAppointmentRate: number;
    smsAppointmentRate: number;
  }>
  topSubICPs: Array<{ 
    name: string; 
    appointments: number; 
    performanceScore: number;
    emailAppointmentRate: number;
    callAppointmentRate: number;
    smsAppointmentRate: number;
  }>
  regionWiseData: Array<{ 
    name: string; 
    callPickup: number; 
    emailOpen: number; 
    emailReply: number;
    smsSent: number
  }>
  
  // ICP Performance Data
  icpPerformanceData: Array<{
    city: string;
    icpType: string;
    performanceScore: number;
    appointments: number;
    totalLeads: number;
  }>
}

function safeNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') return 0
    const num = Number(trimmed)
    return isNaN(num) ? 0 : num
  }
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

function formatLocationName(location: string): string {
  if (!location) return "Unknown Location"
  
  // If location already contains city, state format, return as is
  if (location.includes(',') && location.length > 10) {
    return location
  }
  
  // If it's just a country or state, add more context
  if (location.length <= 3 || location === 'USA') {
    return `${location} (Global)`
  }
  
  // If it's a city name, try to add state/country context
  if (location.length > 3 && !location.includes(',')) {
    return `${location}, Location`
  }
  
  return location
}

// Function to fetch click through rate from Instantly AI
async function fetchClickThroughRate(startDate: string, endDate: string): Promise<number> {
  if (!INSTANTLY_API_KEY || INSTANTLY_API_KEY === "instantly_api_key_here") {
    console.log("⚠️ Instantly API key not configured")
    return 0
  }

  try {
    const url = `${INSTANTLY_API_BASE_URL}/campaigns/analytics/daily?campaign_status=1&end_date=${endDate}&start_date=${startDate}`
    
    console.log("🔗 Fetching Instantly AI data from:", url)
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${INSTANTLY_API_KEY}`,
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      console.error("❌ Instantly AI API error:", response.status, response.statusText)
      return 0
    }

    const data = await response.json()
    console.log("📊 Instantly AI response:", data)

    // Sum up all clicks from the response array, excluding specific campaign
    let totalClicks = 0
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        // Exclude specific campaign ID and name
        if (item.campaign_id === "09cbe531-a780-477c-bda6-21ba6415608f" || 
            item.campaign_name === "LI commentars // Batch 1 // 1k emails") {
          console.log("🚫 Excluding campaign from clicks:", item.campaign_name || item.campaign_id)
          return
        }
        
        if (item.clicks !== null && item.clicks !== undefined) {
          totalClicks += safeNumber(item.clicks)
        }
      })
    }

    console.log("🖱️ Total clicks from Instantly AI:", totalClicks)
    return totalClicks

  } catch (error) {
    console.error("❌ Error fetching Instantly AI data:", error)
    return 0
  }
}

// Function to fetch campaign analytics from Instantly AI for all email metrics
async function fetchCampaignAnalytics(): Promise<{
  totalOpportunities: number;
  totalContacted: number;
  bouncedCount: number;
  bouncedRate: number;
  unsubscribedCount: number;
  unsubscribedRate: number;
  linkClickedRate: number;
  totalLeadsInCampaigns: number;
  totalOpenedCount: number;
  totalReplyCount: number;
  totalEmailsSent: number;
}> {
  if (!INSTANTLY_API_KEY || INSTANTLY_API_KEY === "instantly_api_key_here") {
    console.log("⚠️ Instantly API key not configured for campaign analytics")
    return {
      totalOpportunities: 0,
      totalContacted: 0,
      bouncedCount: 0,
      bouncedRate: 0,
      unsubscribedCount: 0,
      unsubscribedRate: 0,
      linkClickedRate: 0,
      totalLeadsInCampaigns: 0,
      totalOpenedCount: 0,
      totalReplyCount: 0,
      totalEmailsSent: 0
    }
  }

  try {
    const url = `${INSTANTLY_API_BASE_URL}/campaigns/analytics`
    
    console.log("🔗 Fetching Instantly AI campaign analytics from:", url)
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${INSTANTLY_API_KEY}`,
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      console.error("❌ Instantly AI campaign analytics API error:", response.status, response.statusText)
      return {
        totalOpportunities: 0,
        totalContacted: 0,
        bouncedCount: 0,
        bouncedRate: 0,
        unsubscribedCount: 0,
        unsubscribedRate: 0,
        linkClickedRate: 0,
        totalLeadsInCampaigns: 0,
        totalOpenedCount: 0,
        totalReplyCount: 0,
        totalEmailsSent: 0
      }
    }

    const data = await response.json()
    console.log("📊 Instantly AI campaign analytics response:", data)

    // Calculate all metrics from campaign data
    let totalOpportunities = 0
    let totalContacted = 0
    let bouncedCount = 0
    let unsubscribedCount = 0
    let linkClickCount = 0
    let totalLeadsInCampaigns = 0
    let totalOpenedCount = 0
    let totalReplyCount = 0
    let totalEmailsSent = 0
    
    if (Array.isArray(data)) {
      data.forEach((campaign: any) => {
        // Exclude specific campaign ID and name
        if (campaign.campaign_id === "09cbe531-a780-477c-bda6-21ba6415608f" || 
            campaign.campaign_name === "LI commentars // Batch 1 // 1k emails") {
          console.log("🚫 Excluding campaign from analytics:", campaign.campaign_name || campaign.campaign_id)
          return
        }
        
        if (campaign.total_opportunities !== null && campaign.total_opportunities !== undefined) {
          totalOpportunities += safeNumber(campaign.total_opportunities)
        }
        if (campaign.contacted_count !== null && campaign.contacted_count !== undefined) {
          totalContacted += safeNumber(campaign.contacted_count)
        }
        if (campaign.bounced_count !== null && campaign.bounced_count !== undefined) {
          bouncedCount += safeNumber(campaign.bounced_count)
        }
        if (campaign.unsubscribed_count !== null && campaign.unsubscribed_count !== undefined) {
          unsubscribedCount += safeNumber(campaign.unsubscribed_count)
        }
        if (campaign.link_click_count !== null && campaign.link_click_count !== undefined) {
          linkClickCount += safeNumber(campaign.link_click_count)
        }
        if (campaign.leads_count !== null && campaign.leads_count !== undefined) {
          totalLeadsInCampaigns += safeNumber(campaign.leads_count)
        }
        if (campaign.open_count !== null && campaign.open_count !== undefined) {
          totalOpenedCount += safeNumber(campaign.open_count)
        }
        if (campaign.reply_count !== null && campaign.reply_count !== undefined) {
          totalReplyCount += safeNumber(campaign.reply_count)
        }
        if (campaign.emails_sent_count !== null && campaign.emails_sent_count !== undefined) {
          totalEmailsSent += safeNumber(campaign.emails_sent_count)
        }
      })
    }

    // Calculate rates
    const bouncedRate = totalEmailsSent > 0 ? (bouncedCount / totalEmailsSent) * 100 : 0
    const unsubscribedRate = totalEmailsSent > 0 ? (unsubscribedCount / totalEmailsSent) * 100 : 0
    const linkClickedRate = totalEmailsSent > 0 ? (linkClickCount / totalEmailsSent) * 100 : 0

    console.log("📈 Campaign analytics totals:", {
      totalOpportunities,
      totalContacted,
      bouncedCount,
      bouncedRate,
      unsubscribedCount,
      unsubscribedRate,
      linkClickedRate,
      totalLeadsInCampaigns,
      totalOpenedCount,
      totalReplyCount,
      totalEmailsSent
    })

    return {
      totalOpportunities,
      totalContacted,
      bouncedCount,
      bouncedRate,
      unsubscribedCount,
      unsubscribedRate,
      linkClickedRate,
      totalLeadsInCampaigns,
      totalOpenedCount,
      totalReplyCount,
      totalEmailsSent
    }

  } catch (error) {
    console.error("❌ Error fetching Instantly AI campaign analytics:", error)
    return {
      totalOpportunities: 0,
      totalContacted: 0,
      bouncedCount: 0,
      bouncedRate: 0,
      unsubscribedCount: 0,
      unsubscribedRate: 0,
      linkClickedRate: 0,
      totalLeadsInCampaigns: 0,
      totalOpenedCount: 0,
      totalReplyCount: 0,
      totalEmailsSent: 0
    }
  }
}

// Test function to verify data fetching
export async function testDataFetching() {
  console.log("🧪 TESTING DATA FETCHING...")
  
  try {
    // Test call analytics
    const callResponse = await fetch(`${SUPABASE_URL}/rest/v1/call_analytics?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
    const callData = await callResponse.json()
    console.log("📞 Call Analytics Test:", {
      status: callResponse.status,
      count: Array.isArray(callData) ? callData.length : 0,
      sample: Array.isArray(callData) ? callData[0] : null
    })

    // Test email analytics
    const emailResponse = await fetch(`${SUPABASE_URL}/rest/v1/email_analytics?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
    const emailData = await emailResponse.json()
    console.log("📧 Email Analytics Test:", {
      status: emailResponse.status,
      count: Array.isArray(emailData) ? emailData.length : 0,
      sample: Array.isArray(emailData) ? emailData[0] : null
    })

    // Test SMS analytics
    const smsResponse = await fetch(`${SUPABASE_URL}/rest/v1/sms_analytics?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
    const smsData = await smsResponse.json()
    console.log("📱 SMS Analytics Test:", {
      status: smsResponse.status,
      count: Array.isArray(smsData) ? smsData.length : 0,
      sample: Array.isArray(smsData) ? smsData[0] : null
    })

    // Test leads
    const leadsResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
    const leadsData = await leadsResponse.json()
    console.log("👥 Leads Test:", {
      status: leadsResponse.status,
      count: Array.isArray(leadsData) ? leadsData.length : 0,
      sample: Array.isArray(leadsData) ? leadsData[0] : null
    })

    return { callData, emailData, smsData, leadsData }
  } catch (error) {
    console.error("🧪 Test failed:", error)
    throw error
  }
}

export async function getDashboardMetrics(
  startDate?: string,
  endDate?: string
): Promise<DashboardMetrics> {
  console.log("🚀 DASHBOARD METRICS STARTED - ACCURATE CALCULATIONS")
  console.log("📅 Date range:", { startDate, endDate })
  console.log("🔗 Supabase URL:", SUPABASE_URL)
  console.log("🔑 Supabase Key (first 20 chars):", SUPABASE_KEY.substring(0, 20) + "...")
  
  try {
    // Build date filter for Supabase queries - using both created_at and updated_at
    let dateFilter = ""
    if (startDate && endDate) {
      // Use OR condition to check both created_at and updated_at
      dateFilter = `or(and(created_at.gte.${startDate},created_at.lte.${endDate}),and(updated_at.gte.${startDate},updated_at.lte.${endDate}))`
    }

    // Fetch campaigns
    console.log("🌐 Fetching campaigns...")
    let campaignsResponse
    try {
      campaignsResponse = await fetch(`${SUPABASE_URL}/rest/v1/campaigns?select=id`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      })
      if (!campaignsResponse.ok) {
        console.error("❌ Campaigns fetch failed:", campaignsResponse.status, campaignsResponse.statusText)
        throw new Error(`Campaigns fetch failed: ${campaignsResponse.status}`)
      }
    } catch (error) {
      console.error("❌ Campaigns fetch error:", error)
      throw new Error(`Failed to fetch campaigns: ${error}`)
    }
    const campaigns = await campaignsResponse.json()
    const totalCampaigns = Array.isArray(campaigns) ? campaigns.length : 0

    // Fetch ALL call analytics data first to ensure we get everything
    console.log("🌐 Fetching ALL call analytics data...")
    let callAnalyticsResponse
    try {
      callAnalyticsResponse = await fetch(`${SUPABASE_URL}/rest/v1/call_analytics?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
      if (!callAnalyticsResponse.ok) {
        console.error("❌ Call analytics fetch failed:", callAnalyticsResponse.status, callAnalyticsResponse.statusText)
        throw new Error(`Call analytics fetch failed: ${callAnalyticsResponse.status}`)
      }
    } catch (error) {
      console.error("❌ Call analytics fetch error:", error)
      throw new Error(`Failed to fetch call analytics: ${error}`)
    }
    const allCallAnalytics = await callAnalyticsResponse.json()
    console.log("📊 Total call analytics records:", Array.isArray(allCallAnalytics) ? allCallAnalytics.length : 0)
    console.log("📊 Call analytics response status:", callAnalyticsResponse.status)
    console.log("📊 Call analytics sample data:", Array.isArray(allCallAnalytics) && allCallAnalytics.length > 0 ? allCallAnalytics[0] : "No data")

    // Filter by date if provided - but be more lenient with date matching
    let callAnalytics = allCallAnalytics
    if (startDate && endDate && Array.isArray(allCallAnalytics)) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      // Add one day to end date to include the full day
      end.setDate(end.getDate() + 1)
      
      callAnalytics = allCallAnalytics.filter((record: any) => {
        if (!record.created_at && !record.updated_at) return false
        
        const created = record.created_at ? new Date(record.created_at) : null
        const updated = record.updated_at ? new Date(record.updated_at) : null
        const recordDate = record.date ? new Date(record.date) : null
        
        // Check if any of the dates fall within the range
        const createdInRange = created ? (created >= start && created < end) : false
        const updatedInRange = updated ? (updated >= start && updated < end) : false
        const recordDateInRange = recordDate ? (recordDate >= start && recordDate < end) : false
        
        return createdInRange || updatedInRange || recordDateInRange
      })
      console.log("📊 Filtered call analytics records:", callAnalytics.length)
      console.log("📅 Date filter range:", { start: start.toISOString(), end: end.toISOString() })
    }

    // Calculate call metrics with detailed logging
    let totalCallsMade = 0
    let totalCallsPickedUp = 0
    let totalAppointmentsBooked = 0
    let totalVoicemails = 0

    // If no data after filtering, use all data (fallback)
    if (Array.isArray(callAnalytics) && callAnalytics.length === 0 && Array.isArray(allCallAnalytics) && allCallAnalytics.length > 0) {
      console.log("⚠️ No data after date filtering, using all call analytics data")
      callAnalytics = allCallAnalytics
    }

    if (Array.isArray(callAnalytics)) {
      callAnalytics.forEach((row: any, index: number) => {
        // Process all records with valid calls_sent (including "0" but not null)
        if (row.calls_sent !== null && row.calls_sent !== undefined) {
          const callsSent = safeNumber(row.calls_sent)
          const callsPickedUp = safeNumber(row.calls_picked_up)
          const appointmentsBooked = safeNumber(row.appointments_booked)
          const voicemails = safeNumber(row.voicemails)
          
          totalCallsMade += callsSent
          totalCallsPickedUp += callsPickedUp
          totalAppointmentsBooked += appointmentsBooked
          totalVoicemails += voicemails
          
          console.log(`📞 Record ${index + 1}:`, {
            raw: { calls_sent: row.calls_sent, calls_picked_up: row.calls_picked_up, appointments_booked: row.appointments_booked, voicemails: row.voicemails },
            converted: { callsSent, callsPickedUp, appointmentsBooked, voicemails }
          })
        } else {
          console.log(`📞 Record ${index + 1}: SKIPPED - null calls_sent`, row)
        }
      })
    }

    console.log("📊 FINAL CALL TOTALS:", {
      totalCallsMade,
      totalCallsPickedUp, 
      totalAppointmentsBooked,
      totalVoicemails
    })

    // Calculate rates with precision
    const pickupRate = totalCallsMade > 0 ? (totalCallsPickedUp / totalCallsMade) * 100 : 0
    const appointmentBookingRate = totalCallsMade > 0 ? (totalAppointmentsBooked / totalCallsMade) * 100 : 0
    const conversionRate = totalCallsPickedUp > 0 ? (totalAppointmentsBooked / totalCallsPickedUp) * 100 : 0

    // Fetch ALL email analytics data
    console.log("🌐 Fetching ALL email analytics data...")
    let emailAnalyticsResponse
    try {
      emailAnalyticsResponse = await fetch(`${SUPABASE_URL}/rest/v1/email_analytics?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
      if (!emailAnalyticsResponse.ok) {
        console.error("❌ Email analytics fetch failed:", emailAnalyticsResponse.status, emailAnalyticsResponse.statusText)
        throw new Error(`Email analytics fetch failed: ${emailAnalyticsResponse.status}`)
      }
    } catch (error) {
      console.error("❌ Email analytics fetch error:", error)
      throw new Error(`Failed to fetch email analytics: ${error}`)
    }
    const allEmailAnalytics = await emailAnalyticsResponse.json()
    console.log("📊 Total email analytics records:", Array.isArray(allEmailAnalytics) ? allEmailAnalytics.length : 0)
    console.log("📊 Email analytics response status:", emailAnalyticsResponse.status)
    console.log("📊 Email analytics sample data:", Array.isArray(allEmailAnalytics) && allEmailAnalytics.length > 0 ? allEmailAnalytics[0] : "No data")

    // Filter by date if provided - but be more lenient with date matching
    let emailAnalytics = allEmailAnalytics
    if (startDate && endDate && Array.isArray(allEmailAnalytics)) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      // Add one day to end date to include the full day
      end.setDate(end.getDate() + 1)
      
      emailAnalytics = allEmailAnalytics.filter((record: any) => {
        if (!record.created_at && !record.updated_at) return false
        
        const created = record.created_at ? new Date(record.created_at) : null
        const updated = record.updated_at ? new Date(record.updated_at) : null
        const recordDate = record.date ? new Date(record.date) : null
        
        // Check if any of the dates fall within the range
        const createdInRange = created ? (created >= start && created < end) : false
        const updatedInRange = updated ? (updated >= start && updated < end) : false
        const recordDateInRange = recordDate ? (recordDate >= start && recordDate < end) : false
        
        return createdInRange || updatedInRange || recordDateInRange
      })
      console.log("📊 Filtered email analytics records:", emailAnalytics.length)
    }

    // Calculate email metrics with detailed logging
    let emailsSent = 0
    let opened = 0
    let replied = 0
    let appointmentsBookedEmails = 0

    // If no data after filtering, use all data (fallback)
    if (Array.isArray(emailAnalytics) && emailAnalytics.length === 0 && Array.isArray(allEmailAnalytics) && allEmailAnalytics.length > 0) {
      console.log("⚠️ No data after date filtering, using all email analytics data")
      emailAnalytics = allEmailAnalytics
    }

    if (Array.isArray(emailAnalytics)) {
      emailAnalytics.forEach((row: any, index: number) => {
        // Process all records with valid emails_sent (including "0" but not null)
        if (row.emails_sent !== null && row.emails_sent !== undefined) {
          const emailsSentRow = safeNumber(row.emails_sent)
          const openedRow = safeNumber(row.opened)
          const repliedRow = safeNumber(row.replied)
          const appointmentsRow = safeNumber(row.appointments_booked)
          
          emailsSent += emailsSentRow
          opened += openedRow
          replied += repliedRow
          appointmentsBookedEmails += appointmentsRow
          
          console.log(`📧 Record ${index + 1}:`, {
            raw: { emails_sent: row.emails_sent, opened: row.opened, replied: row.replied, appointments_booked: row.appointments_booked },
            converted: { emailsSentRow, openedRow, repliedRow, appointmentsRow }
          })
        } else {
          console.log(`📧 Record ${index + 1}: SKIPPED - null emails_sent`, row)
        }
      })
    }

    console.log("📊 FINAL EMAIL TOTALS:", {
      emailsSent,
      opened,
      replied,
      appointmentsBookedEmails
    })

    // Fetch campaign analytics from Instantly AI for all email metrics
    console.log("🌐 Fetching campaign analytics from Instantly AI...")
    const campaignAnalytics = await fetchCampaignAnalytics()
    
    // Calculate positive response rate: (total_opportunities / contacted_count) * 100
    const positiveResponseRate = campaignAnalytics.totalContacted > 0 ? (campaignAnalytics.totalOpportunities / campaignAnalytics.totalContacted) * 100 : 0
    console.log("📈 Positive response rate calculation:", { 
      totalOpportunities: campaignAnalytics.totalOpportunities, 
      totalContacted: campaignAnalytics.totalContacted, 
      positiveResponseRate 
    })

    // Fetch click through rate from Instantly AI
    console.log("🌐 Fetching click through rate from Instantly AI...")
    let clickThroughRate = 0
    if (startDate && endDate) {
      // Format dates for Instantly AI API (yyyy/MM/dd format)
      const instantlyStartDate = startDate.replace(/-/g, '/')
      const instantlyEndDate = endDate.replace(/-/g, '/')
      clickThroughRate = await fetchClickThroughRate(instantlyStartDate, instantlyEndDate)
    } else {
      // If no date range, use current date
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '/')
      clickThroughRate = await fetchClickThroughRate(today, today)
    }
    console.log("🖱️ Click through rate:", clickThroughRate)

    // Fetch ALL SMS analytics data
    console.log("🌐 Fetching ALL SMS analytics data...")
    let smsAnalyticsResponse
    try {
      smsAnalyticsResponse = await fetch(`${SUPABASE_URL}/rest/v1/sms_analytics?select=*`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      })
      if (!smsAnalyticsResponse.ok) {
        console.error("❌ SMS analytics fetch failed:", smsAnalyticsResponse.status, smsAnalyticsResponse.statusText)
        throw new Error(`SMS analytics fetch failed: ${smsAnalyticsResponse.status}`)
      }
    } catch (error) {
      console.error("❌ SMS analytics fetch error:", error)
      throw new Error(`Failed to fetch SMS analytics: ${error}`)
    }
    const allSmsAnalytics = await smsAnalyticsResponse.json()
    console.log("📊 Total SMS analytics records:", Array.isArray(allSmsAnalytics) ? allSmsAnalytics.length : 0)

    // Filter SMS analytics by date if provided - but be more lenient with date matching
    let smsAnalytics = allSmsAnalytics
    if (startDate && endDate && Array.isArray(allSmsAnalytics)) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      // Add one day to end date to include the full day
      end.setDate(end.getDate() + 1)
      
      smsAnalytics = allSmsAnalytics.filter((record: any) => {
        if (!record.created_at && !record.updated_at) return false
        
        const created = record.created_at ? new Date(record.created_at) : null
        const updated = record.updated_at ? new Date(record.updated_at) : null
        const recordDate = record.date ? new Date(record.date) : null
        
        // Check if any of the dates fall within the range
        const createdInRange = created ? (created >= start && created < end) : false
        const updatedInRange = updated ? (updated >= start && updated < end) : false
        const recordDateInRange = recordDate ? (recordDate >= start && recordDate < end) : false
        
        return createdInRange || updatedInRange || recordDateInRange
      })
      console.log("📊 Filtered SMS analytics records:", smsAnalytics.length)
    }

    // Calculate SMS metrics with detailed logging
    let smsSent = 0
    let smsAppointmentsBooked = 0

    // If no data after filtering, use all data (fallback)
    if (Array.isArray(smsAnalytics) && smsAnalytics.length === 0 && Array.isArray(allSmsAnalytics) && allSmsAnalytics.length > 0) {
      console.log("⚠️ No data after date filtering, using all SMS analytics data")
      smsAnalytics = allSmsAnalytics
    }

    if (Array.isArray(smsAnalytics)) {
      smsAnalytics.forEach((row: any, index: number) => {
        // Handle null values properly - only count non-null records
        if (row.messages_sent !== null && row.messages_sent !== undefined) {
          const messagesSent = safeNumber(row.messages_sent)
          const appointmentsBooked = safeNumber(row.appointments_booked)
          
          smsSent += messagesSent
          smsAppointmentsBooked += appointmentsBooked
          
          console.log(`📱 SMS Record ${index + 1}: messages_sent=${messagesSent}, appointments=${appointmentsBooked}`)
        } else {
          console.log(`📱 SMS Record ${index + 1}: SKIPPED - null values`)
        }
      })
    }

    console.log("📊 FINAL SMS TOTALS:", {
      smsSent,
      smsAppointmentsBooked
    })

    // Calculate SMS performance metrics
    const smsDeliveryRate = smsSent > 0 ? ((smsSent - (smsSent * 0.02)) / smsSent) * 100 : 0 // Assuming 2% bounce rate for SMS
    const smsAppointmentRate = smsSent > 0 ? (smsAppointmentsBooked / smsSent) * 100 : 0
    const smsPerformanceScore = smsSent + (smsAppointmentsBooked * 2) // Weight appointments higher for performance

    // Fetch leads data for regional and industry analysis
    console.log("🌐 Fetching leads data...")
    let leadsResponse
    try {
      leadsResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=*`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      })
      if (!leadsResponse.ok) {
        console.error("❌ Leads fetch failed:", leadsResponse.status, leadsResponse.statusText)
        throw new Error(`Leads fetch failed: ${leadsResponse.status}`)
      }
    } catch (error) {
      console.error("❌ Leads fetch error:", error)
      throw new Error(`Failed to fetch leads: ${error}`)
    }
    const allLeads = await leadsResponse.json()
    console.log("📊 Total leads records:", Array.isArray(allLeads) ? allLeads.length : 0)

    // Filter leads by date if provided - comprehensive date filtering
    let leads = allLeads
    if (startDate && endDate && Array.isArray(allLeads)) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      // Set time to start of day for start date and end of day for end date
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      
      console.log("📅 Date filtering:", {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalLeads: allLeads.length
      })
      
      leads = allLeads.filter((record: any) => {
        // Check multiple date fields that might exist in the database
        const dateFields = [
          record.created_at,
          record.updated_at,
          record.date_created,
          record.date_updated,
          record.timestamp,
          record.date
        ]
        
        // Find any valid date field
        let recordDate = null
        for (const dateField of dateFields) {
          if (dateField) {
            try {
              const parsedDate = new Date(dateField)
              if (!isNaN(parsedDate.getTime())) {
                recordDate = parsedDate
                break
              }
            } catch (e) {
              // Continue to next date field
            }
          }
        }
        
        if (!recordDate) return false
        
        // Check if the record date falls within the range
        const isInRange = recordDate >= start && recordDate <= end
        
        // Debug logging for first few records
        if (allLeads.indexOf(record) < 3) {
          console.log("🔍 Date filter check:", {
            recordDate: recordDate.toISOString(),
            isInRange,
            created_at: record.created_at,
            updated_at: record.updated_at
          })
        }
        
        return isInRange
      })
      
      console.log("📊 Date filtering results:", {
        originalCount: allLeads.length,
        filteredCount: leads.length,
        filterApplied: true
      })
    } else {
      console.log("📊 No date filtering applied - using all leads:", allLeads.length)
    }

    // Process leads data for top cities and industries
    const cityStats = new Map<string, number>()
    const industryStats = new Map<string, number>()
    const icpStats = new Map<string, { 
      appointments: number, 
      performanceScore: number,
      emailSent: number,
      emailAppointments: number,
      callsMade: number,
      callAppointments: number,
      smsSent: number,
      smsAppointments: number
    }>()
    const regionStats = new Map<string, { callPickup: number, emailOpen: number, emailReply: number, smsSent: number, total: number }>()
    
    // ICP Performance tracking
    const icpPerformanceMap = new Map<string, { appointments: number, totalLeads: number, performanceScore: number }>()
    
    // Sub-ICP Performance tracking (for sub-ICP analytics)
    const subIcpStats = new Map<string, { 
      appointments: number, 
      performanceScore: number,
      emailSent: number,
      emailAppointments: number,
      callsMade: number,
      callAppointments: number,
      smsSent: number,
      smsAppointments: number
    }>()

    if (Array.isArray(leads)) {
      leads.forEach((lead: any, index: number) => {
        console.log(`👤 Lead ${index + 1}:`, {
          location: lead.location,
          industry: lead.industry,
          status: lead.status,
          called_or_not: lead.called_or_not,
          email_opened: lead.email_opened,
          email_sent: lead.email_sent,
          messaged_or_not: lead.messaged_or_not
        })

        // Top cities based on overall performance (calls + emails + SMS)
        if (lead.location) {
          const current = cityStats.get(lead.location) || 0
          let performanceScore = 0
          
          // Add points for different communication channels
          if (lead.called_or_not) performanceScore += 1
          if (lead.email_sent) performanceScore += 1
          if (lead.messaged_or_not) performanceScore += 1
          
          // Add bonus points for successful outcomes
          if (lead.status === 'booked' || lead.status === 'contacted') performanceScore += 2
          
          cityStats.set(lead.location, current + performanceScore)
        }
        
        // ICP Performance tracking by city and MAJOR ICP type
        if (lead.location && lead.major_icp_type) {
          const majorIcpType = lead.major_icp_type.toString().trim()
          const city = lead.location.toString().trim()
          const key = `${city}|${majorIcpType}`
          
          const current = icpPerformanceMap.get(key) || { appointments: 0, totalLeads: 0, performanceScore: 0 }
          current.totalLeads += 1
          
          // Count appointments (booked status)
          if (lead.status === 'booked' || lead.status === 'appointment booked') {
            current.appointments += 1
          }
          
          // Calculate performance score based on engagement and outcomes
          let score = 0
          if (lead.called_or_not) score += 1
          if (lead.email_sent) score += 1
          if (lead.messaged_or_not) score += 1
          if (lead.status === 'booked' || lead.status === 'appointment booked') score += 3
          if (lead.status === 'contacted') score += 2
          
          current.performanceScore += score
          icpPerformanceMap.set(key, current)
        }

        // Top industries based on appointments
        if (lead.industry) {
          const current = industryStats.get(lead.industry) || 0
          industryStats.set(lead.industry, current + (lead.status === 'booked' || lead.status === 'contacted' ? 1 : 0))
        }
        
        // Top MAJOR ICPs based on appointments and performance
        if (lead.major_icp_type) {
          const majorIcpType = lead.major_icp_type.toString().trim()
          const current = icpStats.get(majorIcpType) || { 
            appointments: 0, 
            performanceScore: 0,
            emailSent: 0,
            emailAppointments: 0,
            callsMade: 0,
            callAppointments: 0,
            smsSent: 0,
            smsAppointments: 0
          }
          
          // Debug logging for first few leads
          if (index < 5) {
            console.log(`🔍 Lead ${index + 1} MAJOR ICP data:`, {
              majorIcpType,
              status: lead.status,
              email_sent: lead.email_sent,
              called_or_not: lead.called_or_not,
              messaged_or_not: lead.messaged_or_not,
              hasAppointment: lead.status === 'booked' || lead.status === 'appointment booked' || lead.status === 'contacted'
            })
          }
          
          // Count appointments
          if (lead.status === 'booked' || lead.status === 'appointment booked') {
            current.appointments += 1
          }
          
          // Track communication channels and their appointments
          // Count total activity in each channel
          if (lead.email_sent) {
            current.emailSent += 1
          }
          
          if (lead.called_or_not) {
            current.callsMade += 1
          }
          
          if (lead.messaged_or_not) {
            current.smsSent += 1
          }
          
          // Count appointments for each channel that was used
          // This represents the conversion rate for each channel
          if (lead.status === 'booked' || lead.status === 'appointment booked' || lead.status === 'contacted') {
            if (lead.email_sent) {
              current.emailAppointments += 1
            }
            if (lead.called_or_not) {
              current.callAppointments += 1
            }
            if (lead.messaged_or_not) {
              current.smsAppointments += 1
            }
          }
          
          // Calculate performance score
          let score = 0
          if (lead.called_or_not) score += 1
          if (lead.email_sent) score += 1
          if (lead.messaged_or_not) score += 1
          if (lead.status === 'booked' || lead.status === 'appointment booked') score += 3
          if (lead.status === 'contacted') score += 2
          
          current.performanceScore += score
          icpStats.set(majorIcpType, current)
        }

        // Sub-ICP Performance tracking (for sub-ICP analytics)
        if (lead.icp_type) {
          const subIcpType = lead.icp_type.toString().toUpperCase().trim()
          const current = subIcpStats.get(subIcpType) || { 
            appointments: 0, 
            performanceScore: 0,
            emailSent: 0,
            emailAppointments: 0,
            callsMade: 0,
            callAppointments: 0,
            smsSent: 0,
            smsAppointments: 0
          }
          
          // Count appointments
          if (lead.status === 'booked' || lead.status === 'appointment booked') {
            current.appointments += 1
          }
          
          // Track communication channels and their appointments
          if (lead.email_sent) {
            current.emailSent += 1
          }
          
          if (lead.called_or_not) {
            current.callsMade += 1
          }
          
          if (lead.messaged_or_not) {
            current.smsSent += 1
          }
          
          // Count appointments for each channel that was used
          if (lead.status === 'booked' || lead.status === 'appointment booked' || lead.status === 'contacted') {
            if (lead.email_sent) {
              current.emailAppointments += 1
            }
            if (lead.called_or_not) {
              current.callAppointments += 1
            }
            if (lead.messaged_or_not) {
              current.smsAppointments += 1
            }
          }
          
          // Calculate performance score
          let score = 0
          if (lead.called_or_not) score += 1
          if (lead.email_sent) score += 1
          if (lead.messaged_or_not) score += 1
          if (lead.status === 'booked' || lead.status === 'appointment booked') score += 3
          if (lead.status === 'contacted') score += 2
          
          current.performanceScore += score
          subIcpStats.set(subIcpType, current)
        }

        // Region-wise data (simplified mapping)
        const region = getRegionFromLocation(lead.location)
        if (region) {
          const current = regionStats.get(region) || { callPickup: 0, emailOpen: 0, emailReply: 0, smsSent: 0, total: 0 }
          current.total += 1
          if (lead.called_or_not) current.callPickup += 1
          if (lead.email_opened) current.emailOpen += 1
          if (lead.email_sent) current.emailReply += 1
          if (lead.messaged_or_not) current.smsSent += 1
          regionStats.set(region, current)
        }
      })
    }

    // Convert maps to arrays and sort - TOP 5 ONLY
    const topCities = Array.from(cityStats.entries())
      .map(([name, performanceScore]) => ({ 
        name: formatLocationName(name), 
        appointments: performanceScore 
      }))
      .sort((a, b) => b.appointments - a.appointments)
      .slice(0, 5) // Only show top 5 performing cities

    const topIndustries = Array.from(industryStats.entries())
      .map(([name, appointments]) => ({ name, appointments }))
      .sort((a, b) => b.appointments - a.appointments)
      .slice(0, 5)
    
    console.log("🏭 Top Industries Data:", {
      totalIndustries: industryStats.size,
      topIndustries: topIndustries.map(industry => ({
        name: industry.name,
        appointments: industry.appointments,
        percentage: industry.appointments > 0 ? ((industry.appointments / topIndustries.reduce((sum, ind) => sum + ind.appointments, 0)) * 100).toFixed(1) + '%' : '0%'
      }))
    })
    
    const topICPs = Array.from(icpStats.entries())
      .map(([name, data]) => {
        const emailRate = data.emailSent > 0 ? Math.round((data.emailAppointments / data.emailSent) * 100 * 100) / 100 : 0
        const callRate = data.callsMade > 0 ? Math.round((data.callAppointments / data.callsMade) * 100 * 100) / 100 : 0
        const smsRate = data.smsSent > 0 ? Math.round((data.smsAppointments / data.smsSent) * 100 * 100) / 100 : 0
        
        console.log(`📊 ICP ${name} rates:`, {
          emailSent: data.emailSent,
          emailAppointments: data.emailAppointments,
          emailRate: `${emailRate}%`,
          callsMade: data.callsMade,
          callAppointments: data.callAppointments,
          callRate: `${callRate}%`,
          smsSent: data.smsSent,
          smsAppointments: data.smsAppointments,
          smsRate: `${smsRate}%`,
          totalAppointments: data.appointments
        })
        
        return { 
        name, 
        appointments: data.appointments, 
          performanceScore: data.performanceScore,
          emailAppointmentRate: emailRate,
          callAppointmentRate: callRate,
          smsAppointmentRate: smsRate
        }
      })
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 2) // Show both major ICP types

    // Process top Sub-ICPs
    const topSubICPs = Array.from(subIcpStats.entries())
      .map(([name, data]) => {
        const emailRate = data.emailSent > 0 ? Math.round((data.emailAppointments / data.emailSent) * 100 * 100) / 100 : 0
        const callRate = data.callsMade > 0 ? Math.round((data.callAppointments / data.callsMade) * 100 * 100) / 100 : 0
        const smsRate = data.smsSent > 0 ? Math.round((data.smsAppointments / data.smsSent) * 100 * 100) / 100 : 0
        
        return { 
          name, 
          appointments: data.appointments, 
          performanceScore: data.performanceScore,
          emailAppointmentRate: emailRate,
          callAppointmentRate: callRate,
          smsAppointmentRate: smsRate
        }
      })
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 4) // Show top 4 sub-ICP types
    
    // Process MAJOR ICP Performance data
    const icpPerformanceData = Array.from(icpPerformanceMap.entries())
      .map(([key, data]) => {
        const [city, majorIcpType] = key.split('|')
        return {
          city: formatLocationName(city),
          icpType: majorIcpType,
          performanceScore: data.performanceScore,
          appointments: data.appointments,
          totalLeads: data.totalLeads
        }
      })
      .filter(item => item.totalLeads > 0) // Only include combinations with leads
      .sort((a, b) => b.performanceScore - a.performanceScore) // Sort by performance score

    const regionWiseData = Array.from(regionStats.entries())
      .map(([name, stats]) => ({
        name,
        callPickup: stats.total > 0 ? (stats.callPickup / stats.total) * 100 : 0,
        emailOpen: stats.total > 0 ? (stats.emailOpen / stats.total) * 100 : 0,
        emailReply: stats.total > 0 ? (stats.emailReply / stats.total) * 100 : 0,
        smsSent: stats.total > 0 ? (stats.smsSent / stats.total) * 100 : 0
      }))

    // Calculate overall response rate
    const callResponseRate = totalCallsMade > 0 ? (totalCallsPickedUp / totalCallsMade) * 100 : 0
    const emailResponseRate = emailsSent > 0 ? (replied / emailsSent) * 100 : 0
    const responseRate = (callResponseRate + emailResponseRate) / 2

    const metrics: DashboardMetrics = {
      totalCampaigns,
      activeChannels: 3, // Calls, Emails, and SMS
      prospectsContacted: emailsSent + totalCallsMade + smsSent,
      responseRate: Math.round(responseRate * 100) / 100,
      
      // Calling metrics
      totalCallsMade,
      totalCallsPickedUp,
      totalAppointmentsBooked,
      pickupRate: Math.round(pickupRate * 100) / 100,
      appointmentBookingRate: Math.round(appointmentBookingRate * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100,
      
      // Email metrics
      emailsSent,
      opened,
      replied,
      appointmentsBookedEmails,
      positiveResponseRate: Math.round(positiveResponseRate * 100) / 100,
      clickThroughRate,
      
      // Additional Instantly AI email metrics
      bouncedCount: campaignAnalytics.bouncedCount,
      bouncedRate: Math.round(campaignAnalytics.bouncedRate * 100) / 100,
      unsubscribedCount: campaignAnalytics.unsubscribedCount,
      unsubscribedRate: Math.round(campaignAnalytics.unsubscribedRate * 100) / 100,
      linkClickedRate: Math.round(campaignAnalytics.linkClickedRate * 100) / 100,
      totalOpportunities: campaignAnalytics.totalOpportunities,
      totalLeadsInCampaigns: campaignAnalytics.totalLeadsInCampaigns,
      totalContactedCount: campaignAnalytics.totalContacted,
      totalOpenedCount: campaignAnalytics.totalOpenedCount,
      totalReplyCount: campaignAnalytics.totalReplyCount,
      
      // SMS metrics
      smsSent,
      smsAppointmentsBooked,
      smsDeliveryRate: Math.round(smsDeliveryRate * 100) / 100,
      smsAppointmentRate: Math.round(smsAppointmentRate * 100) / 100,
      smsPerformanceScore,
      
      // Regional and industry data
      topCities,
      topIndustries,
      topICPs,
      topSubICPs,
      regionWiseData,
      
      // ICP Performance data
      icpPerformanceData
    }

    console.log("✅ FINAL METRICS OBJECT:", metrics)
    console.log("🔍 CRITICAL METRICS CHECK:", {
      totalCallsMade: metrics.totalCallsMade,
      totalCallsPickedUp: metrics.totalCallsPickedUp,
      pickupRate: metrics.pickupRate,
      appointmentBookingRate: metrics.appointmentBookingRate,
      conversionRate: metrics.conversionRate,
      emailsSent: metrics.emailsSent,
      opened: metrics.opened,
      replied: metrics.replied,
      positiveResponseRate: metrics.positiveResponseRate,
      smsSent: metrics.smsSent,
      smsAppointmentsBooked: metrics.smsAppointmentsBooked
    })
    return metrics
    
  } catch (error) {
    console.error("💥 ERROR:", error)
    
    // Return fallback metrics to prevent complete failure
    console.log("🔄 Returning fallback metrics due to error")
    const fallbackMetrics: DashboardMetrics = {
      totalCampaigns: 0,
      activeChannels: 3,
      prospectsContacted: 0,
      responseRate: 0,
      
      // Calling metrics
      totalCallsMade: 0,
      totalCallsPickedUp: 0,
      totalAppointmentsBooked: 0,
      pickupRate: 0,
      appointmentBookingRate: 0,
      conversionRate: 0,
      
      // Email metrics
      emailsSent: 0,
      opened: 0,
      replied: 0,
      appointmentsBookedEmails: 0,
      positiveResponseRate: 0,
      clickThroughRate: 0,
      
      // Additional Instantly AI email metrics
      bouncedCount: 0,
      bouncedRate: 0,
      unsubscribedCount: 0,
      unsubscribedRate: 0,
      linkClickedRate: 0,
      totalOpportunities: 0,
      totalLeadsInCampaigns: 0,
      totalContactedCount: 0,
      totalOpenedCount: 0,
      totalReplyCount: 0,
      
      // SMS metrics
      smsSent: 0,
      smsAppointmentsBooked: 0,
      smsDeliveryRate: 0,
      smsAppointmentRate: 0,
      smsPerformanceScore: 0,
      
      // Regional and industry data
      topCities: [],
      topIndustries: [],
      topICPs: [],
      topSubICPs: [],
      regionWiseData: [],
      
      // ICP Performance data
      icpPerformanceData: []
    }
    
    return fallbackMetrics
  }
}

// Helper function to map locations to regions
function getRegionFromLocation(location: string): string | null {
  if (!location) return null
  
  const locationLower = location.toLowerCase()
  
  if (locationLower.includes('new york') || locationLower.includes('boston') || locationLower.includes('philadelphia')) {
    return 'North'
  } else if (locationLower.includes('california') || locationLower.includes('seattle') || locationLower.includes('portland')) {
    return 'West'
  } else if (locationLower.includes('texas') || locationLower.includes('florida') || locationLower.includes('georgia')) {
    return 'South'
  } else if (locationLower.includes('chicago') || locationLower.includes('detroit') || locationLower.includes('cleveland')) {
    return 'East'
  }
  
  return null
} 