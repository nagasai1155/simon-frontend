import { type NextRequest, NextResponse } from "next/server"
import { processCampaignsInWorkingHours } from "@/app/actions/campaign-scheduler"

export async function POST(request: NextRequest) {
  try {
    console.log("Campaign scheduler endpoint called")

    await processCampaignsInWorkingHours()

    return NextResponse.json({
      success: true,
      message: "Campaign processing completed",
    })
  } catch (error) {
    console.error("Campaign scheduler error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Campaign scheduler is running",
    timestamp: new Date().toISOString(),
  })
}
