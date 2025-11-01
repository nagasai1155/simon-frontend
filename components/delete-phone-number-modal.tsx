"use client"

import { useEffect } from "react"
import { X, AlertTriangle, Trash2 } from "lucide-react"
import { deletePhoneNumber } from "@/app/actions/phone-numbers"
import { useActionState } from "react"
import { toast } from "sonner"

interface DeletePhoneNumberModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: string
  nickname?: string
}

export default function DeletePhoneNumberModal({
  isOpen,
  onClose,
  phoneNumber,
  nickname,
}: DeletePhoneNumberModalProps) {
  const [state, action, isPending] = useActionState(deletePhoneNumber, null)

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      onClose()
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-card backdrop-filter backdrop-blur-xl rounded-xl w-full max-w-md border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-border bg-gradient-to-r from-red-500/10 to-red-600/10">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            Delete Phone Number
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors bg-secondary hover:bg-secondary/80 rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">
                Are you sure you want to delete this phone number?
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Phone Number: <span className="font-medium text-foreground">{phoneNumber}</span>
                </p>
                {nickname && (
                  <p className="text-sm text-muted-foreground">
                    Nickname: <span className="font-medium text-foreground">{nickname}</span>
                  </p>
                )}
              </div>
              <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
                ⚠️ This action cannot be undone. The phone number will be permanently removed from both Retell.ai and
                your account.
              </p>
            </div>
          </div>
        </div>

        <form
          action={action}
          className="flex justify-between items-center p-4 border-t border-border bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm gap-3"
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <input type="hidden" name="phoneNumber" value={phoneNumber} />

          <button
            type="submit"
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Phone Number
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
