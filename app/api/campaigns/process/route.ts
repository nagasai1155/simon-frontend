import { type NextRequest, NextResponse } from "next/server"
import { processCampaignsInWorkingHours } from "@/app/actions/campaign-scheduler"

// This endpoint can be called by a cron job or external scheduler
export async function POST(request: NextRequest) {
  try {
    console.log("Processing campaigns endpoint called")

    await processCampaignsInWorkingHours()

    return NextResponse.json({
      success: true,
      message: "Campaigns processed successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Campaign processing error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Campaign processing endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
