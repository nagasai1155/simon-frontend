"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowRight,
  Copy,
  CheckCircle,
  Play,
  Code,
  ExternalLink,
  HelpCircle,
  Info,
  Phone,
  Calendar,
  Check,
  Edit2,
} from "lucide-react"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import { useTheme } from "@/components/theme-provider"

export default function NewCampaign() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [copiedEndpoint, setCopiedEndpoint] = useState(false)
  const [copiedHeaders, setCopiedHeaders] = useState(false)
  const [copiedBody, setCopiedBody] = useState(false)
  const [testStatus, setTestStatus] = useState<null | "loading" | "success" | "error">(null)
  const [campaignName, setCampaignName] = useState("New Campaign")
  const [isEditingName, setIsEditingName] = useState(false)
  const { theme } = useTheme()
  const isLight = theme === "light"

  // Removed Blueprint step and renumbered
  const steps = [
    { id: 1, name: "Leads", number: 1 },
    { id: 2, name: "AI Agent", number: 2 },
    { id: 3, name: "Select Channels", number: 3 },
    { id: 4, name: "Launch", number: 4 },
  ]

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

  const copyToClipboard = (text: string, type: "headers" | "body" | "endpoint") => {
    navigator.clipboard.writeText(text)
    if (type === "headers") {
      setCopiedHeaders(true)
      setTimeout(() => setCopiedHeaders(false), 2000)
    } else if (type === "body") {
      setCopiedBody(true)
      setTimeout(() => setCopiedBody(false), 2000)
    } else {
      setCopiedEndpoint(true)
      setTimeout(() => setCopiedEndpoint(false), 2000)
    }
  }

  const testConnection = () => {
    setTestStatus("loading")
    // Simulate API call
    setTimeout(() => {
      setTestStatus("success")
      // Reset after 3 seconds
      setTimeout(() => setTestStatus(null), 3000)
    }, 1500)
  }

  const handleCampaignNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCampaignName(e.target.value)
  }

  const handleCampaignNameBlur = () => {
    setIsEditingName(false)
    // Trim empty campaign name
    if (!campaignName.trim()) {
      setCampaignName("New Campaign")
    }
  }

  const handleCampaignNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCampaignNameBlur()
    }
  }

  const headersText = `authorization: Bearer YOUR_API_TOKEN_HERE
content-type: application/json`

  const bodyText = `{
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+1234567890",
  "company": "Acme Inc",
  "job_title": "Marketing Manager",
  "industry": "E-commerce",
  "website": "https://acme.com",
  "linkedin": "https://linkedin.com/in/johndoe",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "location": "10001",
  "interested_in": "AI-powered outbound automation",
  "notes": "Requested a demo for next Tuesday."
}`

  return (
    <div
      className={`flex h-screen ${isLight ? "bg-gray-50" : "bg-[#050505]"} ${isLight ? "text-gray-900" : "text-white"}`}
    >
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
                className={`${isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-400 hover:text-white"} mr-4 transition-colors`}
              >
                <span className="text-sm">Campaigns</span>
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
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                          : "bg-gradient-to-r from-white to-gray-200 text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        : completedSteps.includes(step.id)
                          ? isLight
                            ? "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                            : "bg-gradient-to-r from-[#1a1a1a] to-[#222222] text-white"
                          : isLight
                            ? "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                            : "bg-[#0c0c0c] text-gray-400 border border-[#1a1a1a] hover:bg-[#101010] hover:border-[#222222]"
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-2.5 ${
                          step.id === currentStep
                            ? isLight
                              ? "bg-white text-blue-600"
                              : "bg-purple-600 text-white"
                            : completedSteps.includes(step.id)
                              ? "bg-green-500 text-white"
                              : isLight
                                ? "bg-gray-100 text-gray-500"
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
              {currentStep === 1 && (
                <div className="max-w-4xl mx-auto">
                  <h2
                    className={`text-2xl font-bold mb-2 ${isLight ? "text-gray-900" : "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"}`}
                  >
                    Connect your lead source through API
                  </h2>
                  <p className={isLight ? "text-gray-600 mb-8" : "text-gray-400 mb-8"}>
                    Connect your lead sources to automatically trigger actions when new leads come in.
                  </p>

                  {/* Developer Assistance Card */}
                  <div
                    className={`${isLight ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200" : "bg-gradient-to-r from-[#0c1b36] to-[#0f1730] border border-[#1e2b4a]"} rounded-lg p-6 mb-8 shadow-md transform hover:translate-y-[-2px] transition-all duration-300`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 ${isLight ? "bg-gradient-to-br from-blue-400 to-blue-500" : "bg-gradient-to-br from-blue-500 to-blue-700"} p-3.5 rounded-full mr-5 shadow-md`}
                      >
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-medium mb-2 ${isLight ? "text-blue-800" : "text-blue-100"}`}>
                          Don't want to figure this out yourself?
                        </h3>
                        <p className={isLight ? "text-gray-700 mb-4" : "text-gray-300 mb-4"}>
                          Our developers can set up the API integration for you.
                        </p>
                        <button
                          className={`flex items-center gap-2 ${isLight ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"} text-white py-2.5 px-5 rounded-md transition-all shadow-md hover:shadow-lg`}
                        >
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Schedule a Developer Call</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Main Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button
                      onClick={testConnection}
                      className={`flex items-center justify-center gap-2 ${isLight ? "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800" : "bg-gradient-to-r from-[#1a1a1a] to-[#222222] hover:from-[#222222] hover:to-[#2a2a2a] text-white"} py-3 px-5 rounded-md transition-all shadow-md hover:shadow-lg`}
                    >
                      <Code className="w-4 h-4" />
                      <span className="font-medium">Test Connection</span>
                    </button>

                    <button
                      className={`flex items-center justify-center gap-2 ${isLight ? "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800" : "bg-gradient-to-r from-[#1a1a1a] to-[#222222] hover:from-[#222222] hover:to-[#2a2a2a] text-white"} py-3 px-5 rounded-md transition-all shadow-md hover:shadow-lg`}
                    >
                      <Play className="w-4 h-4" />
                      <span className="font-medium">Watch API Tutorial</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>

                  {/* Step-by-Step Guide */}
                  <div className="space-y-8">
                    {/* Step 1: API Endpoint */}
                    <div
                      className={`${isLight ? "bg-white border border-gray-200" : "bg-gradient-to-br from-[#0c0c0c] to-[#111111] border border-[#1a1a1a]"} rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-center mb-5">
                        <div
                          className={`w-9 h-9 rounded-full ${isLight ? "bg-gradient-to-br from-blue-400 to-blue-500" : "bg-gradient-to-br from-blue-500 to-blue-700"} flex items-center justify-center mr-4 flex-shrink-0 shadow-md`}
                        >
                          <span className="text-sm font-bold text-white">1</span>
                        </div>
                        <h3
                          className={`text-xl font-medium ${isLight ? "text-gray-900" : "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"}`}
                        >
                          Use this API endpoint
                        </h3>
                      </div>
                      <div
                        className={`${isLight ? "bg-gray-50 border border-gray-200" : "bg-[#0a0a0a] border border-[#1a1a1a]"} p-4 rounded-md font-mono text-sm ${isLight ? "text-gray-800" : "text-gray-300"} flex items-center justify-between shadow-inner`}
                      >
                        <code className={isLight ? "text-blue-600" : "text-blue-400"}>
                          https://api.connectedsensors.com/v1/leads
                        </code>
                        <button
                          className={`p-2 ${isLight ? "hover:bg-gray-200" : "hover:bg-[#1a1a1a]"} rounded-md transition-colors`}
                          onClick={() => copyToClipboard("https://api.connectedsensors.com/v1/leads", "endpoint")}
                        >
                          {copiedEndpoint ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy
                              className={`w-4 h-4 ${isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-white"} transition-colors`}
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Step 2: Headers */}
                    <div
                      className={`${isLight ? "bg-white border border-gray-200" : "bg-gradient-to-br from-[#0c0c0c] to-[#111111] border border-[#1a1a1a]"} rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-center mb-5">
                        <div
                          className={`w-9 h-9 rounded-full ${isLight ? "bg-gradient-to-br from-blue-400 to-blue-500" : "bg-gradient-to-br from-blue-500 to-blue-700"} flex items-center justify-center mr-4 flex-shrink-0 shadow-md`}
                        >
                          <span className="text-sm font-bold text-white">2</span>
                        </div>
                        <h3
                          className={`text-xl font-medium ${isLight ? "text-gray-900" : "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"}`}
                        >
                          Add these headers
                        </h3>
                        <button
                          className={`ml-2 ${isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-gray-300"} transition-colors`}
                        >
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="relative">
                        <pre
                          className={`font-mono text-sm ${isLight ? "text-gray-800 bg-gray-50 border border-gray-200" : "text-gray-300 bg-[#0a0a0a] border border-[#1a1a1a]"} p-5 rounded-md whitespace-pre-wrap shadow-inner`}
                        >
                          <span className={isLight ? "text-purple-600" : "text-purple-400"}>authorization</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>
                            Bearer YOUR_API_TOKEN_HERE
                          </span>
                          <br />
                          <span className={isLight ? "text-purple-600" : "text-purple-400"}>content-type</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>application/json</span>
                        </pre>
                        <button
                          className={`absolute top-3 right-3 p-2 ${isLight ? "hover:bg-gray-200" : "hover:bg-[#1a1a1a]"} rounded-md transition-colors`}
                          onClick={() => copyToClipboard(headersText, "headers")}
                        >
                          {copiedHeaders ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy
                              className={`w-4 h-4 ${isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-white"} transition-colors`}
                            />
                          )}
                        </button>
                      </div>
                      <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"} mt-3 flex items-center`}>
                        <Info className={`w-3 h-3 mr-1.5 ${isLight ? "text-blue-600" : "text-blue-400"}`} />
                        You can find your API token in the{" "}
                        <Link
                          href="/settings/api"
                          className={`${isLight ? "text-blue-600 hover:text-blue-800" : "text-[#016AFF] hover:text-[#0055DD]"} hover:underline ml-1 transition-colors`}
                        >
                          API settings
                        </Link>
                        .
                      </p>
                    </div>

                    {/* Step 3: Body */}
                    <div
                      className={`${isLight ? "bg-white border border-gray-200" : "bg-gradient-to-br from-[#0c0c0c] to-[#111111] border border-[#1a1a1a]"} rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-center mb-5">
                        <div
                          className={`w-9 h-9 rounded-full ${isLight ? "bg-gradient-to-br from-blue-400 to-blue-500" : "bg-gradient-to-br from-blue-500 to-blue-700"} flex items-center justify-center mr-4 flex-shrink-0 shadow-md`}
                        >
                          <span className="text-sm font-bold text-white">3</span>
                        </div>
                        <h3
                          className={`text-xl font-medium ${isLight ? "text-gray-900" : "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"}`}
                        >
                          Send data in this format
                        </h3>
                      </div>
                      <div className="relative">
                        <pre
                          className={`font-mono text-sm ${isLight ? "text-gray-800 bg-gray-50 border border-gray-200" : "text-gray-300 bg-[#0a0a0a] border border-[#1a1a1a]"} p-5 rounded-md max-h-[300px] overflow-y-auto whitespace-pre-wrap shadow-inner`}
                        >
                          <span className={isLight ? "text-yellow-600" : "text-yellow-300"}>{"{"}</span>
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"name"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>"John Doe"</span>,
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"email"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>"john@example.com"</span>,
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"phone_number"</span>
                          : <span className={isLight ? "text-green-600" : "text-green-400"}>"+1234567890"</span>,
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"company"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>"Acme Inc"</span>,
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"job_title"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>"Marketing Manager"</span>,
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"industry"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>"E-commerce"</span>,
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"website"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>"https://acme.com"</span>,
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"linkedin"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>
                            "https://linkedin.com/in/johndoe"
                          </span>
                          ,
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"city"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>"New York"</span>,
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"state"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>"NY"</span>,
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"country"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>"USA"</span>,
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"location"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>"10001"</span>,
                          <br />{" "}
                          <span className={isLight ? "text-purple-600" : "text-purple-400"}>"interested_in"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>
                            "AI-powered outbound automation"
                          </span>
                          ,
                          <br /> <span className={isLight ? "text-purple-600" : "text-purple-400"}>"notes"</span>:{" "}
                          <span className={isLight ? "text-green-600" : "text-green-400"}>
                            "Requested a demo for next Tuesday."
                          </span>
                          <br />
                          <span className={isLight ? "text-yellow-600" : "text-yellow-300"}>{"}"}</span>
                        </pre>
                        <button
                          className={`absolute top-3 right-3 p-2 ${isLight ? "hover:bg-gray-200" : "hover:bg-[#1a1a1a]"} rounded-md transition-colors`}
                          onClick={() => copyToClipboard(bodyText, "body")}
                        >
                          {copiedBody ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy
                              className={`w-4 h-4 ${isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-white"} transition-colors`}
                            />
                          )}
                        </button>
                      </div>
                      <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"} mt-3 flex items-center`}>
                        <Info className={`w-3 h-3 mr-1.5 ${isLight ? "text-blue-600" : "text-blue-400"}`} />
                        Only{" "}
                        <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"} ml-1 mr-1`}>
                          name
                        </span>{" "}
                        and{" "}
                        <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"} ml-1 mr-1`}>
                          email
                        </span>{" "}
                        fields are required.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleNext}
          className={`px-7 py-3.5 rounded-full text-base font-medium flex items-center ${
            isLight ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-[#635AFE] hover:bg-[#5048E5] text-white"
          } transition-all shadow-md hover:shadow-lg transform hover:translate-y-[-2px]`}
        >
          <span>Next</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
