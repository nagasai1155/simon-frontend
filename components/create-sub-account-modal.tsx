"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone } from "lucide-react"

interface CreateSubAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateSubAccount?: (name: string, emailCredits: number, callCredits: number) => void
  availableEmailCredits?: number
  availableCallCredits?: number
}

export function CreateSubAccountModal({
  isOpen,
  onClose,
  onCreateSubAccount = () => {},
  availableEmailCredits = 10000,
  availableCallCredits = 5000,
}: CreateSubAccountModalProps) {
  const [name, setName] = useState("")
  const [emailCredits, setEmailCredits] = useState(1000)
  const [callCredits, setCallCredits] = useState(500)
  const [error, setError] = useState<string | null>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("")
      setEmailCredits(1000)
      setCallCredits(500)
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Please enter a name for the sub-account")
      return
    }

    if (emailCredits < 0 || callCredits < 0) {
      setError("Credits cannot be negative")
      return
    }

    if (emailCredits > availableEmailCredits) {
      setError(`You only have ${availableEmailCredits.toLocaleString()} email credits available`)
      return
    }

    if (callCredits > availableCallCredits) {
      setError(`You only have ${availableCallCredits.toLocaleString()} call credits available`)
      return
    }

    onCreateSubAccount(name, emailCredits, callCredits)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-6 min-w-[350px]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl">Create Sub-Account</DialogTitle>
          <DialogDescription className="text-sm">
            Create a new sub-account with its own credit allocation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium">
                Sub-Account Name
              </Label>
              <Input
                id="name"
                placeholder="Marketing Team"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full px-3 py-2"
                style={{ minWidth: "100%", width: "100%" }}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="emailCredits" className="text-sm font-medium flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>Email Prospect Credits</span>
              </Label>
              <Input
                id="emailCredits"
                type="number"
                min="0"
                max={availableEmailCredits}
                value={emailCredits}
                onChange={(e) => setEmailCredits(Number.parseInt(e.target.value) || 0)}
                className="h-10 w-full px-3 py-2"
                style={{ minWidth: "100%", width: "100%" }}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Available: <span className="font-medium">{availableEmailCredits.toLocaleString()}</span> email credits
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded"
                    onClick={() => setEmailCredits(Math.floor(availableEmailCredits * 0.25))}
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded"
                    onClick={() => setEmailCredits(Math.floor(availableEmailCredits * 0.5))}
                  >
                    50%
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="callCredits" className="text-sm font-medium flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>Call Credits</span>
              </Label>
              <Input
                id="callCredits"
                type="number"
                min="0"
                max={availableCallCredits}
                value={callCredits}
                onChange={(e) => setCallCredits(Number.parseInt(e.target.value) || 0)}
                className="h-10 w-full px-3 py-2"
                style={{ minWidth: "100%", width: "100%" }}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Available: <span className="font-medium">{availableCallCredits.toLocaleString()}</span> call credits
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded"
                    onClick={() => setCallCredits(Math.floor(availableCallCredits * 0.25))}
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded"
                    onClick={() => setCallCredits(Math.floor(availableCallCredits * 0.5))}
                  >
                    50%
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Create Sub-Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
