"use server"

const SUPABASE_URL = "https://sfktedqfipvuucelpggb.supabase.co"
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k"

export interface ConversationData {
  id: string
  organization_id: string
  campaign_id?: string
  ai_agent_id?: string
  agent_name: string
  conversation_type: "email" | "phone" | "call" | "sms"
  audio_file_url?: string
  call_analytics_id?: string
  call_transcript?: string
  email_content?: string
  status: "active" | "completed" | "failed"
  metadata: any
  created_at: string
  updated_at: string
  lead: any
}

export interface ConversationMessage {
  id: string
  sender: "ai" | "user"
  content: string
  timestamp: string
}

export async function getConversations(organizationId = "1"): Promise<ConversationData[]> {
  console.log("🔍 Starting getConversations...")

  try {
    console.log("📡 Making fetch request with lead join...")

    // Fetch conversations with lead data joined
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/conversations?select=*,lead_data:leads!conversations_lead_fkey(*)&order=updated_at.desc`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    )

    console.log("📡 Response received, status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("❌ Error response:", errorText)

      // Fallback: fetch conversations without join and leads separately
      console.log("🔄 Trying fallback approach...")
      return await getConversationsWithFallback()
    }

    const conversations = await response.json()
    console.log("✅ Raw conversations with leads:", conversations)

    if (!Array.isArray(conversations)) {
      console.log("⚠️ Response is not an array - trying fallback")
      return await getConversationsWithFallback()
    }

    // Transform the data to match expected structure
    const transformedConversations = conversations.map((conv: any) => ({
      ...conv,
      // If lead_data exists, use it; otherwise keep the original lead field
      lead: conv.lead_data && conv.lead_data.length > 0 ? conv.lead_data[0] : conv.lead,
      // Ensure agent_name has a fallback
      agent_name: conv.agent_name || "AI Agent",
    }))

    console.log("✅ Transformed conversations:", transformedConversations)
    return transformedConversations
  } catch (error) {
    console.error("💥 Error in getConversations:", error)
    console.log("🔄 Trying fallback approach...")
    return await getConversationsWithFallback()
  }
}

// Fallback function to fetch conversations and leads separately
async function getConversationsWithFallback(): Promise<ConversationData[]> {
  try {
    console.log("📡 Fetching conversations without join...")

    // First, get all conversations
    const conversationsResponse = await fetch(`${SUPABASE_URL}/rest/v1/conversations?order=updated_at.desc`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!conversationsResponse.ok) {
      console.log("❌ Failed to fetch conversations")
      return []
    }

    const conversations = await conversationsResponse.json()
    console.log("✅ Fetched conversations:", conversations.length)

    // Get unique lead IDs
    const leadIds = [...new Set(conversations.map((conv: any) => conv.lead).filter(Boolean))]
    console.log("🔍 Lead IDs to fetch:", leadIds)

    if (leadIds.length === 0) {
      console.log("⚠️ No lead IDs found")
      return conversations.map((conv: any) => ({
        ...conv,
        agent_name: conv.agent_name || "AI Agent",
      }))
    }

    // Fetch leads data
    const leadsResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=in.(${leadIds.join(",")})`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    })

    let leads: any[] = []
    if (leadsResponse.ok) {
      leads = await leadsResponse.json()
      console.log("✅ Fetched leads:", leads.length)
    } else {
      console.log("⚠️ Failed to fetch leads, using fallback data")
    }

    // Create a map of lead ID to lead data
    const leadsMap = new Map()
    leads.forEach((lead: any) => {
      leadsMap.set(lead.id, lead)
    })

    // Merge conversations with lead data
    const mergedConversations = conversations.map((conv: any) => ({
      ...conv,
      lead: leadsMap.get(conv.lead) || {
        id: conv.lead,
        contact_name: "Unknown Contact",
        email: "unknown@example.com",
        company_name: "Unknown Company",
      },
      agent_name: conv.agent_name || "AI Agent",
    }))

    console.log("✅ Merged conversations with leads:", mergedConversations)
    return mergedConversations
  } catch (error) {
    console.error("💥 Fallback also failed:", error)
    return []
  }
}

export async function deleteConversation(id: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log("🗑️ Deleting conversation:", id)

    const response = await fetch(`${SUPABASE_URL}/rest/v1/conversations?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return {
        success: false,
        message: "Failed to delete conversation",
      }
    }

    console.log("✅ Conversation deleted successfully:", id)
    return {
      success: true,
      message: "Conversation deleted successfully",
    }
  } catch (error) {
    console.error("💥 Error deleting conversation:", error)
    return {
      success: false,
      message: "Failed to delete conversation",
    }
  }
}
