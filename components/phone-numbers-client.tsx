"use client"

import { Search, Plus, Phone, Trash2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import EmptyState from "@/components/empty-state"
import AddPhoneNumberModal from "@/components/add-phone-number-modal"
import DeletePhoneNumberModal from "@/components/delete-phone-number-modal"

interface PhoneNumber {
  id: string
  phone_number_pretty: string
  nickname?: string
  area_code?: string
  number_provider?: string
  created_at: string
}

export default function PhoneNumbersClient({
  phoneNumbers,
  error,
}: {
  phoneNumbers: PhoneNumber[]
  error?: string
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    phoneNumber: string
    nickname?: string
  }>({
    isOpen: false,
    phoneNumber: "",
    nickname: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter phone numbers based on search text
  const filteredPhoneNumbers = phoneNumbers.filter(
    (phone) =>
      phone.phone_number_pretty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.area_code?.includes(searchQuery),
  )

  // Close modal dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModalOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Phone Numbers</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground py-1.5 px-4 rounded-md text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Phone Number</span>
          </button>

          {isModalOpen && <AddPhoneNumberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Search Phone Numbers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Content Area */}
      <div className="theme-card p-6">
        {error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">Error loading phone numbers</div>
            <div className="text-sm text-muted-foreground">{error}</div>
          </div>
        ) : filteredPhoneNumbers.length === 0 ? (
          <EmptyState
            icon={<Phone className="w-8 h-8" />}
            title={searchQuery ? "No phone numbers found" : "No phone numbers found"}
            description={
              searchQuery ? "No phone numbers match your search criteria." : "You haven't added any phone numbers yet."
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredPhoneNumbers.map((phone) => (
              <div
                key={phone.id}
                className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{phone.phone_number_pretty}</div>
                    <div className="text-sm text-muted-foreground">
                      {phone.nickname} • Area Code: {phone.area_code} • Provider: {phone.number_provider}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Added: {new Date(phone.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        phoneNumber: phone.phone_number_pretty,
                        nickname: phone.nickname,
                      })
                    }
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete phone number"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeletePhoneNumberModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            phoneNumber: "",
            nickname: "",
          })
        }
        phoneNumber={deleteModal.phoneNumber}
        nickname={deleteModal.nickname}
      />
    </>
  )
}
