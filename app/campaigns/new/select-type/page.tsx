"use client"

import { useState } from "react"
import { Clock, Zap, Calendar, Users, BarChart, Sparkles } from "lucide-react"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import { useRouter } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

export default function SelectCampaignType() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const { theme } = useTheme()
  const isLight = theme === "light"

  const handleContinue = () => {
    if (selectedType === "realtime") {
      router.push("/campaigns/new/realtime")
    } else if (selectedType === "scheduled") {
      router.push("/campaigns/new/scheduled")
    }
  }

  return (
    <div className={`flex h-screen ${isLight ? "bg-gray-50" : "bg-black"} ${isLight ? "text-gray-900" : "text-white"}`}>
      {/* Main Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/campaigns"
                className={`${isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-400 hover:text-white"} transition-colors`}
              >
                Campaigns
              </Link>
              <span className={isLight ? "text-gray-400" : "text-gray-600"}>/</span>
              <span>New Campaign</span>
            </div>
            <h1 className="text-2xl font-bold">Choose Your Campaign Type</h1>
          </div>

          {/* Campaign Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Scheduled Campaign */}
            <div
              className={`relative overflow-hidden cursor-pointer rounded-xl transition-all duration-300 ${
                isLight
                  ? `border-2 ${selectedType === "scheduled" ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200" : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"}`
                  : `border-2 ${selectedType === "scheduled" ? "border-blue-400 bg-blue-950/20 shadow-lg ring-2 ring-blue-400/30" : "border-[#222222] bg-[#0a0a0a] hover:border-gray-500"}`
              }`}
              onClick={() => setSelectedType("scheduled")}
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full ${isLight ? "bg-blue-50" : "bg-[#111111]"}`}
                  >
                    <Clock className="w-7 h-7 text-[#016AFF]" />
                  </div>
                  {selectedType === "scheduled" && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">Scheduled Campaign</h2>
                    <p className={isLight ? "text-gray-500" : "text-gray-400"}>Send on your schedule</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className={`flex items-center gap-3 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    <Calendar className="w-5 h-5 text-[#016AFF]" />
                    <span>Send at optimal times</span>
                  </div>
                  <div className={`flex items-center gap-3 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    <Users className="w-5 h-5 text-[#016AFF]" />
                    <span>Import contacts from CSV or CRM</span>
                  </div>
                  <div className={`flex items-center gap-3 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    <BarChart className="w-5 h-5 text-[#016AFF]" />
                    <span>Track campaign performance</span>
                  </div>
                </div>

                <div className={`pt-4 ${isLight ? "border-t border-gray-100" : "border-t border-[#222222]"}`}>
                  <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Best for: Cold outreach, newsletters, and planned communications
                  </p>
                </div>
              </div>
            </div>

            {/* Real-time Campaign */}
            <div
              className={`relative overflow-hidden cursor-pointer rounded-xl transition-all duration-300 ${
                isLight
                  ? `border-2 ${selectedType === "realtime" ? "border-yellow-500 bg-yellow-50 shadow-lg ring-2 ring-yellow-200" : "border-gray-200 bg-white hover:border-yellow-300 hover:shadow-md"}`
                  : `border-2 ${selectedType === "realtime" ? "border-yellow-400 bg-yellow-950/20 shadow-lg ring-2 ring-yellow-400/30" : "border-[#222222] bg-[#0a0a0a] hover:border-gray-500"}`
              }`}
              onClick={() => setSelectedType("realtime")}
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full ${isLight ? "bg-amber-50" : "bg-[#111111]"}`}
                  >
                    <Zap className="w-7 h-7 text-yellow-500" />
                  </div>
                  {selectedType === "realtime" && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">Real-Time Campaign</h2>
                    <p className={isLight ? "text-gray-500" : "text-gray-400"}>Respond instantly</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className={`flex items-center gap-3 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span>Immediate response to new leads</span>
                  </div>
                  <div className={`flex items-center gap-3 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span>AI-powered personalization</span>
                  </div>
                  <div className={`flex items-center gap-3 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    <BarChart className="w-5 h-5 text-yellow-500" />
                    <span>Real-time conversion analytics</span>
                  </div>
                </div>

                <div className={`pt-4 ${isLight ? "border-t border-gray-100" : "border-t border-[#222222]"}`}>
                  <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Best for: Inbound leads, website visitors, and form submissions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!selectedType}
              className={`px-8 py-3.5 rounded-lg text-base font-medium transition-all duration-300 ${
                selectedType
                  ? isLight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-black hover:bg-gray-200"
                  : isLight
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#1a1a1a] text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue with Selected Campaign
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
