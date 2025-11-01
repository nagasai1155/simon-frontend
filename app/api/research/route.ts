import { type NextRequest, NextResponse } from "next/server"
import { researchLead } from "@/app/actions/lead-research"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // For direct API testing - convert query string to research query format
    const researchQuery = {
      leadId: "api-test",
      companyName: query.includes(",") ? query.split(",")[0].trim() : query,
      website: query.includes(",") ? query.split(",")[1]?.trim() : undefined,
    }

    const result = await researchLead(researchQuery)

    return NextResponse.json({
      success: result.success,
      data: result.researchData,
      urls: result.urls,
      error: result.error,
    })
  } catch (error) {
    console.error("Research API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
