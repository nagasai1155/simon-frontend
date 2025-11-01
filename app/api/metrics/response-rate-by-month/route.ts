import { NextResponse } from 'next/server'

const SUPABASE_URL = "https://sfktedqfipvuucelpggb.supabase.co"
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Helper function to safely convert to number
function safeNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

export async function GET() {
  try {
    const year = new Date().getFullYear()
    // Fetch call analytics
    const callRes = await fetch(`${SUPABASE_URL}/rest/v1/call_analytics?select=created_at,calls_sent,calls_picked_up`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
    const callData = await callRes.json()
    // Fetch email analytics
    const emailRes = await fetch(`${SUPABASE_URL}/rest/v1/email_analytics?select=created_at,emails_sent,replied`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
    const emailData = await emailRes.json()
    // Aggregate by month
    const callsSent = Array(12).fill(0)
    const callsPickedUp = Array(12).fill(0)
    const emailsSent = Array(12).fill(0)
    const replied = Array(12).fill(0)
    callData.forEach((row: any) => {
      if (!row.created_at) return
      const date = new Date(row.created_at)
      if (date.getFullYear() !== year) return
      const month = date.getMonth()
      callsSent[month] += safeNumber(row.calls_sent)
      callsPickedUp[month] += safeNumber(row.calls_picked_up)
    })
    emailData.forEach((row: any) => {
      if (!row.created_at) return
      const date = new Date(row.created_at)
      if (date.getFullYear() !== year) return
      const month = date.getMonth()
      emailsSent[month] += safeNumber(row.emails_sent)
      replied[month] += safeNumber(row.replied)
    })
    // Calculate response rates
    const result = MONTHS.map((m, i) => {
      const totalSent = callsSent[i] + emailsSent[i]
      const totalResponses = callsPickedUp[i] + replied[i]
      const responseRate = totalSent > 0 ? (totalResponses / totalSent) * 100 : 0
      return { month: m, responseRate: Math.round(responseRate * 10) / 10 }
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json([], { status: 500 })
  }
} 