"use client"

import { useState } from "react"
import { Check, Target, Mail, Calendar, Phone, Mic, BookOpen, Zap } from "lucide-react"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import { useRouter } from "next/navigation"

export default function AIAgentReviewPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sample data for the review page
  const agentData = {
    name: "Sales Qualifier",
    description: "Qualifies leads and schedules demos for sales team",
    type: "batch",
    voice: {
      name: "Emma",
      gender: "female",
      accent: "American",
    },
    emails: [{ email: "sales@blackvolution.com" }],
    calendar: {
      name: "Google Calendar + Calendly",
    },
    phone: {
      number: "+1 (555) 123-4567",
      nickname: "Sales Line",
    },
    knowledgeBase: "Sales Playbook",
  }

  const handleCreateAgent = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      router.push("/ai-agents")
    }, 1500)
  }

  // Script and email content as strings to avoid template literal issues
  const scriptContent = `Hi [NAME], I noticed you recently visited our website and showed interest in our AI solutions. I'd love to schedule a quick call to discuss how we can help your business leverage AI for better results. Would you be available for a 15-minute call this week? Best regards, AI Sales Agent`

  const emailContent = `Subject: Follow-up on our AI solutions

Hi [NAME], 

I hope this email finds you well. I wanted to follow up on your interest in our AI solutions. Our platform can help you automate customer interactions, improve response times, and increase conversion rates. 

I'd be happy to provide more information or schedule a demo at your convenience. 

Best regards, 
AI Sales Agent`

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex">
        {/* Left side - Preview Area */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/ai-agents" className="text-muted-foreground hover:text-foreground transition-colors">
              AI Agents
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/ai-agents/new" className="text-muted-foreground hover:text-foreground transition-colors">
              Create New Agent
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Review</span>
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold mb-6">Review Your AI Agent</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-medium">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-sm font-medium">Basics</span>
              </div>
            </div>
            <div className="w-16 h-0.5 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-medium">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-sm font-medium">Configurations</span>
              </div>
            </div>
            <div className="w-16 h-0.5 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                3
              </div>
              <div className="ml-3">
                <span className="text-sm font-medium">Review</span>
              </div>
            </div>
          </div>

          {/* Script Example */}
          <div className="mb-8">
            <div className="mb-2">
              <h2 className="text-xl font-semibold">Script Example</h2>
              <p className="text-sm text-muted-foreground">This is the script your AI will use in a campaign</p>
            </div>
            <div className="bg-muted/50 border border-border rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="text-foreground whitespace-pre-line">{scriptContent}</div>
              </div>
            </div>
          </div>

          {/* Email Example */}
          <div>
            <div className="mb-2">
              <h2 className="text-xl font-semibold">Email Example</h2>
              <p className="text-sm text-muted-foreground">This is the email your AI will use in a campaign</p>
            </div>
            <div className="bg-muted/50 border border-border rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="text-foreground whitespace-pre-line">{emailContent}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Configuration Panel */}
        <div className="w-96 border-l border-border bg-muted/30 p-6 overflow-auto">
          <h2 className="text-xl font-semibold mb-6">Agent Summary</h2>

          {/* Agent Basic Info */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-base font-medium mb-1">{agentData.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{agentData.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                    {agentData.type === "batch" ? "Scheduled" : "Real-Time"}
                  </span>
                  {agentData.knowledgeBase && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {agentData.knowledgeBase}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Details */}
          <div className="space-y-4 mb-8">
            <h3 className="text-base font-medium mb-2">Configuration Details</h3>

            {/* Voice */}
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Voice</h4>
                  <p className="text-xs text-muted-foreground">
                    {agentData.voice.name} ({agentData.voice.gender}, {agentData.voice.accent})
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Email Accounts</h4>
                  <p className="text-xs text-muted-foreground">{agentData.emails.map((e) => e.email).join(", ")}</p>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Calendar</h4>
                  <p className="text-xs text-muted-foreground">{agentData.calendar.name}</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Phone Number</h4>
                  <p className="text-xs text-muted-foreground">
                    {agentData.phone.number} ({agentData.phone.nickname})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Your Agent */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5" />
              <h3 className="text-base font-medium">Test Your Agent</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Try out your agent with test data</p>

            <button className="w-full py-2.5 bg-card hover:bg-card/80 border border-border rounded-lg text-sm transition-colors">
              Test Agent
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 mt-8 border-t border-border space-y-3">
            <Link
              href="/ai-agents/new/configuration"
              className="block w-full py-2.5 bg-card hover:bg-card/80 text-foreground rounded-lg text-sm transition-colors text-center"
            >
              Back to Configuration
            </Link>

            <button
              onClick={handleCreateAgent}
              disabled={isSubmitting}
              className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Agent...
                </>
              ) : (
                <>
                  <span>Create Agent</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
