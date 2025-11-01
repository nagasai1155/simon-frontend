"use client"

import { useState } from "react"
import { Mail, Calendar, Phone, Mic } from "lucide-react"
import EmailAccountsModal from "@/components/email-accounts-modal"
import CalendarModal from "@/components/calendar-modal"
import PhoneNumberModal from "@/components/phone-number-modal"
import VoiceModal from "@/components/voice-modal"

export default function AIAgentConfigDemo() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)

  const [selectedEmails, setSelectedEmails] = useState<any[]>([])
  const [selectedCalendar, setSelectedCalendar] = useState<any>(null)
  const [selectedPhone, setSelectedPhone] = useState<any>(null)
  const [selectedVoice, setSelectedVoice] = useState<any>(null)

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-8">AI Agent Configuration</h1>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Voice Selection */}
        <div className="bg-[#111] border border-[#333] rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Voice</h2>
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#444] rounded-lg transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Mic className="w-5 h-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{selectedVoice ? selectedVoice.name : "Choose a voice..."}</p>
                {selectedVoice && (
                  <p className="text-xs text-gray-400">
                    {selectedVoice.gender === "male" ? "Male" : "Female"} • {selectedVoice.accent}
                  </p>
                )}
              </div>
            </div>
            <span className="text-xs text-blue-400">Select</span>
          </button>
        </div>

        {/* Email Selection */}
        <div className="bg-[#111] border border-[#333] rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Outreach Email</h2>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#444] rounded-lg transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {selectedEmails.length > 0
                    ? `${selectedEmails.length} email account${selectedEmails.length > 1 ? "s" : ""} selected`
                    : "Select Email Accounts"}
                </p>
                {selectedEmails.length > 0 && (
                  <p className="text-xs text-gray-400">{selectedEmails.map((e) => e.email).join(", ")}</p>
                )}
              </div>
            </div>
            <span className="text-xs text-blue-400">Select</span>
          </button>
        </div>

        {/* Calendar Selection */}
        <div className="bg-[#111] border border-[#333] rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Calendar</h2>
          <button
            onClick={() => setIsCalendarModalOpen(true)}
            className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#444] rounded-lg transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{selectedCalendar ? selectedCalendar.name : "Select Calendar"}</p>
                {selectedCalendar && <p className="text-xs text-gray-400">Connect for scheduling</p>}
              </div>
            </div>
            <span className="text-xs text-blue-400">Select</span>
          </button>
        </div>

        {/* Phone Number Selection */}
        <div className="bg-[#111] border border-[#333] rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Phone Number</h2>
          <button
            onClick={() => setIsPhoneModalOpen(true)}
            className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#444] rounded-lg transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-purple-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{selectedPhone ? selectedPhone.number : "Select Phone Number"}</p>
                {selectedPhone && selectedPhone.nickname && (
                  <p className="text-xs text-gray-400">{selectedPhone.nickname}</p>
                )}
              </div>
            </div>
            <span className="text-xs text-blue-400">Select</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <EmailAccountsModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSelect={setSelectedEmails}
        selectedAccounts={selectedEmails}
      />

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        onSelect={setSelectedCalendar}
        selectedProvider={selectedCalendar?.id}
      />

      <PhoneNumberModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onSelect={setSelectedPhone}
        selectedNumber={selectedPhone?.id}
      />

      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSelect={setSelectedVoice}
        selectedVoice={selectedVoice?.id}
      />
    </div>
  )
}
