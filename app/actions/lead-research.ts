"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

interface ResearchQuery {
  leadId: string
  companyName?: string
  website?: string
  firstName?: string
  lastName?: string
}

interface ResearchResult {
  leadId: string
  researchData: string
  urls: string[]
  success: boolean
  error?: string
}

// Brave Search API integration
async function searchBrave(query: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=15`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": "BSAGrssryvaqwnwrw74o7exc92BjBii",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Brave Search API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Brave Search error:", error)
    throw error
  }
}

// Extract URLs from Brave API response
function extractUrls(data: any): string[] {
  let urls: string[] = []

  // Helper to extract URLs from an array of result objects
  function extractUrlsFromArray(arr: any[]): string[] {
    if (!Array.isArray(arr)) return []
    return arr.map((r) => r.url).filter((url) => typeof url === "string" && url.startsWith("http"))
  }

  // From web results
  if (data.web && data.web.results) {
    urls = urls.concat(extractUrlsFromArray(data.web.results))
  }

  // From news results
  if (data.news && data.news.results) {
    urls = urls.concat(extractUrlsFromArray(data.news.results))
  }

  // From videos results
  if (data.videos && data.videos.results) {
    urls = urls.concat(extractUrlsFromArray(data.videos.results))
  }

  // Remove duplicates and limit to 15
  return [...new Set(urls)].slice(0, 15)
}

// Scrape content using Jina AI
async function scrapeWithJina(url: string): Promise<string> {
  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer jina_fcb38f8e01104ba69f0643f001abcca751YKH97NZKBaZOz4t5Bow-UhxZ66",
      },
      timeout: 15000,
    })

    if (!response.ok) {
      console.warn(`Failed to scrape ${url}: ${response.status}`)
      return ""
    }

    return await response.text()
  } catch (error) {
    console.warn(`Error scraping ${url}:`, error)
    return ""
  }
}

// Ultra text cleaner function
function cleanText(text: string): string {
  const raw = typeof text === "string" ? text : JSON.stringify(text || "")

  return (
    raw
      // Remove newlines and compress all spacing
      .replace(/\\n|\\r|\n|\r/g, " ")
      .replace(/\s{2,}/g, " ")

      // Remove markdown emphasis, bullets, headings
      .replace(/[*_~`#>-]+/g, "")

      // Remove markdown/image/link structures
      .replace(/\[.*?\]$$[^)]+$$/g, "") // [text](url)
      .replace(/!\[.*?\]$$[^)]+$$/g, "") // ![img](url)
      .replace(/\[.*?\]/g, "") // [text]
      .replace(/$$[^)]+$$/g, "") // (stuff)

      // Remove full URLs or domain-like text
      .replace(/https?:\/\/[^\s]+/gi, "")
      .replace(/\b(?:[a-z0-9.-]+\.[a-z]{2,})(?:\/[^\s]*)?\b/gi, "")

      // Remove encoded characters like &nbsp;, &#123;, etc.
      .replace(/&[a-z]+;|&#\d+;|&#x[a-fA-F0-9]+;/g, "")

      // Remove common website navigation/UI/CTA text
      .replace(
        /\b(Submit|Menu|Close|Next|Previous|Email address|Back to top|Click here|Read more|Learn more|Home|About|Contact|Terms|Privacy|Security|Download|Join|Login|Logout|Register|API Key|Documentation|Status|Support|Careers|Follow us|All rights reserved)\b/gi,
        "",
      )

      // Remove emojis and special unicode
      .replace(/[\u2190-\u21FF\u2600-\u27BF\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}©®™✓✔️❤️•·…—–]/gu, "")

      // Remove technical metadata or leftover fields
      .replace(
        /\b(openinnew|showSecondLayer|tokens:\d+|usage|metadata|footer|header|nav|main|sidebar|section|timestamp|cookie settings)\b/gi,
        "",
      )

      // Strip out all brackets and repeated punctuation
      .replace(/[[\]{}<>]+/g, "")
      .replace(/([.,!?;])\1+/g, "$1")

      // Collapse into a clean single line
      .trim()
      .replace(/\s{2,}/g, " ")
  )
}

// Gemini AI processing function
async function processWithGemini(cleanedData: string, leadInfo: ResearchQuery): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI("AIzaSyBL9t0eHIiprYNe-8ERQeMMsgnLZ4X6yg8")
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `You are a research AI trained to convert raw, unstructured business data scraped from the internet into a highly structured and actionable report. Your goal is to condense messy and overlapping data (from company websites, Crunchbase, ZoomInfo, LinkedIn, Google results, etc.) into a clean, insight-rich summary designed specifically to help sales reps and marketers personalize cold emails, cold calls, and outreach campaigns.

You will eliminate noise, synthesize overlapping details, and highlight outreach angles.

⚙️ OUTPUT STRUCTURE
🔍 Summary Insights [Top 3 Things to Know]

Quickly highlight the most critical insights (e.g., "Raised $10M last month," "Hiring 3 SDRs," "Uses HubSpot + Salesforce").

1. Company Overview

Name:
Website:
Industry:
Founded:
Headquarters:
Size:
Estimated Revenue:

2. Decision-Makers

CEO:
VP of Marketing / CMO:
Head of Sales / CRO:
CTO / Head of Product:
Other Contacts (if relevant):

Include LinkedIn URLs if available.

3. Recent Activity & Triggers

Funding Events: [Round, Date, Amount, Investors]
Hiring Trends: [Roles, Growth Signals]
Product Updates: [Launches, new features, changes]
News/PR Highlights: [Strategic shifts, partnerships, expansions]

Only include recent (last 6 months) and sales-relevant items.

4. Products & Services

Core Offerings:
Key Industries Served:
Unique Differentiators:
Pain Points Solved:

5. Tech Stack (Sales/Marketing/Website)

CRM:
Email/Marketing Tools:
Website CMS:
Sales Enablement Tools:
Other notable tools (Chat, AI, etc.):

6. Target Audience & ICP

Who are they selling to?
B2B/B2C? SMB, mid-market, or enterprise?

7. Competitors & Market Position

Top Competitors:
Positioning / Strengths:
Current Challenges (if any):

8. Online Presence & Reputation

LinkedIn:
Twitter/X:
Glassdoor Sentiment:
Review Sites (Trustpilot, G2, etc.):

9. Outreach Strategy Recommendations

Cold Email Hook Ideas:
e.g., "Noticed you're hiring SDRs — we help companies like yours 2x meetings using AI outreach."

Cold Call Opener Ideas:
e.g., "Hey John, saw you're fresh off a Series A — are you exploring new channels for lead gen?"

Personalization Angles:
e.g., "Your recent move into the UK market stood out..."

10. Contact Info

Main Email / Form URL:
Phone (if available):
HQ Address:

📌 Notes
Omit empty sections.
Do not repeat info across sections.
Remove generic/boilerplate marketing language.
If decision-maker info is missing, infer from titles in job listings or org charts.
Prioritize signals that can be leveraged for outreach.

###Lead Information:
Company: ${leadInfo.companyName || "Unknown"}
Website: ${leadInfo.website || "Unknown"}
Contact: ${leadInfo.firstName || ""} ${leadInfo.lastName || ""}

###Here you go with the data we get which you have to process:

${cleanedData}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const processedData = response.text()

    console.log(`Gemini processing completed for lead ${leadInfo.leadId}. Output length: ${processedData.length}`)
    return processedData
  } catch (error) {
    console.error(`Gemini processing failed for lead ${leadInfo.leadId}:`, error)
    // Return cleaned data as fallback if Gemini fails
    return cleanedData
  }
}

// Main research function
export async function researchLead(query: ResearchQuery): Promise<ResearchResult> {
  try {
    console.log(`Starting research for lead ${query.leadId}`)

    // Build search query
    let searchQuery = ""
    if (query.companyName && query.website) {
      searchQuery = `${query.companyName}, ${query.website}`
    } else if (query.companyName) {
      searchQuery = query.companyName
    } else if (query.website) {
      searchQuery = query.website
    } else if (query.firstName && query.lastName) {
      searchQuery = `${query.firstName} ${query.lastName}`
    } else {
      throw new Error("Insufficient information to research lead")
    }

    console.log(`Search query: ${searchQuery}`)

    // Step 1: Search with Brave
    const searchResults = await searchBrave(searchQuery)

    // Step 2: Extract URLs
    const urls = extractUrls(searchResults)
    console.log(`Found ${urls.length} URLs to scrape`)

    if (urls.length === 0) {
      return {
        leadId: query.leadId,
        researchData: "No relevant information found",
        urls: [],
        success: true,
      }
    }

    // Step 3: Scrape content from URLs (parallel processing)
    const scrapePromises = urls.map((url) => scrapeWithJina(url))
    const scrapedContent = await Promise.all(scrapePromises)

    // Step 4: Combine and clean all content
    const combinedContent = scrapedContent.filter((content) => content.length > 0).join(" ")
    const cleanedContent = cleanText(combinedContent)

    // Step 5: Process with Gemini AI for structured output
    console.log(`Processing with Gemini AI for lead ${query.leadId}`)
    const processedContent = await processWithGemini(cleanedContent, query)

    console.log(`Research completed for lead ${query.leadId}. Final content length: ${processedContent.length}`)

    return {
      leadId: query.leadId,
      researchData: processedContent,
      urls: urls,
      success: true,
    }
  } catch (error) {
    console.error(`Research failed for lead ${query.leadId}:`, error)
    return {
      leadId: query.leadId,
      researchData: "",
      urls: [],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Batch research function for multiple leads
export async function researchLeads(queries: ResearchQuery[]): Promise<ResearchResult[]> {
  console.log(`Starting batch research for ${queries.length} leads`)

  // Process leads in batches of 3 to avoid overwhelming APIs
  const batchSize = 3
  const results: ResearchResult[] = []

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize)
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(queries.length / batchSize)}`)

    const batchPromises = batch.map((query) => researchLead(query))
    const batchResults = await Promise.all(batchPromises)

    results.push(...batchResults)

    // Add delay between batches to respect API limits
    if (i + batchSize < queries.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  console.log(`Batch research completed. ${results.filter((r) => r.success).length}/${results.length} successful`)
  return results
}

// Save research results to database
export async function saveResearchResults(results: ResearchResult[]): Promise<void> {
  try {
    const researchData = results.map((result) => ({
      lead_id: result.leadId,
      research_data: result.researchData, // This now contains the Gemini-processed structured data
      processed_data: result.researchData, // Store the structured output
      urls: result.urls,
      success: result.success,
      error: result.error || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const response = await fetch(`https://sfktedqfipvuucelpggb.supabase.co/rest/v1/lead_research`, {
      method: "POST",
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(researchData),
    })

    if (!response.ok) {
      throw new Error(`Failed to save research results: ${response.status}`)
    }

    console.log(`Saved ${results.length} processed research results to database`)
  } catch (error) {
    console.error("Error saving research results:", error)
    throw error
  }
}
