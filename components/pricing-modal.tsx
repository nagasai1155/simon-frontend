"use client"

import { useState } from "react"
import { X, Check, Zap, Mail, Phone, Crown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  onSelectPlan: (planType: string, planName: string) => void
}

export default function PricingModal({ isOpen, onClose, currentPlan, onSelectPlan }: PricingModalProps) {
  const [activeTab, setActiveTab] = useState<"email" | "call">("email")
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan)

  // Email plans data
  const emailPlans = [
    {
      name: "Explore",
      price: 349,
      originalPrice: 349,
      prospects: "1,000",
      description: "Entry-level outreach",
      popular: false,
    },
    {
      name: "Starter",
      price: 349,
      originalPrice: 700,
      prospects: "2,500",
      description: "🚀 50% off first month (launch promo)",
      popular: false,
    },
    {
      name: "Basics",
      price: 1280,
      originalPrice: 1280,
      prospects: "4,700",
      description: "Great for growing teams",
      popular: true,
    },
    {
      name: "SMB",
      price: 3500,
      originalPrice: 3500,
      prospects: "15,900",
      description: "High-volume scaled outbound",
      popular: false,
    },
    {
      name: "Enterprise",
      price: null,
      originalPrice: null,
      prospects: "Custom",
      description: "Tailored solutions for large organizations",
      popular: false,
    },
  ]

  // Call plans data
  const callPlans = [
    {
      name: "Voice Lite",
      price: 400,
      minutes: "1,140",
      credits: "40,000",
      description: "Base plan, standard rate",
      popular: false,
    },
    {
      name: "Voice Plus",
      price: 800,
      minutes: "2,500",
      credits: "80,100",
      description: "+14% more credits",
      popular: false,
    },
    {
      name: "Voice Pro",
      price: 1400,
      minutes: "5,200",
      credits: "140,100",
      description: "+27% more credits, best value",
      popular: true,
    },
    {
      name: "Voice Max",
      price: 2500,
      minutes: "10,000",
      credits: "300,000",
      description: "+46% more credits, built for serious scale",
      popular: false,
    },
    {
      name: "Voice Enterprise",
      price: null,
      minutes: "Custom",
      credits: "Custom",
      description: "Tailored solutions for large organizations",
      popular: false,
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-xl shadow-lg">
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-border bg-card">
          <h2 className="text-2xl font-bold text-foreground">Choose Your Plan</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors bg-secondary hover:bg-secondary/80 rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${
              activeTab === "email"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("email")}
          >
            <Mail className="w-4 h-4" />
            Email Outreach Plans
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${
              activeTab === "call"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("call")}
          >
            <Phone className="w-4 h-4" />
            AI Call Plans
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Email Plans */}
              {activeTab === "email" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-foreground">Email Outreach Plans (Per-Project Pricing)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose the perfect plan for your email outreach campaigns
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {emailPlans.map((plan) => (
                      <div
                        key={plan.name}
                        className={`relative rounded-xl border ${
                          plan.name === "Enterprise"
                            ? "bg-black text-white border-gray-800"
                            : plan.popular
                              ? "border-primary shadow-md"
                              : selectedPlan === plan.name && activeTab === "email"
                                ? "border-primary shadow-md"
                                : "border-border"
                        } overflow-hidden transition-all hover:shadow-md flex flex-col h-full`}
                      >
                        {plan.popular && (
                          <div className="absolute top-0 right-0">
                            <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-bl-lg flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              Popular
                            </div>
                          </div>
                        )}

                        <div className="p-6 flex-grow">
                          <h3 className="text-xl font-bold">{plan.name}</h3>
                          <div className="mt-2 mb-4">
                            {plan.price !== null ? (
                              <>
                                <div className="flex items-end gap-2">
                                  <span className="text-3xl font-bold">${plan.price}</span>
                                  <span
                                    className={`text-sm ${plan.name === "Enterprise" ? "text-gray-300" : "text-muted-foreground"}`}
                                  >
                                    /month
                                  </span>
                                </div>
                                {plan.originalPrice !== plan.price && plan.originalPrice !== null && (
                                  <div className="mt-1 text-sm">
                                    <span className="line-through text-muted-foreground">${plan.originalPrice}</span>
                                    <span className="ml-2 text-green-500 font-medium">50% off</span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold">Custom</span>
                              </div>
                            )}
                          </div>

                          <div
                            className={`text-sm ${plan.name === "Enterprise" ? "text-gray-300" : "text-muted-foreground"} mb-4`}
                          >
                            <div
                              className={`font-medium ${plan.name === "Enterprise" ? "text-white" : "text-foreground"}`}
                            >
                              {plan.prospects} prospects
                            </div>
                            <div className="mt-1">{plan.description}</div>
                          </div>
                        </div>

                        <div className="p-6 pt-0 mt-4">
                          <button
                            onClick={() => {
                              setSelectedPlan(plan.name)
                              if (plan.price !== null) {
                                onSelectPlan("email", plan.name)
                                onClose()
                              }
                            }}
                            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                              plan.name === "Enterprise"
                                ? "bg-white text-black hover:bg-gray-200"
                                : plan.popular
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : selectedPlan === plan.name && activeTab === "email"
                                    ? "bg-primary text-primary-foreground"
                                    : plan.price === null
                                      ? "bg-secondary hover:bg-secondary/80 text-foreground border border-primary"
                                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                            }`}
                          >
                            {plan.price === null
                              ? "Contact Sales"
                              : selectedPlan === plan.name && activeTab === "email"
                                ? "Selected"
                                : "Select Plan"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Email Plans Comparison Table */}
                  <div className="mt-12 overflow-x-auto">
                    <h3 className="text-lg font-medium text-foreground mb-4">Feature Comparison</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-3 px-4 text-left font-medium text-muted-foreground">Features</th>
                          <th className="py-3 px-4 text-center font-medium">Explore</th>
                          <th className="py-3 px-4 text-center font-medium">Starter</th>
                          <th className="py-3 px-4 text-center font-medium">Basics</th>
                          <th className="py-3 px-4 text-center font-medium">SMB</th>
                          <th className="py-3 px-4 text-center font-medium">Enterprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border bg-secondary/30">
                          <td colSpan={6} className="py-2 px-4 font-medium">
                            Multi-Channel Outreach
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">
                            Continuous engagement across calls, emails
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Omnichannel Outreach</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto opacity-30" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">AI-Powered Email Marketing</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>

                        <tr className="border-b border-border bg-secondary/30">
                          <td colSpan={6} className="py-2 px-4 font-medium">
                            Personalized Follow-Ups
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Dynamic, AI-driven conversations</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto opacity-30" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Personalized Sequences</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto opacity-30" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Continuous Follow-Up</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>

                        <tr className="border-b border-border bg-secondary/30">
                          <td colSpan={6} className="py-2 px-4 font-medium">
                            Campaign Management
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Integrated dashboard</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Bulk Import & Management</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto opacity-30" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">AI-Driven Research</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto opacity-30" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto opacity-30" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>

                        <tr className="border-b border-border bg-secondary/30">
                          <td colSpan={6} className="py-2 px-4 font-medium">
                            Appointment Scheduling
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Calendar Integration</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Calendar & Meeting Tools</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto opacity-30" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>

                        <tr className="border-b border-border bg-secondary/30">
                          <td colSpan={6} className="py-2 px-4 font-medium">
                            Onboarding & Support
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Guided Setup</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Dedicated Account Manager</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Best Practices & Templates</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Live Chat & Help Center</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>

                        <tr className="border-b border-border bg-secondary/30">
                          <td colSpan={6} className="py-2 px-4 font-medium">
                            API & Integrations
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">CRM export booked/interested leads</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Enterprise Security & Compliance</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Zapier & Webhooks</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>

                        <tr className="border-b border-border bg-secondary/30">
                          <td colSpan={6} className="py-2 px-4 font-medium">
                            White-Label Options
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">White-Label Options</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">White-Label Reseller Program</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Call Plans */}
              {activeTab === "call" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-foreground">AI Call Plans (Per-Minute Pricing)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose the perfect plan for your AI-powered calling campaigns
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {callPlans.map((plan) => (
                      <div
                        key={plan.name}
                        className={`relative rounded-xl border ${
                          plan.name === "Voice Enterprise"
                            ? "bg-black text-white border-gray-800"
                            : plan.popular
                              ? "border-primary shadow-md"
                              : selectedPlan === plan.name && activeTab === "call"
                                ? "border-primary shadow-md"
                                : "border-border"
                        } overflow-hidden transition-all hover:shadow-md flex flex-col h-full`}
                      >
                        {plan.popular && (
                          <div className="absolute top-0 right-0">
                            <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-bl-lg flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              Popular
                            </div>
                          </div>
                        )}

                        <div className="p-6 flex-grow">
                          <h3 className="text-xl font-bold">{plan.name}</h3>
                          <div className="mt-2 mb-4">
                            {plan.price !== null ? (
                              <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold">${plan.price}</span>
                                <span
                                  className={`text-sm ${plan.name === "Voice Enterprise" ? "text-gray-300" : "text-muted-foreground"}`}
                                >
                                  /month
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold">Custom</span>
                              </div>
                            )}
                          </div>

                          <div
                            className={`text-sm ${plan.name === "Voice Enterprise" ? "text-gray-300" : "text-muted-foreground"} mb-4`}
                          >
                            <div className="flex items-center gap-2 font-medium text-foreground">
                              <span className={plan.name === "Voice Enterprise" ? "text-white" : ""}>
                                {plan.minutes} minutes
                              </span>
                              {plan.price !== null && (
                                <>
                                  <span className="text-muted-foreground">•</span>
                                  <div className="flex items-center">
                                    <Zap className="w-3.5 h-3.5 text-yellow-400 mr-1" />
                                    <span>{plan.credits} credits</span>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="mt-1">{plan.description}</div>
                          </div>
                        </div>

                        <div className="p-6 pt-0 mt-4">
                          <button
                            onClick={() => {
                              setSelectedPlan(plan.name)
                              if (plan.price !== null) {
                                onSelectPlan("call", plan.name)
                                onClose()
                              }
                            }}
                            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                              plan.name === "Voice Enterprise"
                                ? "bg-white text-black hover:bg-gray-200"
                                : plan.popular
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : selectedPlan === plan.name && activeTab === "call"
                                    ? "bg-primary text-primary-foreground"
                                    : plan.price === null
                                      ? "bg-secondary hover:bg-secondary/80 text-foreground border border-primary"
                                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                            }`}
                          >
                            {plan.price === null
                              ? "Contact Sales"
                              : selectedPlan === plan.name && activeTab === "call"
                                ? "Selected"
                                : "Select Plan"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Call Plans Comparison Table */}
                  <div className="mt-12 overflow-x-auto">
                    <h3 className="text-lg font-medium text-foreground mb-4">Feature Comparison</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-3 px-4 text-left font-medium text-muted-foreground">Features</th>
                          <th className="py-3 px-4 text-center font-medium">Voice Lite</th>
                          <th className="py-3 px-4 text-center font-medium">Voice Plus</th>
                          <th className="py-3 px-4 text-center font-medium">Voice Pro</th>
                          <th className="py-3 px-4 text-center font-medium">Voice Max</th>
                          <th className="py-3 px-4 text-center font-medium">Voice Enterprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border bg-secondary/30">
                          <td colSpan={6} className="py-2 px-4 font-medium">
                            AI-Driven Calling
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">AI-Driven Phone Calls</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Personalized Follow-Ups</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Hyper-personalized script creation</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto opacity-30" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>

                        <tr className="border-b border-border bg-secondary/30">
                          <td colSpan={6} className="py-2 px-4 font-medium">
                            Campaign Management
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Integrated dashboard</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Bulk Import & Management</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Call Recording & Transcription</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Advanced Call Analytics</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>

                        <tr className="border-b border-border bg-secondary/30">
                          <td colSpan={6} className="py-2 px-4 font-medium">
                            Appointment Scheduling
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Calendar Integration</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Automated Booking</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>

                        <tr className="border-b border-border bg-secondary/30">
                          <td colSpan={6} className="py-2 px-4 font-medium">
                            Support & Customization
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Email Support</td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Priority Support</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Dedicated Account Manager</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">Custom Voice Options</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-muted-foreground">White-Label Options</td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
