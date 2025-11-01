"use client"

import { useState } from "react"
import { X, ChevronRight, CheckCircle, Sparkles, ArrowLeft, Zap, Info, Mail, Phone } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"

interface AIKnowledgeBaseModalProps {
  isOpen: boolean
  onClose: () => void
}

type FormStep = "initial" | "generating" | "review"
type FormField = {
  id: string
  label: string
  placeholder: string
  value: string
  required: boolean
  multiline?: boolean
  rows?: number
  info?: string
}

export default function AIKnowledgeBaseModal({ isOpen, onClose }: AIKnowledgeBaseModalProps) {
  const { theme } = useTheme()
  const { toast } = useToast()
  const [step, setStep] = useState<FormStep>("initial")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeField, setActiveField] = useState<string | null>("companyName")
  // Add state for tracking the selected usage type
  const [usageType, setUsageType] = useState<"calls" | "emails">("emails")

  const [formFields, setFormFields] = useState<FormField[]>([
    {
      id: "companyName",
      label: "What is your company name?",
      placeholder: "e.g., Acme Corporation",
      value: "",
      required: true,
      info: "We'll use this to personalize your knowledge base content.",
    },
    {
      id: "website",
      label: "Your Website",
      placeholder: "e.g., https://example.com",
      value: "",
      required: false,
      info: "We'll analyze your website to extract relevant information.",
    },
    {
      id: "coreOffer",
      label: "Core Offer",
      placeholder: "Describe your main product or service...",
      value: "",
      required: true,
      multiline: true,
      rows: 4,
      info: "This helps us understand what your business offers to customers.",
    },
    {
      id: "targetMarket",
      label: "Target Market | ICP",
      placeholder: "Describe your ideal customer profile...",
      value: "",
      required: true,
      multiline: true,
      rows: 4,
      info: "Defining your target audience helps create more relevant content.",
    },
    {
      id: "caseStudy",
      label: "Case Study | Success Stories",
      placeholder: "Share some success stories or case studies...",
      value: "",
      required: false,
      multiline: true,
      rows: 4,
      info: "Real examples help demonstrate your value proposition.",
    },
    {
      id: "competitorResearch",
      label: "Competitor Research",
      placeholder: "List your main competitors and what sets you apart...",
      value: "",
      required: false,
      multiline: true,
      rows: 4,
      info: "Understanding your competitive landscape helps position your offering.",
    },
    {
      id: "faqs",
      label: "FAQs",
      placeholder: "List common questions and answers about your product/service...",
      value: "",
      required: false,
      multiline: true,
      rows: 4,
      info: "Frequently asked questions help address common customer concerns.",
    },
  ])

  if (!isOpen) return null

  const handleInputChange = (id: string, value: string) => {
    setFormFields(formFields.map((field) => (field.id === id ? { ...field, value } : field)))
  }

  const handleInputFocus = (id: string) => {
    setActiveField(id)
  }

  const handleInputBlur = () => {
    setActiveField(null)
  }

  const validateForm = () => {
    const requiredFields = formFields.filter((field) => field.required)
    const emptyRequiredFields = requiredFields.filter((field) => !field.value.trim())
    return emptyRequiredFields.length === 0
  }

  const handleBuildKnowledgeBase = () => {
    if (!validateForm()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setStep("generating")
    setIsGenerating(true)

    // Simulate AI generation process
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 5
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)
        setIsGenerating(false)
        setStep("review")
      }
    }, 200)
  }

  const handleCreate = () => {
    toast({
      title: "Knowledge Base Created",
      description: "Your AI-generated knowledge base has been created successfully",
      variant: "success",
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl ${
          theme === "dark" ? "bg-card" : "bg-white"
        } rounded-xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-5 border-b border-border sticky top-0 z-10 ${
            theme === "dark" ? "bg-card" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-2">
            {step !== "initial" && (
              <button
                onClick={() => (step === "generating" ? setStep("initial") : setStep("generating"))}
                className={`p-1.5 rounded-full ${
                  theme === "dark" ? "hover:bg-muted/50" : "hover:bg-gray-100"
                } transition-colors`}
                disabled={isGenerating}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-semibold">Build The Perfect Knowledge Base</h2>
              {step === "initial" && (
                <p className="text-sm text-muted-foreground">Fill in the details to create your knowledge base</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${
              theme === "dark" ? "hover:bg-muted/50" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {step === "initial" && (
            <div className="p-6 space-y-8">
              {formFields.map((field) => (
                <div
                  key={field.id}
                  className={`space-y-2 transition-all ${
                    activeField === field.id
                      ? theme === "dark"
                        ? "bg-primary/5 -mx-4 p-4 rounded-xl"
                        : "bg-blue-50/50 -mx-4 p-4 rounded-xl"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <label htmlFor={field.id} className="block text-lg font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.info && activeField === field.id && (
                      <div
                        className={`flex items-start gap-2 text-sm p-2 rounded-lg max-w-xs ${
                          theme === "dark" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p>{field.info}</p>
                      </div>
                    )}
                  </div>

                  {field.multiline ? (
                    <textarea
                      id={field.id}
                      value={field.value}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      onFocus={() => handleInputFocus(field.id)}
                      onBlur={handleInputBlur}
                      placeholder={field.placeholder}
                      rows={field.rows || 4}
                      className={`w-full p-3 rounded-lg transition-all ${
                        theme === "dark"
                          ? "bg-background border border-border focus:border-primary"
                          : "bg-white border border-gray-200 focus:border-blue-400"
                      } focus:outline-none focus:ring-2 ${
                        theme === "dark" ? "focus:ring-primary/20" : "focus:ring-blue-100"
                      }`}
                    />
                  ) : (
                    <input
                      type="text"
                      id={field.id}
                      value={field.value}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      onFocus={() => handleInputFocus(field.id)}
                      onBlur={handleInputBlur}
                      placeholder={field.placeholder}
                      className={`w-full p-3 rounded-lg transition-all ${
                        theme === "dark"
                          ? "bg-background border border-border focus:border-primary"
                          : "bg-white border border-gray-200 focus:border-blue-400"
                      } focus:outline-none focus:ring-2 ${
                        theme === "dark" ? "focus:ring-primary/20" : "focus:ring-blue-100"
                      }`}
                    />
                  )}
                </div>
              ))}
              {/* Usage Type Selection */}
              <div className="space-y-3 mt-8 pt-6 border-t border-border">
                <label className="block text-lg font-medium">
                  I want to use this knowledge base for: <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setUsageType("emails")}
                    className={`flex flex-col items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                      usageType === "emails"
                        ? theme === "dark"
                          ? "border-primary bg-primary/10"
                          : "border-blue-500 bg-blue-50"
                        : theme === "dark"
                          ? "border-border hover:border-primary/50"
                          : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div
                        className={`p-3 rounded-full ${
                          usageType === "emails"
                            ? theme === "dark"
                              ? "bg-primary/20"
                              : "bg-blue-100"
                            : theme === "dark"
                              ? "bg-muted"
                              : "bg-gray-100"
                        }`}
                      >
                        <Mail
                          className={`w-6 h-6 ${
                            usageType === "emails"
                              ? theme === "dark"
                                ? "text-primary"
                                : "text-blue-600"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Email Campaigns</p>
                        <p className="text-xs text-muted-foreground">For email outreach</p>
                      </div>
                    </div>
                    <div className="mt-3 w-full">
                      <span
                        className={`block text-center text-xs font-medium px-2 py-1 rounded ${
                          theme === "dark" ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                        }`}
                      >
                        Free
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setUsageType("calls")}
                    className={`flex flex-col items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                      usageType === "calls"
                        ? theme === "dark"
                          ? "border-primary bg-primary/10"
                          : "border-blue-500 bg-blue-50"
                        : theme === "dark"
                          ? "border-border hover:border-primary/50"
                          : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div
                        className={`p-3 rounded-full ${
                          usageType === "calls"
                            ? theme === "dark"
                              ? "bg-primary/20"
                              : "bg-blue-100"
                            : theme === "dark"
                              ? "bg-muted"
                              : "bg-gray-100"
                        }`}
                      >
                        <Phone
                          className={`w-6 h-6 ${
                            usageType === "calls"
                              ? theme === "dark"
                                ? "text-primary"
                                : "text-blue-600"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Call Campaigns</p>
                        <p className="text-xs text-muted-foreground">For voice conversations</p>
                      </div>
                    </div>
                    <div className="mt-3 w-full">
                      <span
                        className={`block text-center text-xs font-medium px-2 py-1 rounded ${
                          theme === "dark" ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        10 Credits
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "generating" && (
            <div className="flex flex-col items-center justify-center py-16 space-y-8">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
                  <circle
                    className={theme === "dark" ? "text-gray-700" : "text-gray-200"}
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={theme === "dark" ? "text-primary" : "text-blue-600"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (progress / 100) * 264}
                  />
                </svg>
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    theme === "dark" ? "text-primary" : "text-blue-600"
                  }`}
                >
                  <Sparkles className="w-12 h-12 animate-pulse" />
                </div>
              </div>

              <div className="text-center max-w-md">
                <h3 className="text-2xl font-semibold mb-3">Building Your Knowledge Base</h3>
                <p className="text-muted-foreground mb-8">
                  Our AI is analyzing your information and creating a comprehensive knowledge base tailored to your
                  business.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-3">
                    <div
                      className={`h-2.5 w-72 rounded-full overflow-hidden ${
                        theme === "dark" ? "bg-muted" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          theme === "dark" ? "bg-primary" : "bg-blue-600"
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-10">{progress}%</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        progress >= 20 ? (theme === "dark" ? "text-primary" : "text-blue-600") : "text-muted-foreground"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Analyzing company information</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        progress >= 40 ? (theme === "dark" ? "text-primary" : "text-blue-600") : "text-muted-foreground"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Generating core content</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        progress >= 60 ? (theme === "dark" ? "text-primary" : "text-blue-600") : "text-muted-foreground"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Creating FAQs and support content</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        progress >= 80 ? (theme === "dark" ? "text-primary" : "text-blue-600") : "text-muted-foreground"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Optimizing for AI retrieval</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        progress >= 100
                          ? theme === "dark"
                            ? "text-primary"
                            : "text-blue-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Finalizing knowledge base</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="p-6 space-y-8">
              <div
                className={`p-4 rounded-xl flex items-start gap-3 ${
                  theme === "dark" ? "bg-green-900/20 border border-green-800" : "bg-green-50 border border-green-200"
                }`}
              >
                <CheckCircle
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${theme === "dark" ? "text-green-400" : "text-green-500"}`}
                />
                <div>
                  <h3 className={`font-medium ${theme === "dark" ? "text-green-400" : "text-green-800"}`}>
                    Knowledge Base Generated
                  </h3>
                  <p className={`text-sm ${theme === "dark" ? "text-green-300" : "text-green-700"}`}>
                    Your knowledge base has been successfully generated. Please review the content below.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Verify & Complete</h3>
                <p className="text-muted-foreground mb-4">Double-Check Every AI Generated Information</p>

                <div className="space-y-6 mt-6">
                  {formFields.slice(2).map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label htmlFor={`review-${field.id}`} className="block font-medium">
                        {field.label}
                      </label>
                      <div
                        className={`p-4 rounded-lg border ${
                          theme === "dark" ? "border-border bg-background/50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <p className="whitespace-pre-line">
                          {field.value || `AI-generated ${field.label.toLowerCase()} content will appear here.`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Type Selection - Review Step */}
              <div className="space-y-4 mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold">Knowledge Base Usage</h3>
                <p className="text-muted-foreground mb-4">Select how you want to use this knowledge base</p>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setUsageType("emails")}
                    className={`flex flex-col items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                      usageType === "emails"
                        ? theme === "dark"
                          ? "border-primary bg-primary/10"
                          : "border-blue-500 bg-blue-50"
                        : theme === "dark"
                          ? "border-border hover:border-primary/50"
                          : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div
                        className={`p-3 rounded-full ${
                          usageType === "emails"
                            ? theme === "dark"
                              ? "bg-primary/20"
                              : "bg-blue-100"
                            : theme === "dark"
                              ? "bg-muted"
                              : "bg-gray-100"
                        }`}
                      >
                        <Mail
                          className={`w-6 h-6 ${
                            usageType === "emails"
                              ? theme === "dark"
                                ? "text-primary"
                                : "text-blue-600"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Email Campaigns</p>
                        <p className="text-xs text-muted-foreground">For email outreach</p>
                      </div>
                    </div>
                    <div className="mt-3 w-full">
                      <span
                        className={`block text-center text-xs font-medium px-2 py-1 rounded ${
                          theme === "dark" ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                        }`}
                      >
                        Free
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setUsageType("calls")}
                    className={`flex flex-col items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                      usageType === "calls"
                        ? theme === "dark"
                          ? "border-primary bg-primary/10"
                          : "border-blue-500 bg-blue-50"
                        : theme === "dark"
                          ? "border-border hover:border-primary/50"
                          : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div
                        className={`p-3 rounded-full ${
                          usageType === "calls"
                            ? theme === "dark"
                              ? "bg-primary/20"
                              : "bg-blue-100"
                            : theme === "dark"
                              ? "bg-muted"
                              : "bg-gray-100"
                        }`}
                      >
                        <Phone
                          className={`w-6 h-6 ${
                            usageType === "calls"
                              ? theme === "dark"
                                ? "text-primary"
                                : "text-blue-600"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Call Campaigns</p>
                        <p className="text-xs text-muted-foreground">For voice conversations</p>
                      </div>
                    </div>
                    <div className="mt-3 w-full">
                      <span
                        className={`block text-center text-xs font-medium px-2 py-1 rounded ${
                          theme === "dark" ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        10 Credits
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-5 border-t border-border sticky bottom-0 ${theme === "dark" ? "bg-card" : "bg-white"}`}>
          {step === "initial" && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4" />
                <span>AI will help you create a comprehensive knowledge base</span>
              </div>
              <button
                onClick={handleBuildKnowledgeBase}
                className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  theme === "dark"
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <span>Let's Build it</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === "review" && (
            <div className="flex justify-between">
              <button
                onClick={() => setStep("initial")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  theme === "dark"
                    ? "bg-secondary hover:bg-secondary/80 text-foreground"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Edit Information
              </button>

              <button
                onClick={handleCreate}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  theme === "dark"
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Create Knowledge Base
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
