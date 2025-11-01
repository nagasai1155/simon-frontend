"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"

interface DeleteKnowledgeBaseModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  knowledgeBaseName: string
  isDeleting: boolean
}

export function DeleteKnowledgeBaseModal({
  isOpen,
  onClose,
  onConfirm,
  knowledgeBaseName,
  isDeleting,
}: DeleteKnowledgeBaseModalProps) {
  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-xl font-semibold">Delete Knowledge Base</DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-foreground">"{knowledgeBaseName}"</span>
            ?
            <br />
            <br />
            This action cannot be undone. All content and data associated with this knowledge base will be permanently
            removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Knowledge Base"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
