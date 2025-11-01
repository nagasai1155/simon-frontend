"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalComModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (data: CalComData) => void
}

interface CalComData {
  nickname: string
  apiKey: string
  eventId: string
  timeZone: string
}

export function CalComModal({ isOpen, onClose, onConnect }: CalComModalProps) {
  const [formData, setFormData] = useState<CalComData>({
    nickname: "",
    apiKey: "",
    eventId: "",
    timeZone: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.apiKey || !formData.eventId || !formData.timeZone) {
      return
    }
    onConnect(formData)
    onClose()
    setFormData({ nickname: "", apiKey: "", eventId: "", timeZone: "" })
  }

  const timeZones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full max-w-[90vw]">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-semibold">Cal.com</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="nickname" className="text-base font-medium">
              Nickname
            </Label>
            <Input
              id="nickname"
              placeholder="Add a nickname"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              className="w-full h-12 px-4 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="apiKey" className="text-base font-medium">
              API Key
            </Label>
            <Input
              id="apiKey"
              placeholder="Copy here..."
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              className="w-full h-12 px-4 text-base"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="eventId" className="text-base font-medium">
              Event ID
            </Label>
            <Input
              id="eventId"
              placeholder="Type here..."
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              className="w-full h-12 px-4 text-base"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="timeZone" className="text-base font-medium">
              Time Zone
            </Label>
            <Select
              value={formData.timeZone}
              onValueChange={(value) => setFormData({ ...formData, timeZone: value })}
              required
            >
              <SelectTrigger className="w-full h-12 px-4 text-base">
                <SelectValue placeholder="Choose your timezone..." />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map((tz) => (
                  <SelectItem key={tz} value={tz} className="text-base">
                    {tz.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-base font-medium"
              disabled={!formData.apiKey || !formData.eventId || !formData.timeZone}
            >
              Connect
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
