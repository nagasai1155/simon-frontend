"use client"

import type React from "react"

import { useState } from "react"
import { Check } from "lucide-react"
import ConfigModal from "./config-modal"

interface CalendarProvider {
  id: string
  name: string
  description?: string
  logo: React.ReactNode
  isConnected: boolean
}

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (provider: CalendarProvider) => void
  selectedProvider?: string
}

export default function CalendarModal({ isOpen, onClose, onSelect, selectedProvider }: CalendarModalProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedProvider)

  // Sample calendar providers (removed Outlook)
  const calendarProviders: CalendarProvider[] = [
    {
      id: "cal",
      name: "Cal.com",
      description: "Open source scheduling infrastructure",
      logo: (
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">Cal</span>
        </div>
      ),
      isConnected: true,
    },
    {
      id: "google",
      name: "Google Calendar + Calendly",
      description: "Combine Google Calendar with Calendly",
      logo: (
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="#4285F4"
                d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"
              />
            </svg>
          </div>
          <span className="mx-1 text-xl text-foreground">+</span>
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285F4" d="M5 5h14v2H5z" />
              <path fill="#EA4335" d="M5 9h14v2H5z" />
              <path fill="#FBBC04" d="M5 13h14v2H5z" />
              <path fill="#34A853" d="M5 17h14v2H5z" />
            </svg>
          </div>
        </div>
      ),
      isConnected: true,
    },
  ]

  const handleSelect = (providerId: string) => {
    setSelected(providerId)
  }

  const handleSave = () => {
    if (selected) {
      const provider = calendarProviders.find((p) => p.id === selected)
      if (provider) {
        onSelect(provider)
        onClose()
      }
    }
  }

  return (
    <ConfigModal isOpen={isOpen} onClose={onClose} title="Choose Calendar Provider">
      <div className="space-y-4">
        {/* Calendar providers grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {calendarProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => provider.isConnected && handleSelect(provider.id)}
              className={`flex flex-col items-center p-4 rounded-lg border ${
                !provider.isConnected
                  ? "border-border bg-background opacity-60 cursor-not-allowed"
                  : selected === provider.id
                    ? "border-blue-500 bg-blue-500/10 cursor-pointer"
                    : "border-border bg-background hover:bg-secondary/50 cursor-pointer"
              } transition-colors relative`}
            >
              {selected === provider.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              <div className="mb-3">{provider.logo}</div>
              <h3 className="text-sm font-medium text-foreground text-center mb-1">{provider.name}</h3>
              {provider.description && (
                <p className="text-xs text-muted-foreground text-center">{provider.description}</p>
              )}

              {!provider.isConnected && <span className="mt-2 text-xs text-yellow-500">Not connected</span>}
            </div>
          ))}
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
            disabled={!selected}
            className={`px-4 py-2 rounded-lg text-sm text-white transition-colors ${
              selected ? "bg-[#635AFE] hover:bg-[#5048E5]" : "bg-secondary opacity-50 cursor-not-allowed"
            }`}
          >
            Select
          </button>
        </div>
      </div>
    </ConfigModal>
  )
}
