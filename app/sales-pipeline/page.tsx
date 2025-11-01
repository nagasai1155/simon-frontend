"use client"

import { useState, useMemo, useEffect } from "react"
import { Mail, Clock, CalendarRange, Bot, X, RefreshCw, Search } from "lucide-react"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { FadeIn, SlideUp } from "@/components/ui/motion"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getLeads, getCampaignName, type Lead } from "@/app/actions/sales-pipeline"
import LeadDetailModal from "@/components/lead-detail-modal"

const statusConfig = {
  new: {
    label: "New",
    color: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-800",
  },
  contacted: {
    label: "Contacted",
    color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800",
  },
  replied: {
    label: "Replied",
    color:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800",
  },
  booked: {
    label: "Booked",
    color:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
  },
  "followed-up": {
    label: "Followed Up",
    color:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800",
  },
}

export default function SalesPipeline() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [campaignNames, setCampaignNames] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  // Load leads from database
  const loadLeads = async (showToast = true) => {
    try {
      console.log("🔄 Loading leads from database...")
      const fetchedLeads = await getLeads()
      console.log("✅ Fetched leads:", fetchedLeads.length)

      setLeads(fetchedLeads)

      // Load campaign names for each unique campaign ID
      const uniqueCampaignIds = Array.from(new Set(fetchedLeads.map((lead) => lead.campaign_id).filter(Boolean)))
      const campaignNamePromises = uniqueCampaignIds.map(async (id) => {
        const name = await getCampaignName(id!)
        return { id, name }
      })

      const campaignResults = await Promise.all(campaignNamePromises)
      const campaignMap = campaignResults.reduce(
        (acc, { id, name }) => {
          acc[id] = name
          return acc
        },
        {} as Record<string, string>,
      )

      setCampaignNames(campaignMap)

      if (showToast) {
        toast({
          title: "Sales pipeline loaded",
          description: `Loaded ${fetchedLeads.length} leads from database`,
          variant: "success",
        })
      }
    } catch (error) {
      console.error("💥 Error loading leads:", error)
      toast({
        title: "Error loading leads",
        description: "Failed to load leads from database. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load leads on component mount
  useEffect(() => {
    loadLeads()
  }, [])

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead: Lead) => {
      // Search filter - searches across all fields
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        lead.contact_name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.company_name.toLowerCase().includes(searchLower) ||
        (lead.phone && lead.phone.includes(searchQuery)) ||
        lead.status.toLowerCase().includes(searchLower) ||
        new Date(lead.updated_at).toLocaleDateString().includes(searchQuery)

      // Date range filter - FIXED: Now works with single dates and proper date comparison
      const leadDate = new Date(lead.updated_at)
      let matchesDateRange = true
      
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from)
        fromDate.setHours(0, 0, 0, 0) // Start of day
        matchesDateRange = leadDate >= fromDate
      }
      
      if (dateRange.to && matchesDateRange) {
        const toDate = new Date(dateRange.to)
        toDate.setHours(23, 59, 59, 999) // End of day
        matchesDateRange = leadDate <= toDate
      }

      return matchesSearch && matchesDateRange
    })
  }, [leads, searchQuery, dateRange])

  const clearAllFilters = () => {
    setSearchQuery("")
    setDateRange({ from: undefined, to: undefined })

    toast({
      title: "Filters cleared",
      description: "All filters have been reset to default values.",
      variant: "info",
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadLeads()
  }

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedLead(null)
  }

  const hasActiveFilters = searchQuery || dateRange.from || dateRange.to

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sales pipeline...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-auto page-fade-in">
          <div className="pt-12 px-4 pb-4 sm:pt-12 sm:px-6 sm:pb-6">
            <div className="max-w-[1400px] mx-auto space-y-6">
              {/* Header */}
              <SlideUp className="space-y-6 mb-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
                  <div className="w-full lg:w-auto">
                    <div className="flex items-center gap-4 mb-3">
                      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Sales Pipeline</h1>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Monitor and manage your real leads from the database
                    </p>
                    
                    {/* Search Bar and Date Range - 20px below description, in same row */}
                    <div className="mt-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                      <div className="relative w-full max-w-[600px]">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                          placeholder="Search leads by name, email, phone, company, status, or date..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-12 py-3 text-lg bg-background border-border focus:border-primary w-full min-w-[400px]"
                    />
                  </div>

                    
                        </div>
                  </div>
                </div>
              </SlideUp>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <FadeIn className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {searchQuery && (
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary">
                        Search: "{searchQuery}"
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {dateRange.from && (
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary">
                      Date: {format(dateRange.from, "MMM d")} - {dateRange.to ? format(dateRange.to, "MMM d") : "..."}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => setDateRange({ from: undefined, to: undefined })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">
                    Clear all
                  </Button>
                </FadeIn>
              )}

              {/* Table View */}
              <SlideUp delay={0.3}>
                <Card className="border-border bg-card hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        Lead Pipeline
                      </CardTitle>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="w-fit">
                        {filteredLeads.length} {filteredLeads.length === 1 ? "lead" : "leads"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {filteredLeads.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                          <Bot className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No leads found</h3>
                        <p className="text-muted-foreground mb-4">
                          {hasActiveFilters
                            ? "Try adjusting your search query or date range filter"
                            : "No leads in your database yet. Create some campaigns to generate leads."}
                        </p>
                        {hasActiveFilters && (
                          <Button variant="outline" onClick={clearAllFilters}>
                            Clear all filters
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b bg-muted/20">
                            <tr>
                              <th className="text-left p-4 font-medium">Company</th>
                              <th className="text-left p-4 font-medium">Contact</th>
                              <th className="text-left p-4 font-medium">Status</th>
                              <th className="text-left p-4 font-medium">Last Modified</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredLeads.map((lead: Lead) => (
                              <tr 
                                key={lead.id} 
                                className="border-b hover:bg-muted/10 transition-colors cursor-pointer"
                                onClick={() => handleLeadClick(lead)}
                              >
                                <td className="p-4">
                                  <div className="font-medium">{lead.company_name}</div>
                                </td>
                                <td className="p-4">
                                  <div className="space-y-1">
                                    <div className="font-medium">{lead.contact_name}</div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {lead.email}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{lead.phone}</div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge
                                    variant="outline"
                                    className={
                                      statusConfig[lead.status as keyof typeof statusConfig]?.color ||
                                      statusConfig.new.color
                                    }
                                  >
                                    {statusConfig[lead.status as keyof typeof statusConfig]?.label || lead.status}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(lead.updated_at).toLocaleDateString()}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </SlideUp>
            </div>
          </div>
        </main>
      </div>
      
      {/* Lead Detail Modal */}
      <LeadDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        lead={selectedLead}
      />
    </TooltipProvider>
  )
}
