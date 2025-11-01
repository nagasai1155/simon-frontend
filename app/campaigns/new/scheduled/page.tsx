"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowRight, Edit2, Check, Folder, Users, Calendar } from "lucide-react"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import { useTheme } from "@/components/theme-provider"
import { getLeadLists, createCampaign } from "@/app/actions/campaigns"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface LeadList {
  id: string
  name: string
  description?: string
  "created date"?: string
}

export default function NewScheduledCampaign() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [campaignName, setCampaignName] = useState("New Scheduled Campaign")
  const [isEditingName, setIsEditingName] = useState(false)
  const { theme } = useTheme()
  const isLight = theme === "light"

  // Campaign data states
  const [selectedLeadList, setSelectedLeadList] = useState<string>("")
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [selectedTimezone, setSelectedTimezone] = useState("America/New_York")
  const [activeDays, setActiveDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
  const [workingHoursStart, setWorkingHoursStart] = useState("9:00 AM")
  const [workingHoursEnd, setWorkingHoursEnd] = useState("5:00 PM")
  const [doubleDial, setDoubleDial] = useState(true)
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true)
  const [leadLists, setLeadLists] = useState<LeadList[]>([])
  const [isLoadingLeadLists, setIsLoadingLeadLists] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)
  const router = useRouter()

  // Updated steps - removed AI Agent step
  const steps = [
    { id: 1, name: "Select Lead List", number: 1 },
    { id: 2, name: "Select Channels", number: 2 },
    { id: 3, name: "Launch", number: 3 },
  ]

  // Days of the week for the schedule
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Load lead lists on component mount
  useEffect(() => {
    loadLeadLists()
  }, [])

  const loadLeadLists = async () => {
    setIsLoadingLeadLists(true)
    try {
      const result = await getLeadLists()
      if (result.success && result.data) {
        setLeadLists(result.data)
      } else {
        toast.error("Failed to load lead lists")
      }
    } catch (error) {
      console.error("Error loading lead lists:", error)
      toast.error("Error loading lead lists")
    } finally {
      setIsLoadingLeadLists(false)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCampaignNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCampaignName(e.target.value)
  }

  const handleCampaignNameBlur = () => {
    setIsEditingName(false)
    if (!campaignName.trim()) {
      setCampaignName("New Scheduled Campaign")
    }
  }

  const handleCampaignNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCampaignNameBlur()
    }
  }

  const handleChannelSelect = (channel: string) => {
    setSelectedChannels((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]))
  }

  const handleDayToggle = (day: string) => {
    setActiveDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleLaunchCampaign = async () => {
    setIsLaunching(true)

    try {
      console.log("🚀 LAUNCHING CAMPAIGN...")

      const campaignData = {
        name: campaignName,
        type: "scheduled",
        leadListId: selectedLeadList,
        channels: selectedChannels,
        timezone: selectedTimezone,
        activeDays: activeDays,
        workingHoursStart: workingHoursStart,
        workingHoursEnd: workingHoursEnd,
        doubleDial: doubleDial,
        personalization: personalizationEnabled,
      }

      console.log("📊 Campaign data:", campaignData)

      const result = await createCampaign(campaignData)
      console.log("📈 Campaign creation result:", result)

      if (result.success) {
        // ALWAYS check webhook result and show appropriate message
        if (result.webhookResult) {
          const { successCount, failureCount, totalLeads } = result.webhookResult

          console.log(`📊 Webhook Results: ${successCount}/${totalLeads} successful, ${failureCount} failed`)

          if (successCount === totalLeads && totalLeads > 0) {
            toast.success(`🎉 Campaign launched successfully! All ${totalLeads} leads sent to processing.`, {
              duration: 5000,
            })
          } else if (successCount > 0) {
            toast.success(
              `⚠️ Campaign launched! ${successCount}/${totalLeads} leads sent successfully. ${failureCount} failed.`,
              {
                duration: 5000,
              },
            )
          } else if (totalLeads === 0) {
            toast.success(`🎉 Campaign launched successfully! No leads found in the selected list.`, {
              duration: 5000,
            })
          } else {
            toast.error(`❌ Campaign created but failed to send leads to processing. Please try again.`, {
              duration: 5000,
            })
          }
        } else {
          toast.error(`❌ Campaign created but webhook process failed. Please check logs.`, {
            duration: 5000,
          })
        }

        // Redirect to campaigns page after a short delay
        setTimeout(() => {
          router.push("/campaigns")
        }, 3000)
      } else {
        console.error("❌ Campaign creation failed:", result.error)
        toast.error(`❌ Failed to launch campaign: ${result.error}`, {
          duration: 5000,
        })
      }
    } catch (error) {
      console.error("💥 Critical error launching campaign:", error)
      toast.error(`💥 Critical error: ${error instanceof Error ? error.message : "Unknown error occurred"}`, {
        duration: 5000,
      })
    } finally {
      setIsLaunching(false)
    }
  }

  // Step validation logic
  const canProceedToStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return true
      case 2:
        return selectedLeadList !== ""
      case 3:
        return selectedLeadList !== "" && selectedChannels.length > 0
      default:
        return false
    }
  }

  const timezoneOptions = [
    "Pacific/Kiritimati",
    "Pacific/Apia",
    "Pacific/Auckland",
    "Pacific/Fiji",
    "Australia/Sydney",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Europe/London",
    "Europe/Paris",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Pacific/Honolulu",
  ]

  const workingHourOptions = [
    "12:00 AM",
    "1:00 AM",
    "2:00 AM",
    "3:00 AM",
    "4:00 AM",
    "5:00 AM",
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
    "11:00 PM",
  ]

  return (
    <div className={`flex h-screen ${isLight ? "bg-gray-50 text-gray-900" : "bg-[#050505] text-white"}`}>
      {/* Main Sidebar */}
      <Sidebar />

      {/* Campaign Creation Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Campaign Header */}
        <div className={`border-b ${isLight ? "border-gray-200 bg-white" : "border-[#1a1a1a] bg-[#0a0a0a]"} p-4`}>
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center">
              <Link
                href="/campaigns"
                className={`${isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-400 hover:text-white"} mr-2 transition-colors`}
              >
                <span className="text-sm">Campaigns</span>
              </Link>
              <span className={isLight ? "text-gray-400 mx-2" : "text-gray-600 mx-2"}>/</span>
              <Link
                href="/campaigns/new/select-type"
                className={`${isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-400 hover:text-white"} mr-2 transition-colors`}
              >
                <span className="text-sm">New Campaign</span>
              </Link>
              <span className={isLight ? "text-gray-400 mx-2" : "text-gray-600 mx-2"}>/</span>
              {isEditingName ? (
                <input
                  type="text"
                  value={campaignName}
                  onChange={handleCampaignNameChange}
                  onBlur={handleCampaignNameBlur}
                  onKeyDown={handleCampaignNameKeyDown}
                  autoFocus
                  className={`${isLight ? "bg-gray-50 border-gray-300 text-gray-900" : "bg-[#111111] border-[#333333] text-white"} border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-lg font-medium`}
                />
              ) : (
                <div className="flex items-center">
                  <h1 className="text-lg font-medium">{campaignName}</h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className={`ml-2 p-1 ${isLight ? "text-gray-500 hover:text-gray-900 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"} rounded-md transition-colors`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Campaign Content */}
        <div className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Campaign Steps Sidebar */}
            <div
              className={`w-64 border-r ${isLight ? "border-gray-200 bg-white" : "border-[#111111] bg-gradient-to-b from-[#0a0a0a] to-[#080808]"} p-4`}
            >
              <div className="space-y-3">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    className={`w-full py-3 px-4 rounded-md text-center transition-all flex items-center justify-between ${
                      step.id === currentStep
                        ? isLight
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-gradient-to-r from-white to-gray-200 text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        : completedSteps.includes(step.id)
                          ? isLight
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gradient-to-r from-[#1a1a1a] to-[#222222] text-white"
                          : canProceedToStep(step.id)
                            ? isLight
                              ? "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                              : "bg-[#0c0c0c] text-gray-400 border border-[#1a1a1a] hover:bg-[#101010] hover:border-[#222222]"
                            : isLight
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-[#0a0a0a] text-gray-600 cursor-not-allowed"
                    }`}
                    onClick={() => canProceedToStep(step.id) && setCurrentStep(step.id)}
                    disabled={!canProceedToStep(step.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-2.5 ${
                          step.id === currentStep
                            ? isLight
                              ? "bg-white text-blue-600"
                              : "bg-white text-black"
                            : completedSteps.includes(step.id)
                              ? "bg-green-500 text-white"
                              : isLight
                                ? "bg-blue-50 text-blue-500"
                                : "bg-[#1a1a1a] text-gray-400"
                        }`}
                      >
                        {completedSteps.includes(step.id) ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-xs font-medium">{step.number}</span>
                        )}
                      </div>
                      <span className="font-medium">{step.name}</span>
                    </div>
                    {step.id === currentStep && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div
              className={`flex-1 p-6 overflow-auto ${isLight ? "bg-gray-50" : "bg-gradient-to-br from-[#050505] to-[#070707]"}`}
            >
              {/* Step 1: Select Lead List */}
              {currentStep === 1 && (
                <div className="max-w-4xl mx-auto">
                  <h2
                    className={`text-2xl font-bold mb-2 ${isLight ? "text-gray-900" : "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"}`}
                  >
                    Select Lead List
                  </h2>
                  <p className={isLight ? "text-gray-600 mb-8" : "text-gray-400 mb-8"}>
                    Choose from your existing lead lists to target for this campaign.
                  </p>

                  {/* Lead Lists Grid */}
                  {isLoadingLeadLists ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-3 text-gray-500">Loading lead lists...</span>
                    </div>
                  ) : leadLists.length === 0 ? (
                    <div className="text-center py-12">
                      <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Lead Lists Found</h3>
                      <p className="text-gray-500 mb-6">
                        You need to create lead lists first before launching a campaign.
                      </p>
                      <Link
                        href="/contacts"
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Go to Contacts
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {leadLists.map((leadList) => (
                        <div
                          key={leadList.id}
                          onClick={() => setSelectedLeadList(leadList.id)}
                          className={`${isLight ? "bg-white" : "bg-[#0a0a0a]"} rounded-xl p-6 border cursor-pointer transition-all duration-300 hover:shadow-md ${
                            selectedLeadList === leadList.id
                              ? isLight
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                : "border-white bg-[#1a1a1a] ring-2 ring-white/20"
                              : isLight
                                ? "border-gray-200 hover:border-blue-300"
                                : "border-[#222222] hover:border-white/30"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                  selectedLeadList === leadList.id
                                    ? isLight
                                      ? "bg-blue-100"
                                      : "bg-white/10"
                                    : isLight
                                      ? "bg-gray-100"
                                      : "bg-[#1a1a1a]"
                                }`}
                              >
                                <Folder
                                  className={`w-6 h-6 ${
                                    selectedLeadList === leadList.id
                                      ? isLight
                                        ? "text-blue-600"
                                        : "text-white"
                                      : isLight
                                        ? "text-gray-600"
                                        : "text-gray-400"
                                  }`}
                                />
                              </div>
                            </div>
                            {selectedLeadList === leadList.id && (
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  isLight ? "bg-blue-500" : "bg-white"
                                }`}
                              >
                                <Check className={`w-4 h-4 ${isLight ? "text-white" : "text-black"}`} />
                              </div>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{leadList.name}</h3>
                          {leadList.description && (
                            <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"} mb-3`}>
                              {leadList.description}
                            </p>
                          )}
                          {leadList["created date"] && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(leadList["created date"]).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Next Button */}
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleNext}
                      disabled={!selectedLeadList}
                      className={`px-7 py-3.5 rounded-md text-base font-medium flex items-center ${
                        selectedLeadList
                          ? isLight
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-white hover:bg-gray-200 text-black"
                          : isLight
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#333333] text-gray-500 cursor-not-allowed"
                      } transition-all`}
                    >
                      <span>Next</span>
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Select Channels */}
              {currentStep === 2 && (
                <div className="max-w-5xl mx-auto">
                  <h2
                    className={`text-2xl font-bold mb-2 ${isLight ? "text-gray-900" : "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"}`}
                  >
                    Select Channels
                  </h2>
                  <p className={isLight ? "text-gray-600 mb-8" : "text-gray-400 mb-8"}>
                    Choose your outreach channels to connect with your prospects
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* AI Calls Card */}
                    <div
                      onClick={() => handleChannelSelect("calls")}
                      className={`${isLight ? "bg-white border" : "bg-gradient-to-br from-[#0c0c0c] to-[#111111] border"} ${
                        selectedChannels.includes("calls")
                          ? isLight
                            ? "border-blue-500 bg-blue-50"
                            : "border-white bg-[#1a1a1a]"
                          : isLight
                            ? "border-blue-200"
                            : "border-[#222222]"
                      } rounded-xl p-6 hover:border-opacity-70 transition-all duration-300 hover:shadow-md cursor-pointer group`}
                    >
                      <div className="flex flex-col items-center text-center h-full">
                        <div
                          className={`w-16 h-16 rounded-full ${isLight ? "bg-blue-50 group-hover:bg-blue-100" : "bg-[#1a1a1a] group-hover:bg-[#252525]"} flex items-center justify-center mb-4 transition-colors`}
                        >
                          <svg
                            className={`w-6 h-6 ${isLight ? "text-blue-600 group-hover:text-blue-700" : "text-gray-400 group-hover:text-white"} transition-colors`}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08C5.16 2.08 5.56 4 6.28 5.76C6.44 6.12 6.32 6.56 6 6.84L4.84 8C6.84 11.88 10.12 15.16 14 17.16L15.16 16C15.44 15.68 15.88 15.56 16.24 15.72C18 16.44 19.92 16.84 21.92 16.84C22.52 16.84 23 17.32 23 17.92V20.92Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">AI Calls</h3>
                        <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"} mb-6`}>
                          Get instant feedback on your offers through AI-powered phone conversations
                        </p>
                        <div className="mt-auto">
                          <div
                            className={`w-7 h-7 rounded-full border-2 ${
                              selectedChannels.includes("calls")
                                ? isLight
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-white bg-white"
                                : isLight
                                  ? "border-blue-300 group-hover:border-blue-500"
                                  : "border-[#333333] group-hover:border-white"
                            } flex items-center justify-center mx-auto transition-colors`}
                          >
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                selectedChannels.includes("calls")
                                  ? isLight
                                    ? "bg-white"
                                    : "bg-black"
                                  : "bg-transparent"
                              } transition-colors`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Emails Card */}
                    <div
                      onClick={() => handleChannelSelect("emails")}
                      className={`${isLight ? "bg-white border" : "bg-gradient-to-br from-[#0c0c0c] to-[#111111] border"} ${
                        selectedChannels.includes("emails")
                          ? isLight
                            ? "border-blue-500 bg-blue-50"
                            : "border-white bg-[#1a1a1a]"
                          : isLight
                            ? "border-blue-200"
                            : "border-[#222222]"
                      } rounded-xl p-6 hover:border-opacity-70 transition-all duration-300 hover:shadow-md cursor-pointer group`}
                    >
                      <div className="flex flex-col items-center text-center h-full">
                        <div
                          className={`w-16 h-16 rounded-full ${isLight ? "bg-blue-50 group-hover:bg-blue-100" : "bg-[#1a1a1a] group-hover:bg-[#252525]"} flex items-center justify-center mb-4 transition-colors`}
                        >
                          <svg
                            className={`w-8 h-8 ${isLight ? "text-blue-600 group-hover:text-blue-700" : "text-gray-400 group-hover:text-white"} transition-colors`}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">AI Emails</h3>
                        <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"} mb-6`}>
                          Send personalized outbound messages to your prospects with AI-powered email campaigns
                        </p>
                        <div className="mt-auto">
                          <div
                            className={`w-7 h-7 rounded-full border-2 ${
                              selectedChannels.includes("emails")
                                ? isLight
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-white bg-white"
                                : isLight
                                  ? "border-blue-300 group-hover:border-blue-500"
                                  : "border-[#333333] group-hover:border-white"
                            } flex items-center justify-center mx-auto transition-colors`}
                          >
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                selectedChannels.includes("emails")
                                  ? isLight
                                    ? "bg-white"
                                    : "bg-black"
                                  : "bg-transparent"
                              } transition-colors`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleNext}
                      disabled={selectedChannels.length === 0}
                      className={`px-7 py-3.5 rounded-md text-base font-medium flex items-center ${
                        selectedChannels.length > 0
                          ? isLight
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-white hover:bg-gray-200 text-black"
                          : isLight
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#333333] text-gray-500 cursor-not-allowed"
                      } transition-all`}
                    >
                      <span>Next</span>
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Launch */}
              {currentStep === 3 && (
                <div className="max-w-5xl mx-auto">
                  <h2
                    className={`text-2xl font-bold mb-2 ${isLight ? "text-gray-900" : "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"}`}
                  >
                    Launch Campaign
                  </h2>
                  <p className={isLight ? "text-gray-600 mb-8" : "text-gray-400 mb-8"}>
                    Review your campaign settings and schedule your outreach
                  </p>

                  <div
                    className={`${isLight ? "bg-white border border-gray-200" : "bg-gradient-to-br from-[#0c0c0c] to-[#111111] border border-[#1a1a1a]"} rounded-lg p-6 mb-6 shadow-md`}
                  >
                    <h3 className={`text-lg font-medium mb-5 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Schedule Settings
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isLight ? "text-gray-700" : "text-white"}`}>
                          Timezone
                        </label>
                        <select
                          value={selectedTimezone}
                          onChange={(e) => setSelectedTimezone(e.target.value)}
                          className={`w-full ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#1a1a1a] border-[#333333] text-white"} border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                        >
                          {timezoneOptions.map((timezone) => (
                            <option key={timezone} value={timezone}>
                              {timezone}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isLight ? "text-gray-700" : "text-white"}`}>
                          Active Days
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map((day) => (
                            <button
                              key={day}
                              onClick={() => handleDayToggle(day)}
                              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                                activeDays.includes(day)
                                  ? isLight
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-black"
                                  : isLight
                                    ? "bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                                    : "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]"
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isLight ? "text-gray-700" : "text-white"}`}>
                          Working Hours
                        </label>
                        <div className="flex items-center gap-3">
                          <select
                            value={workingHoursStart}
                            onChange={(e) => setWorkingHoursStart(e.target.value)}
                            className={`w-full ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#1a1a1a] border-[#333333] text-white"} border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                          >
                            {workingHourOptions.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}
                              </option>
                            ))}
                          </select>
                          <span className={isLight ? "text-gray-500" : "text-gray-400"}>to</span>
                          <select
                            value={workingHoursEnd}
                            onChange={(e) => setWorkingHoursEnd(e.target.value)}
                            className={`w-full ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#1a1a1a] border-[#333333] text-white"} border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                          >
                            {workingHourOptions.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <h4 className={`text-base font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                            Double Dial
                          </h4>
                          <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Double dialing retries a call if unanswered. While it may use more credits, it boosts pickup
                            rates by 40%.
                          </p>
                        </div>
                        <button
                          onClick={() => setDoubleDial(!doubleDial)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            doubleDial
                              ? "bg-green-500 border-green-500"
                              : isLight
                                ? "border-gray-300 hover:border-gray-400"
                                : "border-gray-600 hover:border-gray-500"
                          }`}
                        >
                          {doubleDial && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <h4 className={`text-base font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                            Personalization
                          </h4>
                          <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Research your prospects to uncover key insights before reaching out.
                          </p>
                        </div>
                        <button
                          onClick={() => setPersonalizationEnabled(!personalizationEnabled)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            personalizationEnabled
                              ? "bg-green-500 border-green-500"
                              : isLight
                                ? "border-gray-300 hover:border-gray-400"
                                : "border-gray-600 hover:border-gray-500"
                          }`}
                        >
                          {personalizationEnabled && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Launch Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleLaunchCampaign}
                      disabled={isLaunching}
                      className={`px-7 py-3.5 rounded-md text-base font-medium flex items-center ${
                        isLaunching
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : isLight
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-white hover:bg-gray-200 text-black"
                      } transition-all shadow-md hover:shadow-lg`}
                    >
                      {isLaunching ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <span>Launching...</span>
                        </>
                      ) : (
                        <>
                          <span>Launch Campaign</span>
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
