"use client"

import { useState } from "react"
import { Mail, Check } from "lucide-react"
import ConfigModal from "./config-modal"

interface EmailAccount {
  id: string
  email: string
  name: string
  provider: "gmail" | "outlook" | "custom"
  isConnected: boolean
}

interface EmailAccountsModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (accounts: EmailAccount[]) => void
  selectedAccounts?: EmailAccount[]
}

export default function EmailAccountsModal({
  isOpen,
  onClose,
  onSelect,
  selectedAccounts = [],
}: EmailAccountsModalProps) {
  const [selected, setSelected] = useState<EmailAccount[]>(selectedAccounts)

  // Sample email accounts data
  const emailAccounts: EmailAccount[] = [
    { id: "1", email: "john@blackvolution.com", name: "John Doe", provider: "gmail", isConnected: true },
    { id: "2", email: "sales@blackvolution.com", name: "Sales Team", provider: "outlook", isConnected: true },
    { id: "3", email: "support@blackvolution.com", name: "Support", provider: "custom", isConnected: true },
    { id: "4", email: "marketing@blackvolution.com", name: "Marketing", provider: "gmail", isConnected: true },
  ]

  const toggleAccount = (account: EmailAccount) => {
    if (selected.some((a) => a.id === account.id)) {
      setSelected(selected.filter((a) => a.id !== account.id))
    } else {
      setSelected([...selected, account])
    }
  }

  const handleSave = () => {
    onSelect(selected)
    onClose()
  }

  // Update the getProviderIcon function to have better styling for light mode
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "gmail":
        return (
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <svg viewBox="0 0 24 24" width="16" height="16">
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
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <svg viewBox="0 0 24 24" width="16" height="16">
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
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm dark:bg-gray-700 dark:border-gray-700">
            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-400" />
          </div>
        )
    }
  }

  return (
    <ConfigModal isOpen={isOpen} onClose={onClose} title="Choose Outreach Emails">
      <div className="space-y-4">
        {/* Email accounts list */}
        <div className="max-h-[350px] overflow-y-auto pr-1">
          <div className="space-y-2">
            {emailAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => account.isConnected && toggleAccount(account)}
                className={`flex items-center p-3 rounded-lg border ${
                  !account.isConnected
                    ? "border-border bg-background opacity-60 cursor-not-allowed"
                    : selected.some((a) => a.id === account.id)
                      ? "border-blue-500 bg-blue-500/10 cursor-pointer"
                      : "border-border bg-background hover:bg-secondary/50 cursor-pointer"
                } transition-colors`}
              >
                <div className="flex-1 flex items-center min-w-0">
                  {getProviderIcon(account.provider)}
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-foreground truncate">{account.email}</p>
                    <p className="text-xs text-muted-foreground truncate">{account.name}</p>
                  </div>
                </div>

                {selected.some((a) => a.id === account.id) && (
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#635AFE] hover:bg-[#5048E5] rounded-lg text-sm text-white transition-colors"
          >
            Select {selected.length > 0 ? `(${selected.length})` : ""}
          </button>
        </div>
      </div>
    </ConfigModal>
  )
}
