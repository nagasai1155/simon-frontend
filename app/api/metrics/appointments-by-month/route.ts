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
    const callRes = await fetch(`${SUPABASE_URL}/rest/v1/call_analytics?select=created_at,appointments_booked`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
    const callData = await callRes.json()
    const emailRes = await fetch(`${SUPABASE_URL}/rest/v1/email_analytics?select=created_at,appointments_booked`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
    const emailData = await emailRes.json()
    const monthly = Array(12).fill(0)
    ;[...callData, ...emailData].forEach((row: any) => {
      if (!row.created_at) return
      const date = new Date(row.created_at)
      if (date.getFullYear() !== year) return
      const month = date.getMonth()
      monthly[month] += safeNumber(row.appointments_booked)
    })
    const result = MONTHS.map((m, i) => ({ month: m, appointments: monthly[i] }))
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json([], { status: 500 })
  }
} 