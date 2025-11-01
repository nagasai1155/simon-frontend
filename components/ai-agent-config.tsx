"use client"

import { useState } from "react"
import { Mail, Calendar, Phone, Mic, Info } from "lucide-react"
import EmailAccountsModal from "./email-accounts-modal"
import CalendarModal from "./calendar-modal"
import PhoneNumberModal from "./phone-number-modal"
import VoiceModal from "./voice-modal"

export default function AIAgentConfig() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)

  const [selectedEmails, setSelectedEmails] = useState<any[]>([])
  const [selectedCalendar, setSelectedCalendar] = useState<any>(null)
  const [selectedPhone, setSelectedPhone] = useState<any>(null)
  const [selectedVoice, setSelectedVoice] = useState<any>(null)

  return (
    <div className="space-y-6">
      {/* Voice Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-medium">Voice</h3>
          {selectedVoice && (
            <button onClick={() => setIsVoiceModalOpen(true)} className="text-xs text-blue-400 hover:text-blue-300">
              Change
            </button>
          )}
        </div>
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="w-full flex items-center justify-between p-3 bg-[#111] hover:bg-[#161616] border border-[#333] rounded-lg transition-colors"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <Mic className="w-4 h-4 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {selectedVoice
                  ? `${selectedVoice.name} (${selectedVoice.gender === "male" ? "Male" : "Female"}, ${selectedVoice.accent})`
                  : "Choose a voice..."}
              </p>
              {selectedVoice && selectedVoice.personality && (
                <p className="text-xs text-gray-400">{selectedVoice.personality}</p>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {!selectedVoice && (
              <div className="flex items-center mr-2">
                <Info className="w-3.5 h-3.5 text-yellow-500 mr-1" />
                <span className="text-xs text-yellow-500">Required</span>
              </div>
            )}
            <span className="text-xs text-blue-400">Select</span>
          </div>
        </button>
      </div>

      {/* Email Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-medium">Outreach Email</h3>
          {selectedEmails.length > 0 && (
            <button onClick={() => setIsEmailModalOpen(true)} className="text-xs text-blue-400 hover:text-blue-300">
              Change
            </button>
          )}
        </div>
        <button
          onClick={() => setIsEmailModalOpen(true)}
          className="w-full flex items-center justify-between p-3 bg-[#111] hover:bg-[#161616] border border-[#333] rounded-lg transition-colors"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {selectedEmails.length > 0
                  ? `${selectedEmails.length} email account${selectedEmails.length > 1 ? "s" : ""} selected`
                  : "Select Email Accounts"}
              </p>
              {selectedEmails.length > 0 && (
                <p className="text-xs text-gray-400 truncate max-w-[250px]">
                  {selectedEmails.map((e) => e.email).join(", ")}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {selectedEmails.length === 0 && (
              <div className="flex items-center mr-2">
                <Info className="w-3.5 h-3.5 text-yellow-500 mr-1" />
                <span className="text-xs text-yellow-500">Required</span>
              </div>
            )}
            <span className="text-xs text-blue-400">Select</span>
          </div>
        </button>
      </div>

      {/* Calendar Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-medium">Calendar</h3>
          {selectedCalendar && (
            <button onClick={() => setIsCalendarModalOpen(true)} className="text-xs text-blue-400 hover:text-blue-300">
              Change
            </button>
          )}
        </div>
        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="w-full flex items-center justify-between p-3 bg-[#111] hover:bg-[#161616] border border-[#333] rounded-lg transition-colors"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-400" />
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
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-medium">Phone Number</h3>
          {selectedPhone && (
            <button onClick={() => setIsPhoneModalOpen(true)} className="text-xs text-blue-400 hover:text-blue-300">
              Change
            </button>
          )}
        </div>
        <button
          onClick={() => setIsPhoneModalOpen(true)}
          className="w-full flex items-center justify-between p-3 bg-[#111] hover:bg-[#161616] border border-[#333] rounded-lg transition-colors"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Phone className="w-4 h-4 text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{selectedPhone ? selectedPhone.number : "Select Phone Number"}</p>
              {selectedPhone && selectedPhone.nickname && (
                <p className="text-xs text-gray-400">{selectedPhone.nickname}</p>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {!selectedPhone && (
              <div className="flex items-center mr-2">
                <Info className="w-3.5 h-3.5 text-yellow-500 mr-1" />
                <span className="text-xs text-yellow-500">Required</span>
              </div>
            )}
            <span className="text-xs text-blue-400">Select</span>
          </div>
        </button>
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
