"use client"

import { Plus, MoreHorizontal, Target, Pause, Edit, Trash2, Users, Calendar, Clock } from "lucide-react"
import Sidebar from "@/components/sidebar"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ConfirmActionModal } from "@/components/confirm-action-modal"

interface Campaign {
  id: string
  name: string
  type: string
  channels: string[]
  status: string
  settings: {
    timezone: string
    activeDays: string[]
    workingHours: {
      start: string
      end: string
    }
    doubleDial: boolean
    personalization: boolean
  }
  metadata?: {
    total_leads?: number
    research_completed?: number
    research_failed?: number
  }
  created_at: string
  updated_at: string
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showOptions, setShowOptions] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        `https://sfktedqfipvuucelpggb.supabase.co/rest/v1/campaigns?select=*&order=created_at.desc`,
        {
          method: "GET",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch campaigns: ${response.status}`)
      }

      const data = await response.json()
      // Ensure each campaign has proper structure
      const sanitizedCampaigns = data.map((campaign) => ({
        ...campaign,
        channels: Array.isArray(campaign.channels) ? campaign.channels : [],
        settings: campaign.settings || {
          timezone: "",
          activeDays: [],
          workingHours: { start: "", end: "" },
          doubleDial: false,
          personalization: false,
        },
        metadata: campaign.metadata || {},
      }))
      setCampaigns(sanitizedCampaigns)
    } catch (error) {
      console.error("Error loading campaigns:", error)
      toast.error("Failed to load campaigns")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "research_pending":
        return "bg-yellow-100 text-yellow-700"
      case "research_processing":
        return "bg-blue-100 text-blue-700"
      case "research_completed":
        return "bg-green-100 text-green-700"
      case "research_failed":
        return "bg-red-100 text-red-700"
      case "active":
        return "bg-purple-100 text-purple-700"
      case "paused":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "research_pending":
        return "Research Pending"
      case "research_processing":
        return "Researching Leads"
      case "research_completed":
        return "Research Complete"
      case "research_failed":
        return "Research Failed"
      case "active":
        return "Active"
      case "paused":
        return "Paused"
      default:
        return status
    }
  }

  const toggleOptions = (campaignId: string) => {
    setShowOptions(showOptions === campaignId ? null : campaignId)
  }

  const deleteCampaign = async () => {
    if (!campaignToDelete) return

    try {
      setDeleting(true)

      const response = await fetch(
        `https://sfktedqfipvuucelpggb.supabase.co/rest/v1/campaigns?id=eq.${campaignToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k",
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to delete campaign: ${response.status}`)
      }

      toast.success(`Campaign "${campaignToDelete.name}" deleted successfully`)
      setShowDeleteModal(false)
      setCampaignToDelete(null)
      setShowOptions(null)
      await loadCampaigns() // Refresh the list
    } catch (error) {
      console.error("Error deleting campaign:", error)
      toast.error("Failed to delete campaign")
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign)
    setShowDeleteModal(true)
    setShowOptions(null)
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Campaigns</h1>
            <Link
              href="/campaigns/new/select-type"
              className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground py-1.5 px-4 rounded text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </Link>
          </div>

          {/* Content Area */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Loading campaigns...</span>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Campaigns Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first campaign to start reaching out to prospects.
                </p>
                <Link
                  href="/campaigns/new/select-type"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Link>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="theme-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Target className="w-6 h-6 text-primary" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                            {getStatusText(campaign.status)}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                            {campaign.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {campaign.metadata?.total_leads || 0} leads
                              {campaign.metadata?.research_completed && (
                                <span className="text-green-600 ml-1">
                                  ({campaign.metadata.research_completed} researched)
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{campaign.settings.activeDays.length} active days</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {campaign.settings.workingHours.start} - {campaign.settings.workingHours.end}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                          <span>Channels:</span>
                          {Array.isArray(campaign.channels) ? (
                            campaign.channels.map((channel, index) => (
                              <span key={channel} className="capitalize">
                                {channel}
                                {index < campaign.channels.length - 1 ? ", " : ""}
                              </span>
                            ))
                          ) : (
                            <span>No channels</span>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground pt-1">
                          Created {new Date(campaign.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          onClick={() => toggleOptions(campaign.id)}
                          className="p-2 hover:bg-secondary rounded-full transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                        </button>

                        {showOptions === campaign.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-md shadow-lg z-10">
                            <div className="py-1">
                              <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                                <Edit className="w-4 h-4 mr-2 text-muted-foreground" />
                                Edit campaign
                              </button>
                              <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                                <Pause className="w-4 h-4 mr-2 text-muted-foreground" />
                                {campaign.status === "paused" ? "Resume" : "Pause"} campaign
                              </button>
                              <button
                                onClick={() => handleDeleteClick(campaign)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-secondary transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete campaign
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      {/* Delete Campaign Modal */}
      <ConfirmActionModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setCampaignToDelete(null)
        }}
        onConfirm={deleteCampaign}
        title="Delete Campaign"
        description={`Are you sure you want to delete "${campaignToDelete?.name}"? This action cannot be undone and will permanently remove the campaign and all associated data.`}
        confirmText="Delete Campaign"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}
