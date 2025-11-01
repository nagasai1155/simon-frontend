"use client"

import { X, FileText, File, BookOpen, Copy, Check } from "lucide-react"
import { useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"

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

interface ViewKnowledgeBaseModalProps {
  isOpen: boolean
  onClose: () => void
  knowledgeBase: KnowledgeBase | null
}

export default function ViewKnowledgeBaseModal({ isOpen, onClose, knowledgeBase }: ViewKnowledgeBaseModalProps) {
  const { theme } = useTheme()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  if (!isOpen || !knowledgeBase) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getFileIcon = (fileType: string, fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (fileType.includes("pdf") || extension === "pdf") {
      return <FileText className="w-5 h-5 text-red-500" />
    }
    if (fileType.includes("word") || extension === "doc" || extension === "docx") {
      return <FileText className="w-5 h-5 text-blue-500" />
    }
    if (fileType.includes("text") || extension === "txt") {
      return <File className="w-5 h-5 text-gray-500" />
    }
    return <BookOpen className="w-5 h-5" />
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(knowledgeBase.content)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-4xl max-h-[90vh] ${
          theme === "dark" ? "bg-card" : "bg-white"
        } rounded-xl shadow-lg overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-primary/20" : "bg-blue-100"}`}>
              {getFileIcon(knowledgeBase.file_type, knowledgeBase.file_name)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{knowledgeBase.name}</h2>
              <p className="text-sm text-muted-foreground">{knowledgeBase.file_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${
              theme === "dark" ? "hover:bg-muted/50" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">File Size</p>
              <p className="font-medium">{formatFileSize(knowledgeBase.file_size)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(knowledgeBase.created_at)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDate(knowledgeBase.updated_at)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Access Count</p>
              <p className="font-medium">{knowledgeBase.access_count}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 pb-3">
            <h3 className="text-lg font-medium">Content</h3>
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                theme === "dark"
                  ? "bg-secondary hover:bg-secondary/80 text-foreground"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="flex-1 overflow-auto px-6 pb-6">
            <div
              className={`p-4 rounded-lg ${theme === "dark" ? "bg-background/50" : "bg-gray-50"} border border-border`}
            >
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">{knowledgeBase.content}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              theme === "dark"
                ? "bg-secondary hover:bg-secondary/80 text-foreground"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
