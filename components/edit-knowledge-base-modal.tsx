"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Loader2, AlertCircle } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import { updateKnowledgeBase } from "@/app/actions/knowledge-base"

interface KnowledgeBase {
  id: string
  name: string
  description: string
  file_name: string
  file_type: string
  file_size: number
  content: string
  status: string
  created_at: string
  updated_at: string
  access_count: number
}

interface EditKnowledgeBaseModalProps {
  isOpen: boolean
  onClose: () => void
  knowledgeBase: KnowledgeBase | null
  onUpdate: () => void
}

export default function EditKnowledgeBaseModal({
  isOpen,
  onClose,
  knowledgeBase,
  onUpdate,
}: EditKnowledgeBaseModalProps) {
  const { theme } = useTheme()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (knowledgeBase) {
      setName(knowledgeBase.name)
      setDescription(knowledgeBase.description)
      setContent(knowledgeBase.content)
      setError(null)
    }
  }, [knowledgeBase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Name is required")
      return
    }

    if (!content.trim()) {
      setError("Content cannot be empty")
      return
    }

    if (!knowledgeBase) return

    setIsUpdating(true)
    setError(null)

    try {
      const result = await updateKnowledgeBase(knowledgeBase.id, {
        name: name.trim(),
        description: description.trim(),
        content: content.trim(),
      })

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        })
        onUpdate()
        onClose()
      } else {
        setError(result.error || "Update failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Update error:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClose = () => {
    if (!isUpdating) {
      onClose()
    }
  }

  if (!isOpen || !knowledgeBase) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl max-h-[90vh] ${
          theme === "dark" ? "bg-card" : "bg-white"
        } rounded-xl shadow-lg overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Edit Knowledge Base</h2>
          <button
            onClick={handleClose}
            disabled={isUpdating}
            className={`p-2 rounded-full ${
              theme === "dark" ? "hover:bg-muted/50" : "hover:bg-gray-100"
            } transition-colors disabled:opacity-50`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="edit-name" className="block text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="edit-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(null)
                }}
                placeholder="Knowledge base name"
                disabled={isUpdating}
                className={`w-full p-3 rounded-lg transition-all ${
                  theme === "dark"
                    ? "bg-background border border-border focus:border-primary"
                    : "bg-white border border-gray-200 focus:border-blue-400"
                } focus:outline-none focus:ring-2 ${
                  theme === "dark" ? "focus:ring-primary/20" : "focus:ring-blue-100"
                } disabled:opacity-50`}
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label htmlFor="edit-description" className="block text-sm font-medium">
                Description
              </label>
              <input
                type="text"
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the knowledge base"
                disabled={isUpdating}
                className={`w-full p-3 rounded-lg transition-all ${
                  theme === "dark"
                    ? "bg-background border border-border focus:border-primary"
                    : "bg-white border border-gray-200 focus:border-blue-400"
                } focus:outline-none focus:ring-2 ${
                  theme === "dark" ? "focus:ring-primary/20" : "focus:ring-blue-100"
                } disabled:opacity-50`}
              />
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <label htmlFor="edit-content" className="block text-sm font-medium">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="edit-content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  setError(null)
                }}
                placeholder="Knowledge base content"
                disabled={isUpdating}
                rows={12}
                className={`w-full p-3 rounded-lg transition-all resize-none font-mono text-sm ${
                  theme === "dark"
                    ? "bg-background border border-border focus:border-primary"
                    : "bg-white border border-gray-200 focus:border-blue-400"
                } focus:outline-none focus:ring-2 ${
                  theme === "dark" ? "focus:ring-primary/20" : "focus:ring-blue-100"
                } disabled:opacity-50`}
              />
            </div>

            {/* Error Display */}
            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                theme === "dark"
                  ? "bg-secondary hover:bg-secondary/80 text-foreground"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating || !name.trim() || !content.trim()}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50 ${
                theme === "dark"
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUpdating ? "Updating..." : "Update Knowledge Base"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
