"use client"

import type React from "react"

import { useState, useRef } from "react"
import { AlertCircle, Upload, X, FileText, File, FileQuestion, Loader2 } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import { uploadKnowledgeBase } from "@/app/actions/knowledge-base"

interface UploadKnowledgeBaseModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UploadKnowledgeBaseModal({ isOpen, onClose }: UploadKnowledgeBaseModalProps) {
  const { theme } = useTheme()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    // Check file type
    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    const allowedExtensions = [".txt", ".pdf", ".doc", ".docx"]
    const fileExtension = "." + selectedFile.name.split(".").pop()?.toLowerCase()

    if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
      setError("Only PDF, DOC, DOCX, and TXT files are supported")
      return
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setFile(selectedFile)
    setError(null)

    // Auto-generate name if empty
    if (!name.trim()) {
      const baseName = selectedFile.name.split(".").slice(0, -1).join(".")
      setName(baseName)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Name is required")
      return
    }

    if (!file) {
      setError("File is required")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", name.trim())
      formData.append("file", file)

      const result = await uploadKnowledgeBase(formData)

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        })
        onClose()
        // Reset form
        setName("")
        setFile(null)
        setError(null)
      } else {
        setError(result.error || "Upload failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = () => {
    if (!file) return <FileQuestion className="w-6 h-6" />

    const extension = file.name.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-500" />
      case "doc":
      case "docx":
        return <FileText className="w-6 h-6 text-blue-500" />
      case "txt":
        return <File className="w-6 h-6 text-gray-500" />
      default:
        return <FileQuestion className="w-6 h-6" />
    }
  }

  const resetForm = () => {
    setName("")
    setFile(null)
    setError(null)
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      resetForm()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-lg ${theme === "dark" ? "bg-card" : "bg-white"} rounded-xl shadow-lg overflow-hidden`}
      >
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h2 className="text-xl font-semibold">Upload Knowledge Base</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className={`p-1.5 rounded-full ${
              theme === "dark" ? "hover:bg-muted/50" : "hover:bg-gray-100"
            } transition-colors disabled:opacity-50`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Knowledge Base Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError(null)
              }}
              placeholder="e.g., Sales Playbook, Product Documentation"
              disabled={isUploading}
              className={`w-full p-3 rounded-lg transition-all ${
                theme === "dark"
                  ? "bg-background border border-border focus:border-primary"
                  : "bg-white border border-gray-200 focus:border-blue-400"
              } focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-primary/20" : "focus:ring-blue-100"} disabled:opacity-50`}
            />
          </div>

          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Upload File <span className="text-red-500">*</span>
            </label>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? theme === "dark"
                    ? "border-primary/70 bg-primary/10"
                    : "border-blue-400 bg-blue-50"
                  : theme === "dark"
                    ? "border-border hover:border-primary/50 bg-background/50"
                    : "border-gray-300 hover:border-blue-300 bg-gray-50"
              } ${isUploading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${theme === "dark" ? "bg-primary/10" : "bg-blue-100"}`}>
                  {isUploading ? (
                    <Loader2
                      className={`w-8 h-8 animate-spin ${theme === "dark" ? "text-primary" : "text-blue-600"}`}
                    />
                  ) : (
                    <Upload className={`w-8 h-8 ${theme === "dark" ? "text-primary" : "text-blue-600"}`} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-lg">{isUploading ? "Processing..." : "Drag & drop your file here"}</p>
                  {!isUploading && (
                    <>
                      <p className="text-muted-foreground mt-1">or click to browse</p>
                      <p className={`text-xs mt-4 ${theme === "dark" ? "text-muted-foreground" : "text-gray-500"}`}>
                        Supports PDF, DOC, DOCX, TXT (max. 10MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                disabled={isUploading}
              />
            </div>

            {/* Selected File Display */}
            {file && (
              <div
                className={`p-4 rounded-lg flex items-center gap-4 ${
                  theme === "dark" ? "bg-primary/10" : "bg-blue-50"
                }`}
              >
                <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-primary/20" : "bg-blue-100"}`}>
                  {getFileIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {!isUploading && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                    className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-background/80" : "hover:bg-white/80"}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className={`px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                theme === "dark"
                  ? "bg-secondary hover:bg-secondary/80 text-foreground"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !name.trim() || !file}
              className={`px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50 ${
                theme === "dark"
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUploading ? "Uploading..." : "Upload Knowledge Base"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
