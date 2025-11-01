"use client"

import { useState } from "react"
import { Phone, Check, Globe } from "lucide-react"
import ConfigModal from "./config-modal"

interface PhoneNumber {
  id: string
  number: string
  nickname?: string
  type: "local" | "tollfree" | "mobile" | "sip"
  isActive: boolean
}

interface PhoneNumberModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (numbers: PhoneNumber[]) => void
  selectedNumbers?: PhoneNumber[]
}

export default function PhoneNumberModal({ isOpen, onClose, onSelect, selectedNumbers = [] }: PhoneNumberModalProps) {
  const [selected, setSelected] = useState<PhoneNumber[]>(selectedNumbers)

  // Sample phone numbers data
  const phoneNumbers: PhoneNumber[] = [
    { id: "1", number: "+1 (555) 123-4567", nickname: "Sales Line", type: "local", isActive: true },
    { id: "2", number: "+1 (800) 555-1234", nickname: "Support", type: "tollfree", isActive: true },
    { id: "3", number: "+1 (555) 987-6543", nickname: "Marketing", type: "local", isActive: true },
    { id: "4", number: "sip:sales@example.com", nickname: "SIP Trunk", type: "sip", isActive: true },
  ]

  const toggleNumber = (number: PhoneNumber) => {
    if (selected.some((n) => n.id === number.id)) {
      setSelected(selected.filter((n) => n.id !== number.id))
    } else {
      setSelected([...selected, number])
    }
  }

  const handleSave = () => {
    onSelect(selected)
    onClose()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tollfree":
        return (
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <Phone className="w-4 h-4 text-green-400" />
          </div>
        )
      case "sip":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Globe className="w-4 h-4 text-purple-400" />
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Phone className="w-4 h-4 text-blue-400" />
          </div>
        )
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "local":
        return "Local"
      case "tollfree":
        return "Toll-Free"
      case "mobile":
        return "Mobile"
      case "sip":
        return "SIP"
      default:
        return type
    }
  }

  return (
    <ConfigModal isOpen={isOpen} onClose={onClose} title="Choose Phone Numbers">
      <div className="space-y-4">
        {/* Phone numbers list */}
        <div className="max-h-[350px] overflow-y-auto pr-1">
          <div className="space-y-2">
            {phoneNumbers.map((number) => (
              <div
                key={number.id}
                onClick={() => number.isActive && toggleNumber(number)}
                className={`flex items-center p-3 rounded-lg border ${
                  !number.isActive
                    ? "border-border bg-background opacity-60 cursor-not-allowed"
                    : selected.some((n) => n.id === number.id)
                      ? "border-blue-500 bg-blue-500/10 cursor-pointer"
                      : "border-border bg-background hover:bg-secondary/50 cursor-pointer"
                } transition-colors`}
              >
                <div className="flex-1 flex items-center min-w-0">
                  {getTypeIcon(number.type)}
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-foreground truncate">{number.number}</p>
                    <div className="flex items-center">
                      {number.nickname && (
                        <p className="text-xs text-muted-foreground truncate mr-2">{number.nickname}</p>
                      )}
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary text-foreground/80">
                        {getTypeLabel(number.type)}
                      </span>
                    </div>
                  </div>
                </div>

                {selected.some((n) => n.id === number.id) && (
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
