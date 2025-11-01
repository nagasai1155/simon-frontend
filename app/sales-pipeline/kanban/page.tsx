"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, ArrowLeft, Users, CheckCircle, Mail, Clock, CalendarRange } from "lucide-react"
import Sidebar from "@/components/sidebar"
import KanbanBoard from "@/components/kanban-board"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { getLeads } from "@/app/actions/sales-pipeline"

export default function KanbanView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load leads data
  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true)
        const leadsData = await getLeads()
        setLeads(leadsData)
      } catch (error) {
        console.error("Error loading leads:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLeads()
  }, [])

  // Calculate real stats from leads data
  const totalLeads = leads.length
  const bookedLeads = leads.filter(lead => lead.status === "booked").length
  const repliedLeads = leads.filter(lead => lead.status === "replied").length
  const replyRate = totalLeads > 0 ? Math.round((repliedLeads / totalLeads) * 100) : 0
  const conversionRate = totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 0

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header with Stats */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <Link href="/sales-pipeline">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
                    <p className="text-muted-foreground mt-1">Kanban view - Drag and drop to manage your pipeline</p>
                  </div>
                </div>
                <Button size="lg" className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-4">
                  <Plus className="w-5 h-5" />
                  <span>Add Lead</span>
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                        <p className="text-2xl font-bold">{loading ? "Loading..." : totalLeads}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Booked Leads</p>
                        <p className="text-2xl font-bold">{loading ? "Loading..." : bookedLeads}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                        <Mail className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Reply Rate</p>
                        <p className="text-2xl font-bold">{loading ? "Loading..." : `${replyRate}%`}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                        <p className="text-2xl font-bold">{loading ? "Loading..." : `${conversionRate}%`}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* View Switcher */}
              <Tabs value="kanban" className="w-full md:w-auto">
                <TabsList className="grid w-full grid-cols-2 md:w-auto">
                  <TabsTrigger value="grid" asChild className="px-4 py-2">
                    <Link href="/sales-pipeline" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                      Grid View
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="kanban" className="flex items-center gap-2 px-4 py-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                      />
                    </svg>
                    Kanban
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Date Range Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 min-w-[180px] justify-start">
                      <CalendarRange className="w-4 h-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <span>
                            {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                          </span>
                        ) : (
                          <span>{format(dateRange.from, "MMM d, yyyy")}</span>
                        )
                      ) : (
                        <span>Date Range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                      initialFocus
                    />
                    <div className="flex items-center justify-between p-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateRange({ from: undefined, to: undefined })}
                      >
                        Clear
                      </Button>
                      <Button size="sm" onClick={() => console.log("Applied date range:", dateRange)}>
                        Apply
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button variant="outline" className="flex items-center gap-2 md:ml-0">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Kanban Board */}
            <Card>
              <CardContent className="p-4">
                <KanbanBoard
                  onTaskClick={(task) => {
                    console.log("Task clicked:", task)
                    // Here you would open a modal or navigate to a detail page
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
