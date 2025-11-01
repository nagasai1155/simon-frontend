"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Check, Trash2, ExternalLink, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CalComModal } from "@/components/cal-com-modal"

interface ConnectedCalendar {
  id: string
  name: string
  email: string
  type: "cal.com" | "google" | "outlook"
  connectedAt: string
  status: "active" | "error"
  nickname?: string
}

interface CalComData {
  nickname: string
  apiKey: string
  eventId: string
  timeZone: string
}

export default function IntegrationsPage() {
  const { toast } = useToast()
  const [isCalComModalOpen, setIsCalComModalOpen] = useState(false)
  const [connectedCalendars, setConnectedCalendars] = useState<ConnectedCalendar[]>([
    {
      id: "1",
      name: "Cal.com",
      email: "john@example.com",
      type: "cal.com",
      connectedAt: "2024-01-15",
      status: "active",
      nickname: "Main Calendar",
    },
  ])

  const handleCalComConnect = (data: CalComData) => {
    const newCalendar: ConnectedCalendar = {
      id: Date.now().toString(),
      name: "Cal.com",
      email: "Connected via API",
      type: "cal.com",
      connectedAt: new Date().toISOString().split("T")[0],
      status: "active",
      nickname: data.nickname || "Cal.com Calendar",
    }

    setConnectedCalendars([...connectedCalendars, newCalendar])
    toast({
      title: "Cal.com Connected",
      description: `Successfully connected ${data.nickname || "Cal.com"} calendar`,
    })
  }

  const handleDisconnect = (calendarId: string, calendarName: string) => {
    setConnectedCalendars(connectedCalendars.filter((cal) => cal.id !== calendarId))
    toast({
      title: "Integration Disconnected",
      description: `${calendarName} has been disconnected`,
      variant: "destructive",
    })
  }

  const getCalendarIcon = (type: string) => {
    switch (type) {
      case "cal.com":
        return (
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Cal</span>
          </div>
        )
      case "google":
        return (
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
        )
      case "outlook":
        return (
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">O</span>
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
        )
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Integrations</h1>
        <p className="text-muted-foreground">Connect your favorite tools and services to enhance your workflow</p>
      </div>

      {/* Available Integrations */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            Calendar Integrations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Cal.com */}
            <Card className="hover:shadow-md transition-all duration-200 border-border">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-lg">Cal</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base">Cal.com</h3>
                    <p className="text-xs text-muted-foreground">Open source scheduling platform</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setIsCalComModalOpen(true)}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Connected Calendars */}
      {connectedCalendars.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Connected Calendars</h2>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              {connectedCalendars.length} Connected
            </Badge>
          </div>

          <div className="space-y-3">
            {connectedCalendars.map((calendar) => (
              <Card key={calendar.id} className="hover:shadow-sm transition-all duration-200 border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {getCalendarIcon(calendar.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{calendar.nickname || calendar.name}</h4>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              calendar.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            {calendar.status === "active" ? "Active" : "Error"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{calendar.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Connected on {new Date(calendar.connectedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" className="h-8">
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        Manage
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(calendar.id, calendar.nickname || calendar.name)}
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {connectedCalendars.length === 0 && (
        <Card className="border-dashed border-border">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No calendars connected</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Connect your first calendar integration to get started
            </p>
            <Button onClick={() => setIsCalComModalOpen(true)} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Connect Calendar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cal.com Modal */}
      <CalComModal
        isOpen={isCalComModalOpen}
        onClose={() => setIsCalComModalOpen(false)}
        onConnect={handleCalComConnect}
      />
    </div>
  )
}
