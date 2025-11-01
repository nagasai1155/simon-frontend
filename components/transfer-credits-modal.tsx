"use client"

import { DialogFooter } from "@/components/ui/dialog"
import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone } from "lucide-react"

interface TransferCreditsModalProps {
  isOpen: boolean
  onClose: () => void
  onTransferCredits?: (
    fromId: number | string,
    toId: number | string,
    emailCredits: number,
    callCredits: number,
    isSubscriptionUpdate: boolean,
  ) => void
  accounts: any[]
  selectedAccountId?: string | null
  mainAccount?: any
}

export function TransferCreditsModal({
  isOpen,
  onClose,
  onTransferCredits = () => {},
  accounts,
  selectedAccountId,
  mainAccount,
}: TransferCreditsModalProps) {
  const [emailCredits, setEmailCredits] = useState(1000)
  const [callCredits, setCallCredits] = useState(500)
  const [toAccountId, setToAccountId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubscriptionUpdate, setIsSubscriptionUpdate] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState<{ emailCredits: number; callCredits: number } | null>(
    null,
  )

  // Update current subscription when account changes
  useEffect(() => {
    if (toAccountId) {
      const selectedAccount = accounts.find((acc) => acc.id.toString() === toAccountId)
      if (selectedAccount) {
        setCurrentSubscription({
          emailCredits: selectedAccount.emailCredits || 0,
          callCredits: selectedAccount.callCredits || 0,
        })

        // Pre-fill with current values if updating subscription
        if (isSubscriptionUpdate) {
          setEmailCredits(selectedAccount.emailCredits || 0)
          setCallCredits(selectedAccount.callCredits || 0)
        }
      }
    } else {
      setCurrentSubscription(null)
    }
  }, [toAccountId, accounts, isSubscriptionUpdate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedAccountId) {
      setError("Please select a source account")
      return
    }

    if (!toAccountId) {
      setError("Please select a destination account")
      return
    }

    if (emailCredits < 0 || callCredits < 0) {
      setError("Credits cannot be negative")
      return
    }

    const totalCredits = emailCredits + callCredits
    const fromAccount = selectedAccountId === "main" ? mainAccount : accounts.find((a) => a.id === selectedAccountId)

    if (!isSubscriptionUpdate && fromAccount && fromAccount.emailCredits + fromAccount.callCredits < totalCredits) {
      setError(
        `You only have ${(fromAccount.emailCredits + fromAccount.callCredits).toLocaleString()} total credits available`,
      )
      return
    }

    onTransferCredits(selectedAccountId, toAccountId, emailCredits, callCredits, isSubscriptionUpdate)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5 mb-4">
          <DialogTitle className="text-xl font-semibold">
            {isSubscriptionUpdate ? "Update Subscription" : "Transfer Credits"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isSubscriptionUpdate
              ? "Update the monthly credit allocation for this sub-account."
              : "Transfer credits between your main account and sub-accounts."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          {/* To Account Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="toAccount" className="text-sm font-medium">
              To Account
            </Label>
            <div className="relative">
              <select
                id="toAccount"
                className="w-full bg-background border border-input rounded-md py-2 px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring h-10 appearance-none pr-8 min-w-[100%]"
                value={toAccountId || ""}
                onChange={(e) => {
                  setToAccountId(e.target.value)
                  setIsSubscriptionUpdate(false)
                }}
              >
                <option value="" disabled>
                  Select a sub-account
                </option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id.toString()}>
                    {account.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Type Selection */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Action Type</Label>
            <div className="grid grid-cols-1 gap-2">
              <div
                className={`border rounded-md p-3 hover:bg-muted/50 cursor-pointer transition-colors ${!isSubscriptionUpdate ? "border-primary bg-primary/5" : ""}`}
                onClick={() => setIsSubscriptionUpdate(false)}
              >
                <div className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="one-time"
                    name="actionType"
                    checked={!isSubscriptionUpdate}
                    onChange={() => setIsSubscriptionUpdate(false)}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary mt-0.5"
                  />
                  <div className="flex-1">
                    <label htmlFor="one-time" className="text-sm font-medium block cursor-pointer">
                      One-time transfer
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">Transfer credits once for occasional needs.</p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-md p-3 hover:bg-muted/50 cursor-pointer transition-colors ${isSubscriptionUpdate ? "border-primary bg-primary/5" : ""}`}
                onClick={() => setIsSubscriptionUpdate(true)}
              >
                <div className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="subscription"
                    name="actionType"
                    checked={isSubscriptionUpdate}
                    onChange={() => setIsSubscriptionUpdate(true)}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary mt-0.5"
                  />
                  <div className="flex-1">
                    <label htmlFor="subscription" className="text-sm font-medium block cursor-pointer">
                      Update subscription
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">Change monthly credit allocation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Inputs */}
          <div className="space-y-4">
            {/* Email Credits */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                <Label htmlFor="emailCredits" className="text-sm font-medium">
                  Email Credits
                </Label>
              </div>
              <Input
                id="emailCredits"
                type="number"
                min="0"
                value={emailCredits}
                onChange={(e) => setEmailCredits(Number.parseInt(e.target.value) || 0)}
                className="h-10 w-full min-w-[100%]"
              />
              {/* Percentage buttons removed */}
            </div>

            {/* Call Credits */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                <Label htmlFor="callCredits" className="text-sm font-medium">
                  Call Credits
                </Label>
              </div>
              <Input
                id="callCredits"
                type="number"
                min="0"
                value={callCredits}
                onChange={(e) => setCallCredits(Number.parseInt(e.target.value) || 0)}
                className="h-10 w-full min-w-[100%]"
              />
              {/* Percentage buttons removed */}
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="text-xs text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          {/* Footer Buttons */}
          <DialogFooter className="flex-row gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="h-9 px-4 text-sm">
              Cancel
            </Button>
            <Button type="submit" className="h-9 px-4 text-sm">
              {isSubscriptionUpdate ? "Update Subscription" : "Transfer Credits"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
