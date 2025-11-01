"use client"

import { useState, useEffect } from "react"
import { X, Mail, AlertCircle, Users, Send } from "lucide-react"

interface SubAccount {
  id: string
  name: string
}

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  subAccounts: SubAccount[]
}

export default function InviteMemberModal({ isOpen, onClose, subAccounts = [] }: InviteMemberModalProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "user">("user")
  const [selectedSubAccount, setSelectedSubAccount] = useState<string | null>(null)
  const [showSubAccountDropdown, setShowSubAccountDropdown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [showPermissionsInfo, setShowPermissionsInfo] = useState<"admin" | "user" | null>(null)

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setEmail("")
        setRole("user")
        setSelectedSubAccount(null)
        setEmailError(null)
        setShowPermissionsInfo(null)
      }, 200)
    }
  }, [isOpen])

  // Validate email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = () => {
    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    // Validate sub-account selection for user role
    if (role === "user" && !selectedSubAccount) {
      return // Can't submit without selecting a sub-account
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Inviting member:", {
        email,
        role,
        subAccountId: role === "user" ? selectedSubAccount : null,
      })
      setIsSubmitting(false)
      onClose()
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-card border border-border rounded-xl w-full max-w-[450px] shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border bg-card">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-blue-400" />
            </div>
            Invite Team Member
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors bg-secondary hover:bg-secondary/80 rounded-full p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-5 space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError(null)
                }}
                placeholder="colleague@company.com"
                className={`w-full bg-background border ${emailError ? "border-red-500/50" : "border-input"} rounded-lg py-2.5 pl-10 pr-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-transparent transition-all`}
              />
            </div>
            {emailError && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {emailError}
              </p>
            )}
          </div>

          {/* Role Selection */}
          {/* Footer */}
          <div className="flex justify-between items-center p-4 border-t border-border bg-card">
            <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={!email || (role === "user" && !selectedSubAccount) || isSubmitting || !validateEmail(email)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                email && validateEmail(email) && (role === "admin" || selectedSubAccount) && !isSubmitting
                  ? "bg-[#016AFF] text-primary-foreground hover:bg-[#0055DD] shadow-lg"
                  : "bg-secondary/50 text-muted-foreground cursor-not-allowed"
              }`}
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
                  Sending Invitation...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
