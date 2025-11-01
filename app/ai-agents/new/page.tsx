"use client"

import { useState } from "react"
import { ArrowLeft, BookOpen, Clock, Zap } from "lucide-react"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import { useRouter } from "next/navigation"

export default function NewAIAgentPage() {
  const router = useRouter()
  const [agentName, setAgentName] = useState("")
  const [agentDescription, setAgentDescription] = useState("")
  const [agentType, setAgentType] = useState<"batch" | "instant">("batch")

  // Add a new state for the preferred CTA and email information
  const [preferredCta, setPreferredCta] = useState<"appointment" | "email">("appointment")
  const [emailInformation, setEmailInformation] = useState("")

  const handleNext = () => {
    if (agentName.trim()) {
      router.push("/ai-agents/new/configuration")
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link
              href="/ai-agents"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>AI Agents</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Create New Agent</span>
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold mb-8">Create a New AI Agent</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                1
              </div>
              <div className="ml-3">
                <span className="text-sm font-medium">Basics</span>
              </div>
            </div>
            <div className="w-16 h-0.5 bg-border"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-medium">
                2
              </div>
              <div className="ml-3">
                <span className="text-sm text-muted-foreground">Configurations</span>
              </div>
            </div>
            <div className="w-16 h-0.5 bg-border"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-medium">
                3
              </div>
              <div className="ml-3">
                <span className="text-sm text-muted-foreground">Review</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="E.g., Sales Assistant, Lead Qualifier, Demo Scheduler..."
                className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                placeholder="Describe what it will exactly do and what it is being built for"
                rows={4}
                className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium mb-2">Purpose</label>
              <p className="text-sm text-muted-foreground mb-3">Select how this agent will be used in your campaigns</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer ${
                    agentType === "batch"
                      ? "border-primary bg-primary/5"
                      : "border-input bg-background hover:bg-muted/50"
                  }`}
                  onClick={() => setAgentType("batch")}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Clock className="w-4 h-4 text-foreground" />
                    </div>
                    <h3 className="text-base font-medium">Batch Calling</h3>
                  </div>
                  <p className="text-xs text-muted-foreground ml-11">For scheduled campaigns</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Agent will make calls to a list of contacts on a schedule
                  </p>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer ${
                    agentType === "instant"
                      ? "border-primary bg-primary/5"
                      : "border-input bg-background hover:bg-muted/50"
                  }`}
                  onClick={() => setAgentType("instant")}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Zap className="w-4 h-4 text-foreground" />
                    </div>
                    <h3 className="text-base font-medium">Instant Calling</h3>
                  </div>
                  <p className="text-xs text-muted-foreground ml-11">For real-time campaigns</p>
                  <p className="text-xs text-muted-foreground mt-3">Agent will respond immediately to incoming leads</p>
                </div>
              </div>
            </div>

            {/* Preferred CTA */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Preferred CTA</label>
              <p className="text-sm text-muted-foreground mb-3">Select the primary call-to-action for this agent</p>

              <div className="space-y-3">
                <div
                  className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                    preferredCta === "appointment"
                      ? "border-primary bg-primary/5"
                      : "border-input bg-background hover:bg-muted/50"
                  }`}
                  onClick={() => setPreferredCta("appointment")}
                >
                  <div className="w-5 h-5 rounded-full border border-input flex items-center justify-center mr-3">
                    {preferredCta === "appointment" && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Book an appointment</h3>
                    <p className="text-xs text-muted-foreground">Agent will schedule meetings with interested leads</p>
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                    preferredCta === "email"
                      ? "border-primary bg-primary/5"
                      : "border-input bg-background hover:bg-muted/50"
                  }`}
                  onClick={() => setPreferredCta("email")}
                >
                  <div className="w-5 h-5 rounded-full border border-input flex items-center justify-center mr-3">
                    {preferredCta === "email" && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Send information via email</h3>
                    <p className="text-xs text-muted-foreground">
                      Agent will send requested information to interested leads
                    </p>
                  </div>
                </div>

                {/* Conditional text field for email information */}
                {preferredCta === "email" && (
                  <div className="mt-3">
                    <textarea
                      value={emailInformation}
                      onChange={(e) => setEmailInformation(e.target.value)}
                      placeholder="Describe the exact information that you need to send to your clients after they express interest"
                      rows={4}
                      className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none mt-2"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Knowledge Base */}
            <div>
              <label className="block text-sm font-medium mb-2">Knowledge Base</label>
              <p className="text-sm text-muted-foreground mb-3">Assign knowledge base documents to your agent</p>

              <button className="flex items-center gap-2 px-4 py-2 bg-background hover:bg-muted/50 border border-input rounded-lg text-sm transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>Assign</span>
              </button>
              <p className="text-xs text-muted-foreground mt-2">No knowledge base assigned</p>
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  agentName.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                disabled={!agentName.trim()}
              >
                <span>Next</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
