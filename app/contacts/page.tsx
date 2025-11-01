"use client"

import { useState, useEffect } from "react"
import {
  User,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Folder,
  FolderOpen,
  ArrowLeft,
  Users,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import AddLeadListModal from "@/components/add-lead-list-modal"
import { getLeadLists, getLeadsByListId, deleteLeadList } from "@/app/actions/lead-lists"
import { ConfirmActionModal } from "@/components/confirm-action-modal"

interface LeadList {
  id: string
  name: string
  description: string
  organization_id: string
  uploaded: boolean
  "created date": string
  "modified date": string
}

interface Lead {
  id: string
  contact_name: string
  email: string
  phone: string
  company_name: string
  status: string
  notes: string
  created_at: string
  updated_at: string
  lead_list_id: string
}

const statusConfig = {
  new: {
    label: "New",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  contacted: {
    label: "Contacted",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  qualified: {
    label: "Qualified",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  unqualified: {
    label: "Unqualified",
    color: "bg-red-100 text-red-800 border-red-300",
  },
}

export default function ContactsPage() {
  const [leadLists, setLeadLists] = useState<LeadList[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLeadList, setSelectedLeadList] = useState<LeadList | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [leadListToDelete, setLeadListToDelete] = useState<LeadList | null>(null)

  // Load lead lists on component mount
  useEffect(() => {
    loadLeadLists()
  }, [])

  const loadLeadLists = async () => {
    setIsLoading(true)
    try {
      const result = await getLeadLists()
      if (result.success) {
        setLeadLists(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load lead lists",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load lead lists",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadLeads = async (leadListId: string) => {
    setIsLoading(true)
    try {
      const result = await getLeadsByListId(leadListId)
      if (result.success) {
        setLeads(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load leads",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leads",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeadListClick = (leadList: LeadList) => {
    setSelectedLeadList(leadList)
    loadLeads(leadList.id)
  }

  const handleBackToFolders = () => {
    setSelectedLeadList(null)
    setLeads([])
    setSearchQuery("")
    setStatusFilter("all")
  }

  const handleDeleteLeadList = async (leadListId: string, leadListName: string) => {
    if (selectedLeadList && selectedLeadList.id === leadListId) {
      setSelectedLeadList(null)
      setLeads([])
    }

    setIsLoading(true)
    try {
      const result = await deleteLeadList(leadListId)
      if (result.success) {
        setLeadLists(leadLists.filter((list) => list.id !== leadListId))
        toast({
          title: "✅ Lead list deleted successfully",
          description: `"${leadListName}" and all its contacts have been permanently removed.`,
          duration: 5000,
        })
      } else {
        toast({
          title: "❌ Failed to delete lead list",
          description: result.error || "An unexpected error occurred while deleting the lead list.",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error("Delete lead list error:", error)
      toast({
        title: "❌ Error deleting lead list",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openDeleteModal = (leadList: LeadList) => {
    setLeadListToDelete(leadList)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (leadListToDelete) {
      handleDeleteLeadList(leadListToDelete.id, leadListToDelete.name)
      setLeadListToDelete(null)
    }
  }

  const handleDeleteLead = async (leadId: string, leadName: string) => {
    try {
          const response = await fetch(`https://sfktedqfipvuucelpggb.supabase.co/rest/v1/leads?id=eq.${leadId}`, {
      method: "DELETE",
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setLeads(leads.filter((lead) => lead.id !== leadId))
        toast({
          title: "Contact deleted",
          description: `${leadName} has been removed.`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete contact",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      })
    }
  }

  const filteredData = selectedLeadList
    ? leads.filter((lead) => {
        const matchesSearch =
          searchQuery === "" ||
          lead.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company_name.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || lead.status === statusFilter

        return matchesSearch && matchesStatus
      })
    : leadLists.filter((leadList) => {
        return (
          searchQuery === "" ||
          leadList.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          leadList.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                {selectedLeadList && (
                  <Button variant="ghost" size="icon" onClick={handleBackToFolders} className="flex-shrink-0">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {selectedLeadList ? selectedLeadList.name : "Contacts"}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {selectedLeadList
                      ? `Manage contacts in ${selectedLeadList.name}`
                      : "Manage your lead lists and contacts"}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-12 py-4 min-w-[220px] text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                {selectedLeadList ? "Add Contact" : "Add Lead List"}
              </Button>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 max-w-2xl">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        placeholder={selectedLeadList ? "Search contacts..." : "Search lead lists..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10 py-3 text-lg min-w-[400px] flex-1"
                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                          onClick={() => setSearchQuery("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Status Filter - Only show for leads view */}
                  {selectedLeadList && (
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="unqualified">Unqualified</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Active Filters */}
                {(searchQuery || (selectedLeadList && statusFilter !== "all")) && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: "{searchQuery}"
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => setSearchQuery("")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {selectedLeadList && statusFilter !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Status: {statusFilter}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => setStatusFilter("all")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("")
                        setStatusFilter("all")
                      }}
                      className="text-muted-foreground"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {selectedLeadList ? (
                      <>
                        <User className="w-5 h-5" />
                        Contacts ({filteredData.length})
                      </>
                    ) : (
                      <>
                        <Folder className="w-5 h-5" />
                        Lead Lists ({filteredData.length})
                      </>
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="text-center py-16">
                    <div className="mx-auto w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                    <h3 className="text-lg font-semibold mb-2">Loading your data...</h3>
                    <p className="text-muted-foreground">
                      Please wait while we fetch your {selectedLeadList ? "contacts" : "lead lists"}
                    </p>
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="mx-auto w-32 h-32 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                      {selectedLeadList ? (
                        <User className="w-16 h-16 text-muted-foreground/60" />
                      ) : (
                        <Folder className="w-16 h-16 text-muted-foreground/60" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      {selectedLeadList ? "No contacts found" : "No lead lists found"}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                      {searchQuery || (selectedLeadList && statusFilter !== "all")
                        ? "Try adjusting your search criteria or filters to find what you're looking for"
                        : selectedLeadList
                          ? "This lead list is empty. Start by adding your first contact to get organized"
                          : "Create your first lead list to start organizing and managing your contacts effectively"}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={() => setIsAddModalOpen(true)} size="lg" className="px-8 py-3">
                        <Plus className="w-5 h-5 mr-2" />
                        {selectedLeadList ? "Add Contact" : "Create Lead List"}
                      </Button>
                      {(searchQuery || (selectedLeadList && statusFilter !== "all")) && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchQuery("")
                            setStatusFilter("all")
                          }}
                          size="lg"
                          className="px-6 py-3"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                ) : selectedLeadList ? (
                  // Leads Table View
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-semibold text-sm">Name</th>
                          <th className="text-left p-4 font-semibold text-sm">Company</th>
                          <th className="text-left p-4 font-semibold text-sm">Contact Info</th>
                          <th className="text-left p-4 font-semibold text-sm">Status</th>
                          <th className="text-left p-4 font-semibold text-sm">Created</th>
                          <th className="text-right p-4 font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredData as Lead[]).map((lead, index) => (
                          <tr
                            key={lead.id}
                            className={`border-b hover:bg-muted/20 transition-colors ${
                              index % 2 === 0 ? "bg-background" : "bg-muted/5"
                            }`}
                          >
                            <td className="p-4">
                              <div className="font-semibold text-sm">{lead.contact_name}</div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1 text-sm">
                                <Building className="w-3 h-3 text-muted-foreground" />
                                {lead.company_name || "-"}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate">{lead.email}</span>
                                </div>
                                {lead.phone && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Phone className="w-3 h-3" />
                                    {lead.phone}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge
                                variant="outline"
                                className={`${statusConfig[lead.status as keyof typeof statusConfig]?.color || statusConfig.new.color} font-medium`}
                              >
                                {statusConfig[lead.status as keyof typeof statusConfig]?.label || "New"}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {new Date(lead.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete "${lead.contact_name}"?`)) {
                                        handleDeleteLead(lead.id, lead.contact_name)
                                      }
                                    }}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // Lead Lists Grid View
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(filteredData as LeadList[]).map((leadList) => (
                        <div
                          key={leadList.id}
                          className="bg-background border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors cursor-pointer group relative"
                          onClick={() => handleLeadListClick(leadList)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <FolderOpen className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-sm text-foreground">{leadList.name}</h3>
                                <p className="text-xs text-muted-foreground">Lead List</p>
                              </div>
                            </div>

                            {/* Simplified 3-dot menu with only delete option */}
                            <div className="relative">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-muted/80 transition-colors border border-transparent hover:border-border"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                    }}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40" onSelect={(e) => e.preventDefault()}>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      openDeleteModal(leadList)
                                    }}
                                    className="text-red-600 focus:text-red-600 cursor-pointer flex items-center"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{leadList.description}</p>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(leadList["created date"]).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>Click to view</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmActionModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setLeadListToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Lead List"
        description={
          leadListToDelete
            ? `Are you sure you want to permanently delete "${leadListToDelete.name}"? This action will remove the lead list and ALL contacts inside it. This cannot be undone.`
            : ""
        }
        confirmText="Delete Forever"
        cancelText="Cancel"
        variant="destructive"
      />

      {/* Add Lead List Modal */}
      <AddLeadListModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          if (!selectedLeadList) {
            loadLeadLists() // Refresh lead lists when modal closes
          }
        }}
      />
    </div>
  )
}
