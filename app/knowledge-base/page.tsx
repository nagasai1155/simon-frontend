"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  BookOpen,
  FileText,
  Clock,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  File,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import EmptyState from "@/components/empty-state"
import UploadKnowledgeBaseModal from "@/components/upload-knowledge-base-modal"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { getKnowledgeBases, deleteKnowledgeBase } from "@/app/actions/knowledge-base"
import ViewKnowledgeBaseModal from "@/components/view-knowledge-base-modal"
import EditKnowledgeBaseModal from "@/components/edit-knowledge-base-modal"
import { DeleteKnowledgeBaseModal } from "@/components/delete-knowledge-base-modal"

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

export default function KnowledgeBase() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBase | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [knowledgeBaseToDelete, setKnowledgeBaseToDelete] = useState<{ id: string; name: string } | null>(null)
  const { theme } = useTheme()
  const { toast } = useToast()

  // Load knowledge bases from Supabase
  const loadKnowledgeBases = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getKnowledgeBases()
      if (result.success) {
        setKnowledgeBases(result.data)
      } else {
        setError(result.error || "Failed to load knowledge bases")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Load error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadKnowledgeBases()
  }, [])

  // Filter knowledge bases based on search query
  const filteredKnowledgeBases = knowledgeBases.filter(
    (kb) =>
      kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kb.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kb.file_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleOptions = (id: string) => {
    setShowOptions(showOptions === id ? null : id)
  }

  const handleDeleteClick = (id: string, name: string) => {
    setKnowledgeBaseToDelete({ id, name })
    setDeleteModalOpen(true)
    setShowOptions(null)
  }

  const handleDeleteConfirm = async () => {
    if (!knowledgeBaseToDelete) return

    setDeletingId(knowledgeBaseToDelete.id)

    try {
      const result = await deleteKnowledgeBase(knowledgeBaseToDelete.id)
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        })
        // Reload the data
        await loadKnowledgeBases()
        setDeleteModalOpen(false)
        setKnowledgeBaseToDelete(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete knowledge base",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setKnowledgeBaseToDelete(null)
  }

  const handleView = (kb: KnowledgeBase) => {
    setSelectedKnowledgeBase(kb)
    setViewModalOpen(true)
    setShowOptions(null)
  }

  const handleEdit = (kb: KnowledgeBase) => {
    setSelectedKnowledgeBase(kb)
    setEditModalOpen(true)
    setShowOptions(null)
  }

  const handleModalUpdate = () => {
    loadKnowledgeBases()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const getFileIcon = (fileType: string, fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (fileType.includes("pdf") || extension === "pdf") {
      return <FileText className="w-6 h-6 text-red-500" />
    }
    if (fileType.includes("word") || extension === "doc" || extension === "docx") {
      return <FileText className="w-6 h-6 text-blue-500" />
    }
    if (fileType.includes("text") || extension === "txt") {
      return <File className="w-6 h-6 text-gray-500" />
    }
    return <BookOpen className="w-6 h-6" />
  }

  const handleModalClose = () => {
    setIsUploadModalOpen(false)
    // Reload data when modal closes (in case something was uploaded)
    loadKnowledgeBases()
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold">Knowledge Base</h1>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === "dark"
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Upload Knowledge Base</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search Knowledge Base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "bg-card border border-border focus:border-primary/50"
                    : "bg-white border border-gray-200 focus:border-blue-300"
                } focus:outline-none focus:ring-1 focus:ring-primary/30`}
              />
            </div>
            <button
              onClick={loadKnowledgeBases}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                theme === "dark"
                  ? "bg-secondary hover:bg-secondary/80 text-foreground"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } disabled:opacity-50`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
              <span>Refresh</span>
            </button>
          </div>

          {/* Content Area */}
          <div
            className={`rounded-xl overflow-hidden ${
              theme === "dark" ? "bg-card/50 border border-border/50" : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading knowledge bases...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={loadKnowledgeBases}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    theme === "dark"
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Try Again
                </button>
              </div>
            ) : filteredKnowledgeBases.length === 0 ? (
              <div className="p-8">
                {knowledgeBases.length === 0 ? (
                  <EmptyState
                    icon={<BookOpen className="w-10 h-10" />}
                    title="No knowledge bases found"
                    description="Upload your first knowledge base to help your AI agents answer questions accurately."
                  />
                ) : (
                  <EmptyState
                    icon={<Search className="w-10 h-10" />}
                    title="No results found"
                    description={`No knowledge bases match "${searchQuery}". Try adjusting your search terms.`}
                  />
                )}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredKnowledgeBases.map((kb) => (
                  <div
                    key={kb.id}
                    className={`p-5 transition-colors ${theme === "dark" ? "hover:bg-muted/20" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-primary/20" : "bg-blue-100"}`}>
                        {getFileIcon(kb.file_type, kb.file_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">{kb.name}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{kb.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {kb.file_name} • {formatFileSize(kb.file_size)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDate(kb.created_at)}
                          </span>
                          <span className="text-xs text-muted-foreground">{kb.access_count} accesses</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(kb)}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            theme === "dark"
                              ? "bg-primary/20 text-primary hover:bg-primary/30"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          View
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => toggleOptions(kb.id)}
                            disabled={deletingId === kb.id}
                            className={`p-2 rounded-lg ${theme === "dark" ? "hover:bg-muted" : "hover:bg-gray-100"} disabled:opacity-50`}
                          >
                            {deletingId === kb.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            ) : (
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>

                          {showOptions === kb.id && (
                            <div className="absolute right-0 top-8 w-44 bg-popover border border-border rounded-md shadow-lg z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleEdit(kb)}
                                  className="flex items-center w-full px-3 py-1.5 text-xs text-foreground hover:bg-secondary transition-colors"
                                >
                                  <Edit className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                                  Edit knowledge base
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(kb.id, kb.name)}
                                  className="flex items-center w-full px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                                  Delete knowledge base
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadKnowledgeBaseModal isOpen={isUploadModalOpen} onClose={handleModalClose} />

      {/* View Modal */}
      <ViewKnowledgeBaseModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        knowledgeBase={selectedKnowledgeBase}
      />

      {/* Edit Modal */}
      <EditKnowledgeBaseModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        knowledgeBase={selectedKnowledgeBase}
        onUpdate={handleModalUpdate}
      />

      {/* Delete Modal */}
      <DeleteKnowledgeBaseModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        knowledgeBaseName={knowledgeBaseToDelete?.name || ""}
        isDeleting={deletingId === knowledgeBaseToDelete?.id}
      />
    </div>
  )
}
