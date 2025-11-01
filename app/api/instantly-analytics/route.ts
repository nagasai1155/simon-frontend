import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual API key when provided
    const INSTANTLY_API_KEY = "" // Will be provided later
    
    if (!INSTANTLY_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Instantly API key not configured',
          message: 'Please provide the Instantly API key to enable email analytics'
        },
        { status: 503 }
      )
    }

    const response = await fetch(
      `https://api.instantly.ai/api/v2/campaigns/analytics/daily?campaign_status=1&end_date=${endDate}&start_date=${startDate}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${INSTANTLY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Instantly API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Process the response data according to Instantly API structure
    const processedData = {
      clicks: data.clicks || 0,
      clickRate: data.click_rate || 0,
      opens: data.opens || 0,
      openRate: data.open_rate || 0,
      replies: data.replies || 0,
      replyRate: data.reply_rate || 0,
      bounces: data.bounces || 0,
      bounceRate: data.bounce_rate || 0,
      deliveries: data.deliveries || 0,
      deliveryRate: data.delivery_rate || 0
    }

    return NextResponse.json(processedData)
    
  } catch (error) {
    console.error('Error fetching Instantly analytics:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch Instantly analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
