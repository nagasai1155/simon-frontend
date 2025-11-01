"use client"

import { useState } from "react"
import { ArrowLeft, Mail, Calendar, Phone, Plus, Zap, LinkIcon } from "lucide-react"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import EmailAccountsModal from "@/components/email-accounts-modal"
import CalendarModal from "@/components/calendar-modal"
import PhoneNumberModal from "@/components/phone-number-modal"
import VoiceModal from "@/components/voice-modal"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AIAgentConfigurationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)

  const [selectedEmails, setSelectedEmails] = useState<any[]>([])
  const [selectedCalendar, setSelectedCalendar] = useState<any>(null)
  const [selectedPhones, setSelectedPhones] = useState<any[]>([])
  const [selectedVoice, setSelectedVoice] = useState<any>(null)

  const [scriptContent, setScriptContent] = useState(
    "Hi {{name}},\n\nI noticed you recently visited our website and showed interest in our AI solutions. I'd love to schedule a quick call to discuss how we can help your business leverage AI for better results.\n\nWould you be available for a 15-minute call this week?\n\nBest regards,\nAI Sales Agent",
  )

  const [emailContent, setEmailContent] = useState(
    "Subject: Follow-up on our AI solutions\n\nHi {{name}},\n\nI hope this email finds you well. I wanted to follow up on your interest in our AI solutions. Our platform can help you automate customer interactions, improve response times, and increase conversion rates.\n\nI'd be happy to provide more information or schedule a demo at your convenience.\n\nBest regards,\nAI Sales Agent",
  )

  const handleSaveScript = () => {
    // Save script logic would go here
    toast({
      description: "All Systems Are Up And Running",
      variant: "default",
      className: "bg-[#0f1117] text-gray-200 border-none",
      icon: <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />,
    })
  }

  const handleSaveEmail = () => {
    // Save email logic would go here
    toast({
      description: "Email System Is Down",
      variant: "default",
      className: "bg-[#0f1117] text-gray-200 border-none",
      icon: <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />,
    })
  }

  const handleNext = () => {
    router.push("/ai-agents/new/review")
  }

  const [bookingLink, setBookingLink] = useState("")

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
            <span>Configuration</span>
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold mb-6">Configure Your AI Agent</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-medium">
                <ArrowLeft className="w-4 h-4 rotate-180 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-sm font-medium">Basics</span>
              </div>
            </div>
            <div className="w-16 h-0.5 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                2
              </div>
              <div className="ml-3">
                <span className="text-sm font-medium">Configurations</span>
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

          {/* Script Example */}
          <div className="mb-8">
            <div className="mb-2">
              <h2 className="text-xl font-semibold">Script Example</h2>
              <p className="text-sm text-muted-foreground">This is the script your AI will use in a campaign</p>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6">
                <textarea
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  className="w-full h-48 bg-transparent border-0 focus:outline-none resize-none text-foreground"
                />
              </div>
              <div className="flex justify-end p-3 border-t border-border bg-card/80">
                <button
                  onClick={handleSaveScript}
                  className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Email Example */}
          <div>
            <div className="mb-2">
              <h2 className="text-xl font-semibold">Email Example</h2>
              <p className="text-sm text-muted-foreground">This is the email your AI will use in a campaign</p>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6">
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="w-full h-48 bg-transparent border-0 focus:outline-none resize-none text-foreground"
                />
              </div>
              <div className="flex justify-end p-3 border-t border-border bg-card/80">
                <button
                  onClick={handleSaveEmail}
                  className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Configuration Panel */}
        <div className="w-96 border-l border-border bg-muted/30 p-6 overflow-auto">
          <h2 className="text-xl font-semibold mb-6">Configurations</h2>

          {/* Voice */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Voice</label>
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="w-full flex items-center justify-between p-3 bg-card hover:bg-card/80 border border-border rounded-lg transition-colors"
            >
              <span className="text-muted-foreground">Choose a voice...</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Outreach Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Outreach Email</label>
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="w-full flex items-center justify-between p-3 bg-card hover:bg-card/80 border border-border rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-muted-foreground" />
                <div className="text-left">
                  <div className="text-sm">Select Email Accounts</div>
                  <div className="text-xs text-muted-foreground">Connect email for outreach</div>
                </div>
              </div>
              <Plus className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Calendar */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Calendar</label>
            <button
              onClick={() => setIsCalendarModalOpen(true)}
              className="w-full flex items-center justify-between p-3 bg-card hover:bg-card/80 border border-border rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-muted-foreground" />
                <div className="text-left">
                  <div className="text-sm">Select Calendar</div>
                  <div className="text-xs text-muted-foreground">Connect for scheduling</div>
                </div>
              </div>
              <Plus className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <button
              onClick={() => setIsPhoneModalOpen(true)}
              className="w-full flex items-center justify-between p-3 bg-card hover:bg-card/80 border border-border rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-muted-foreground" />
                <div className="text-left">
                  <div className="text-sm">Select Phone Number</div>
                  <div className="text-xs text-muted-foreground">Attach phone number</div>
                </div>
              </div>
              <Plus className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Booking Link */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Booking Link</label>
            <p className="text-sm text-muted-foreground mb-3">
              Paste in the booking link. We'll share this with the user when they show interest and are ready to hop on
              a call...
            </p>
            <div className="w-full flex items-center p-3 bg-card border border-border rounded-lg">
              <LinkIcon className="w-5 h-5 mr-3 text-muted-foreground" />
              <input
                type="url"
                value={bookingLink}
                onChange={(e) => setBookingLink(e.target.value)}
                placeholder="Paste your booking link here..."
                className="w-full bg-transparent border-0 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Test Your Agent */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5" />
              <h3 className="text-lg font-medium">Test Your Agent</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Try out your agent with test data</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors">
                Test Agent
              </button>
            </div>
          </div>

          {/* Navigation Button */}
          <div className="pt-4 mt-8 border-t border-border">
            <button
              onClick={handleNext}
              className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <EmailAccountsModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSelect={setSelectedEmails}
        selectedAccounts={selectedEmails}
      />

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        onSelect={setSelectedCalendar}
        selectedProvider={selectedCalendar?.id}
      />

      <PhoneNumberModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onSelect={setSelectedPhones}
        selectedNumbers={selectedPhones}
      />

      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSelect={setSelectedVoice}
        selectedVoice={selectedVoice?.id}
      />

      {/* Custom styled toaster */}
      <Toaster />
    </div>
  )
}
