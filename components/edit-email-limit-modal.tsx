"use client"

import type React from "react"

import { useState } from "react"
import { X, HelpCircle, Mail } from "lucide-react"

interface EmailAccount {
  id: string
  email: string
  name: string
  provider: "gmail" | "outlook" | "custom"
  quality: "average" | "good" | "great"
  dailyLimit: number
  dailyUsed: number
}

interface EditEmailLimitModalProps {
  isOpen: boolean
  onClose: () => void
  account: EmailAccount
  onUpdate: (id: string, newLimit: number) => void
}

export default function EditEmailLimitModal({ isOpen, onClose, account, onUpdate }: EditEmailLimitModalProps) {
  const [dailyLimit, setDailyLimit] = useState(account.dailyLimit)
  const [showTooltip, setShowTooltip] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(account.id, dailyLimit)
  }

  // Update the getProviderIcon function to have better styling for light mode
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "gmail":
        return (
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.929 0 3.679.768 4.967 2.012l4.195-4.195A11.981 11.981 0 0 0 12 0C7.371 0 3.373 2.531 1.272 6.316l3.994 3.45Z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235a7.077 7.077 0 0 1 0-4.47l-3.994-3.45A11.981 11.981 0 0 0 0 12c0 1.845.417 3.59 1.272 5.147l3.994-3.45Z"
              />
              <path
                fill="#34A853"
                d="M12 19.091c-2.593 0-4.891-1.157-6.466-2.979l-3.994 3.45C3.873 22.392 7.71 24 12 24c4.629 0 8.627-2.531 10.728-6.316l-3.994-3.45c-1.288 1.244-3.038 2.012-4.967 2.012l-1.767 2.845Z"
              />
              <path
                fill="#4285F4"
                d="M23.896 12.196c0-.823-.076-1.626-.22-2.396H12v4.8h6.668c-.271 1.394-1.15 2.576-2.395 3.372l3.994 3.45c2.3-2.143 3.629-5.294 3.629-9.226Z"
              />
            </svg>
          </div>
        )
      case "outlook":
        return (
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M7 5H21V19H7V5Z" fill="#28A8EA" />
              <path d="M16.5 12L21 16.5V7.5L16.5 12Z" fill="#0078D4" />
              <path d="M7 5H14L7 12V5Z" fill="#0078D4" />
              <path d="M14 5H21V12L14 5Z" fill="#50D9FF" />
              <path d="M7 12H14L7 19V12Z" fill="#0364B8" />
              <path d="M14 19H7L14 12V19Z" fill="#0078D4" />
              <path d="M14 12H21L14 19V12Z" fill="#064A8C" />
              <path d="M21 12H14L21 5V12Z" fill="#0078D4" />
              <path d="M3 5.5H11V18.5H3C2.448 18.5 2 18.052 2 17.5V6.5C2 5.948 2.448 5.5 3 5.5Z" fill="#0078D4" />
              <path d="M7 9.5L4 8L7 6.5V9.5Z" fill="white" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm dark:bg-gray-700 dark:border-gray-700">
            <Mail className="w-5 h-5 text-gray-400 dark:text-gray-400" />
          </div>
        )
    }
  }

  // Update the getQualityBadge function to have lighter colors in light mode
  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case "great":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-600 border border-green-100 dark:bg-green-900 dark:text-green-300 dark:border-green-800">
            Great
          </span>
        )
      case "good":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800">
            Good
          </span>
        )
      case "average":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800">
            Average
          </span>
        )
      default:
        return null
    }
  }

  const getRecommendedLimit = (quality: string) => {
    switch (quality) {
      case "great":
        return "70-100"
      case "good":
        return "40-80"
      case "average":
        return "20-50"
      default:
        return "30-50"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl shadow-lg w-full max-w-sm mx-4 relative border border-border">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-base font-medium text-foreground">Edit Email Sending Limits</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Account Info */}
          <div className="flex items-center mb-4">
            {getProviderIcon(account.provider)}
            <div className="ml-3">
              <div className="flex items-center">
                <h3 className="font-medium text-foreground text-sm">{account.email}</h3>
                <div className="ml-2">{getQualityBadge(account.quality)}</div>
              </div>
              <p className="text-xs text-muted-foreground">{account.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Daily Limit */}
            <div className="mb-4">
              <div className="flex items-center mb-1.5">
                <label htmlFor="dailyLimit" className="block text-xs font-medium text-foreground">
                  Daily sending limit
                </label>
                <div className="relative ml-1.5">
                  <HelpCircle
                    className="w-3.5 h-3.5 text-muted-foreground cursor-help"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  />
                  {showTooltip && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg border border-border z-10">
                      <p className="mb-1">
                        <strong>Recommended limits based on email quality:</strong>
                      </p>
                      <p className="mb-1">
                        • <span className="text-green-600 dark:text-green-400">Great:</span> 70-100 emails/day
                      </p>
                      <p className="mb-1">
                        • <span className="text-blue-600 dark:text-blue-400">Good:</span> 40-80 emails/day
                      </p>
                      <p>
                        • <span className="text-yellow-600 dark:text-yellow-400">Average:</span> 20-50 emails/day
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  id="dailyLimit"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="w-full px-3 py-1.5 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Recommended for {account.quality} quality: {getRecommendedLimit(account.quality)} emails per day
              </p>
            </div>

            {/* Current Usage */}
            <div className="mb-4 p-3 bg-secondary rounded-lg">
              <p className="text-xs mb-1 text-foreground">Current usage today</p>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Emails sent</span>
                <span className="text-foreground font-medium">
                  {account.dailyUsed}/{account.dailyLimit}
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    account.dailyUsed / account.dailyLimit > 0.8
                      ? "bg-red-500"
                      : account.dailyUsed / account.dailyLimit > 0.5
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${(account.dailyUsed / account.dailyLimit) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-xs text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-primary hover:bg-primary/90 rounded-lg text-xs text-primary-foreground transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
