"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Calendar, Phone, Mail, Users, TrendingUp, Target, Eye, Reply, PhoneCall, VoicemailIcon, MapPin, Building, Filter, Download, MessageSquare, Info, MousePointer, AlertTriangle, UserX, Link, DollarSign, UserCheck, MessageCircle } from "lucide-react"
import Sidebar from "@/components/sidebar"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts"
import EmptyDashboard from "@/components/empty-dashboard"
import { getDashboardMetrics, testDataFetching, type DashboardMetrics } from "@/app/actions/dashboard-metrics"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { ICPPerformanceMultilineChart } from "@/components/icp-performance-multiline-chart"
import { SubICPPerformanceChart } from "@/components/sub-icp-performance-chart"
import { MajorICPPerformanceCharts } from "@/components/major-icp-performance-charts"
import { MajorICPPerformanceByCityChart } from "@/components/major-icp-performance-by-city-chart"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { addDays, format, startOfDay, endOfDay } from "date-fns"

// Date range type
type DateRange = {
  from: Date
  to: Date
}

// Filter type
type FilterType = "today" | "week" | "month" | "quarter" | "year" | "custom"

// Instantly AI API response type
interface InstantlyAnalytics {
  clicks: number
  clickRate: number
  opens: number
  openRate: number
  replies: number
  replyRate: number
  bounces: number
  deliveries: number
  deliveryRate: number
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
        <p className="text-xs text-muted-foreground mt-5">
          Based on calls, emails, and SMS performance
        </p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const [hasData, setHasData] = useState(true)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [instantlyAnalytics, setInstantlyAnalytics] = useState<InstantlyAnalytics | null>(null)
  const [instantlyLoading, setInstantlyLoading] = useState(false)
  
  // Filter states
  const [filterType, setFilterType] = useState<FilterType>("custom")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  })

  // Get date range based on filter type
  const getDateRange = (type: FilterType): DateRange => {
    const today = new Date()
    switch (type) {
      case "today":
        return { from: today, to: today }
      case "week":
        return { from: addDays(today, -7), to: today }
      case "month":
        return { from: addDays(today, -30), to: today }
      case "quarter":
        return { from: addDays(today, -90), to: today }
      case "year":
        return { from: addDays(today, -365), to: today }
      case "custom":
        return { from: undefined, to: undefined }
      default:
        return { from: undefined, to: undefined }
    }
  }

  // Format date for Instantly API
  const formatDateForAPI = (date: Date): string => {
    return format(date, "yyyy/MM/dd")
  }

  // Fetch Instantly AI analytics
  const fetchInstantlyAnalytics = async (startDate: Date, endDate: Date) => {
    setInstantlyLoading(true)
    try {
      const startDateStr = formatDateForAPI(startDate)
      const endDateStr = formatDateForAPI(endDate)
      
      const response = await fetch(
        `/api/instantly-analytics?start_date=${startDateStr}&end_date=${endDateStr}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setInstantlyAnalytics(data)
      } else {
        console.log("Instantly API not configured yet")
      }
    } catch (error) {
      console.error("Error fetching Instantly analytics:", error)
    } finally {
      setInstantlyLoading(false)
    }
  }

  // Load dashboard metrics with real-time polling
  useEffect(() => {
    const loadMetrics = async (isInitialLoad = false) => {
      try {
        // Only show loading animation on initial load
        if (isInitialLoad) {
        setLoading(true)
        }
        
        // First test data fetching
        console.log("🧪 Testing data fetching...")
        await testDataFetching()
        
        const startDate = dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined
        const endDate = dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined
        const dashboardMetrics = await getDashboardMetrics(startDate, endDate)
        
        // Always update metrics immediately to prevent disappearing data
        setMetrics(dashboardMetrics)
        console.log("📊 Dashboard metrics updated:", dashboardMetrics)
        console.log("🔍 Key metrics check:", {
          totalCallsMade: dashboardMetrics.totalCallsMade,
          pickupRate: dashboardMetrics.pickupRate,
          appointmentBookingRate: dashboardMetrics.appointmentBookingRate,
          conversionRate: dashboardMetrics.conversionRate,
          emailsSent: dashboardMetrics.emailsSent,
          positiveResponseRate: dashboardMetrics.positiveResponseRate,
          smsSent: dashboardMetrics.smsSent,
          smsAppointmentsBooked: dashboardMetrics.smsAppointmentsBooked
        })
        console.log("🚨 DEBUGGING totalCallsMade:", {
          value: dashboardMetrics.totalCallsMade,
          type: typeof dashboardMetrics.totalCallsMade,
          isZero: dashboardMetrics.totalCallsMade === 0,
          isNull: dashboardMetrics.totalCallsMade === null,
          isUndefined: dashboardMetrics.totalCallsMade === undefined
        })
      } catch (error) {
        console.error("Error loading dashboard metrics:", error)
      } finally {
        // Only hide loading animation on initial load
        if (isInitialLoad) {
          setLoading(false)
        }
      }
    }

    // Initial load with loading animation
    loadMetrics(true)
    
    // Set up real-time polling every 1 second (without loading animation)
    const interval = setInterval(() => loadMetrics(false), 1000)
    
    return () => clearInterval(interval)
  }, [dateRange])

  // Handle filter changes without triggering loading animation
  useEffect(() => {
    const newDateRange = getDateRange(filterType)
    setDateRange(newDateRange)
    
    // Only fetch Instantly data if we have valid dates
    if (newDateRange.from && newDateRange.to) {
      // Only fetch Instantly data if range is more than 24 hours or custom
      const timeDiff = newDateRange.to.getTime() - newDateRange.from.getTime()
      const hoursDiff = timeDiff / (1000 * 3600)
      
      if (hoursDiff > 24 || filterType === "custom") {
        fetchInstantlyAnalytics(newDateRange.from, newDateRange.to)
      } else {
        setInstantlyAnalytics(null)
      }
    } else {
      setInstantlyAnalytics(null)
    }
    
    // Trigger data refresh without loading animation
    const refreshData = async () => {
      try {
        const startDate = newDateRange.from ? newDateRange.from.toISOString().split('T')[0] : undefined
        const endDate = newDateRange.to ? newDateRange.to.toISOString().split('T')[0] : undefined
        const dashboardMetrics = await getDashboardMetrics(startDate, endDate)
        setMetrics(dashboardMetrics)
        console.log("📊 Dashboard metrics updated after filter change:", dashboardMetrics)
        console.log("🚨 FILTER CHANGE DEBUG totalCallsMade:", {
          value: dashboardMetrics.totalCallsMade,
          type: typeof dashboardMetrics.totalCallsMade,
          isZero: dashboardMetrics.totalCallsMade === 0
        })
      } catch (error) {
        console.error("Error refreshing dashboard metrics:", error)
      }
    }
    
    refreshData()
  }, [filterType])

  // Handle custom date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range)
      setFilterType("custom")
      fetchInstantlyAnalytics(range.from, range.to)
    }
  }

  // Calculate rates using correct property names from DashboardMetrics
  const pickupRate = metrics ? metrics.pickupRate : 0
  const appointmentBookingRate = metrics ? metrics.appointmentBookingRate : 0
  const conversionRate = metrics ? metrics.conversionRate : 0
  const positiveResponseRate = metrics ? metrics.positiveResponseRate : 0
  const clickThroughRate = metrics ? metrics.clickThroughRate : 0
  
  // Additional Instantly AI email metrics
  const bouncedCount = metrics ? metrics.bouncedCount : 0
  const bouncedRate = metrics ? metrics.bouncedRate : 0
  const unsubscribedCount = metrics ? metrics.unsubscribedCount : 0
  const unsubscribedRate = metrics ? metrics.unsubscribedRate : 0
  const linkClickedRate = metrics ? metrics.linkClickedRate : 0
  const totalOpportunities = metrics ? metrics.totalOpportunities : 0
  const totalLeadsInCampaigns = metrics ? metrics.totalLeadsInCampaigns : 0
  const totalContactedCount = metrics ? metrics.totalContactedCount : 0
  const totalOpenedCount = metrics ? metrics.totalOpenedCount : 0
  const totalReplyCount = metrics ? metrics.totalReplyCount : 0
  
  // SMS performance metrics
  const smsAppointmentRate = metrics ? metrics.smsAppointmentRate : 0
  const smsPerformanceScore = metrics ? metrics.smsPerformanceScore : 0
  
  // ICP Performance data
  const icpPerformanceData = metrics ? metrics.icpPerformanceData : []
  const topICPs = metrics ? metrics.topICPs : []
  const topSubICPs = metrics ? metrics.topSubICPs : []

  // Function to export all dashboard data as CSV
  const exportDataAsCSV = () => {
    if (!metrics) {
      console.log("No data to export")
      return
    }

    // Prepare CSV data
    const csvData = [
      // Header row
      ["Metric Category", "Metric Name", "Value", "Unit"],
      
      // Calling Metrics
      ["Calling Metrics", "Total Calls Made", metrics.totalCallsMade, "calls"],
      ["Calling Metrics", "Total Calls Picked Up", metrics.totalCallsPickedUp, "calls"],
      ["Calling Metrics", "Total Appointments Booked", metrics.totalAppointmentsBooked, "appointments"],
      ["Calling Metrics", "Pickup Rate", metrics.pickupRate, "%"],
      ["Calling Metrics", "Appointment Booking Rate", metrics.appointmentBookingRate, "%"],
      ["Calling Metrics", "Conversion Rate", metrics.conversionRate, "%"],
      
      // Email Metrics
      ["Email Metrics", "Emails Sent", metrics.emailsSent, "emails"],
      ["Email Metrics", "Emails Opened", metrics.opened, "emails"],
      ["Email Metrics", "Emails Replied", metrics.replied, "emails"],
      ["Email Metrics", "Email Appointments Booked", metrics.appointmentsBookedEmails, "appointments"],
      ["Email Metrics", "Positive Response Rate", metrics.positiveResponseRate, "%"],
      ["Email Metrics", "Click Through Rate", metrics.clickThroughRate, "clicks"],
      ["Email Metrics", "Bounced Count", metrics.bouncedCount, "emails"],
      ["Email Metrics", "Bounced Rate", metrics.bouncedRate, "%"],
      ["Email Metrics", "Unsubscribed Count", metrics.unsubscribedCount, "emails"],
      ["Email Metrics", "Unsubscribed Rate", metrics.unsubscribedRate, "%"],
      ["Email Metrics", "Link Clicked Rate", metrics.linkClickedRate, "%"],
      ["Email Metrics", "Total Opportunities", metrics.totalOpportunities, "opportunities"],
      ["Email Metrics", "Total Leads in Campaigns", metrics.totalLeadsInCampaigns, "leads"],
      ["Email Metrics", "Total Contacted Count", metrics.totalContactedCount, "contacts"],
      ["Email Metrics", "Total Opened Count", metrics.totalOpenedCount, "opens"],
      ["Email Metrics", "Total Reply Count", metrics.totalReplyCount, "replies"],
      
      // SMS Metrics
      ["SMS Metrics", "Messages Sent", metrics.smsSent, "messages"],
      ["SMS Metrics", "SMS Appointments Booked", metrics.smsAppointmentsBooked, "appointments"],
      ["SMS Metrics", "SMS Delivery Rate", metrics.smsDeliveryRate, "%"],
      ["SMS Metrics", "SMS Appointment Rate", metrics.smsAppointmentRate, "%"],
      ["SMS Metrics", "SMS Performance Score", metrics.smsPerformanceScore, "score"],
      
      // Overall Metrics
      ["Overall", "Total Campaigns", metrics.totalCampaigns, "campaigns"],
      ["Overall", "Active Channels", metrics.activeChannels, "channels"],
      ["Overall", "Prospects Contacted", metrics.prospectsContacted, "prospects"],
      ["Overall", "Response Rate", metrics.responseRate, "%"],
      
      // Top Performing Cities
      ...(metrics.topCities?.map((city, index) => [
        "Top Performing Cities",
        `${index + 1}. ${city.name}`,
        city.appointments,
        "performance score"
      ]) || []),
      
      // Top Performing Industries
      ...(metrics.topIndustries?.map((industry, index) => [
        "Top Performing Industries",
        `${index + 1}. ${industry.name}`,
        industry.appointments,
        "leads"
      ]) || []),
      
      // Top Performing ICPs
      ...(metrics.topICPs?.map((icp, index) => [
        "Top Performing ICPs",
        `${index + 1}. ${icp.name}`,
        icp.appointments,
        "appointments"
      ]) || []),
      
      // Region-wise Performance
      ...(metrics.regionWiseData?.map((region, index) => [
        "Region-wise Performance",
        `${index + 1}. ${region.name}`,
        region.totalCalls + region.emailsSent + region.smsSent,
        "total activities"
      ]) || [])
    ]

    // Convert to CSV string
    const csvString = csvData.map(row => 
      row.map(field => `"${field}"`).join(",")
    ).join("\n")

    // Create and download file
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log("📊 CSV export completed")
  }

  // Use real data from metrics or fallback to sample data
  const topCitiesData = metrics?.topCities && metrics.topCities.length > 0 
    ? metrics.topCities 
    : [
        { name: "New York", appointments: 45 },
        { name: "Los Angeles", appointments: 38 },
        { name: "Chicago", appointments: 32 },
        { name: "Houston", appointments: 28 },
        { name: "Phoenix", appointments: 25 }
      ]

  const topIndustriesData = metrics?.topIndustries && metrics.topIndustries.length > 0 
    ? metrics.topIndustries 
    : [
        { name: "Technology", appointments: 52 },
        { name: "Healthcare", appointments: 41 },
        { name: "Finance", appointments: 38 },
        { name: "Manufacturing", appointments: 29 },
        { name: "Retail", appointments: 24 }
      ]

  const regionData = metrics?.regionWiseData && metrics.regionWiseData.length > 0 
    ? metrics.regionWiseData 
    : [
        { name: "North", callPickup: 35, emailOpen: 28, emailReply: 12 },
        { name: "South", callPickup: 42, emailOpen: 31, emailReply: 15 },
        { name: "East", callPickup: 38, emailOpen: 29, emailReply: 13 },
        { name: "West", callPickup: 45, emailOpen: 33, emailReply: 16 }
      ]

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 pt-12 px-6 pb-6 overflow-auto page-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-12">
            <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Real-time analytics and performance metrics</p>
            </div>
            
            {/* Filter Controls - Industry Grade Layout */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Filter:</span>
                </div>
                <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 days</SelectItem>
                    <SelectItem value="month">Last 30 days</SelectItem>
                    <SelectItem value="quarter">Last 90 days</SelectItem>
                    <SelectItem value="year">Last year</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {filterType === "custom" && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <DatePickerWithRange
                    date={dateRange}
                    onDateChange={handleDateRangeChange}
                  />
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-3"
                onClick={exportDataAsCSV}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              
            </div>
          </div>

          {hasData ? (
            <>
              {/* Calling Metrics */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Calling Metrics
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <MetricCard 
                  title="Total Calls Made" 
                  value={loading ? "..." : (metrics?.totalCallsMade || 0).toLocaleString()} 
                  icon={<Phone className="w-4 h-4" />} 
                  loading={loading}
                />
                <MetricCard 
                  title="Pickup Rate" 
                  value={loading ? "..." : `${(metrics?.pickupRate || 0).toFixed(1)}%`} 
                  icon={<PhoneCall className="w-4 h-4" />} 
                  loading={loading}
                />
                <MetricCard 
                  title="Appointment Booking Rate" 
                  value={loading ? "..." : `${(metrics?.appointmentBookingRate || 0).toFixed(1)}%`} 
                  icon={<Calendar className="w-4 h-4" />} 
                  loading={loading}
                />
                <MetricCard 
                  title="Conversion Rate" 
                  value={loading ? "..." : `${(metrics?.conversionRate || 0).toFixed(1)}%`} 
                  icon={<TrendingUp className="w-4 h-4" />} 
                  loading={loading}
                />
                </div>
              </div>

              {/* Email Metrics */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <MetricCard
                  title="Emails Sent" 
                  value={loading ? "..." : (metrics?.emailsSent || 0).toLocaleString()} 
                  icon={<Mail className="w-4 h-4" />} 
                  loading={loading}
                  />
                  <MetricCard
                  title="Positive Response Rate" 
                  value={loading ? "..." : `${(metrics?.positiveResponseRate || 0).toFixed(1)}%`} 
                  icon={<Reply className="w-4 h-4" />} 
                  loading={loading}
                  />
                  <MetricCard
                  title="Click Through Rate" 
                  value={loading ? "..." : (clickThroughRate || 0).toLocaleString()} 
                  icon={<MousePointer className="w-4 h-4" />} 
                  loading={loading}
                  />
                  <MetricCard
                  title="Bounced Count" 
                  value={loading ? "..." : (bouncedCount || 0).toLocaleString()} 
                  icon={<AlertTriangle className="w-4 h-4" />} 
                  loading={loading}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <MetricCard
                  title="Bounced Rate" 
                  value={loading ? "..." : `${(bouncedRate || 0).toFixed(1)}%`} 
                  icon={<AlertTriangle className="w-4 h-4" />} 
                  loading={loading}
                  />
                  <MetricCard
                  title="Unsubscribed Count" 
                  value={loading ? "..." : (unsubscribedCount || 0).toLocaleString()} 
                  icon={<UserX className="w-4 h-4" />} 
                  loading={loading}
                  />
                  <MetricCard
                  title="Unsubscribed Rate" 
                  value={loading ? "..." : `${(unsubscribedRate || 0).toFixed(1)}%`} 
                  icon={<UserX className="w-4 h-4" />} 
                  loading={loading}
                  />
                  <MetricCard
                  title="Link Clicked Rate" 
                  value={loading ? "..." : `${(linkClickedRate || 0).toFixed(1)}%`} 
                  icon={<Link className="w-4 h-4" />} 
                  loading={loading}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <MetricCard
                  title="Total Opportunities" 
                  value={loading ? "..." : (totalOpportunities || 0).toLocaleString()} 
                  icon={<DollarSign className="w-4 h-4" />} 
                  loading={loading}
                  />
                  <MetricCard
                  title="Total Leads in Campaigns" 
                  value={loading ? "..." : (totalLeadsInCampaigns || 0).toLocaleString()} 
                  icon={<Users className="w-4 h-4" />} 
                  loading={loading}
                  />
                  <MetricCard
                  title="Total Contacted Count" 
                  value={loading ? "..." : (totalContactedCount || 0).toLocaleString()} 
                  icon={<UserCheck className="w-4 h-4" />} 
                  loading={loading}
                  />
                  <MetricCard
                  title="Total Opened Count" 
                  value={loading ? "..." : (totalOpenedCount || 0).toLocaleString()} 
                  icon={<Eye className="w-4 h-4" />} 
                  loading={loading}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <MetricCard
                  title="Total Reply Count" 
                  value={loading ? "..." : (totalReplyCount || 0).toLocaleString()} 
                  icon={<MessageCircle className="w-4 h-4" />} 
                  loading={loading}
                  />
                </div>
              </div>

              {/* SMS Metrics */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  SMS Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  <MetricCard
                  title="Messages Sent" 
                  value={loading ? "..." : (metrics?.smsSent || 0).toLocaleString()} 
                  icon={<MessageSquare className="w-4 h-4" />} 
                  loading={loading}
                  />
                  <MetricCard 
                  title="SMS Appointments Booked" 
                  value={loading ? "..." : (metrics?.smsAppointmentsBooked || 0).toLocaleString()} 
                  icon={<Calendar className="w-4 h-4" />} 
                  loading={loading}
                  />
                  <MetricCard
                  title="SMS Appointment Rate" 
                  value={loading ? "..." : `${(smsAppointmentRate || 0).toFixed(1)}%`} 
                  icon={<TrendingUp className="w-4 h-4" />} 
                  loading={loading}
                  />
                </div>
              </div>

              {/* Major ICP Performance Charts */}
              <div className="mb-6">
                <MajorICPPerformanceCharts 
                  data={topICPs} 
                  loading={loading}
                />
              </div>

              {/* Sub-ICP Performance Chart */}
              <div className="mb-6">
                <SubICPPerformanceChart 
                  data={topSubICPs} 
                  loading={loading}
                />
              </div>

              {/* ICP Performance by City */}
              <div className="mb-6">
                <MajorICPPerformanceByCityChart 
                  data={icpPerformanceData} 
                  loading={loading}
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Top Performing Cities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Top Performing Cities
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm p-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm">Performance Score Calculation</h4>
                              <div className="text-xs space-y-1">
                                <p><strong>Base Points:</strong></p>
                                <p>• Call Made: +1 point</p>
                                <p>• Email Sent: +1 point</p>
                                <p>• SMS Sent: +1 point</p>
                                <p><strong>Success Bonus:</strong></p>
                                <p>• Appointment Booked/Contacted: +2 points</p>
                                <p className="mt-5 text-muted-foreground">
                                  Cities are ranked by total performance score across all communication channels and successful outcomes.
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topCitiesData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <XAxis
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={0}
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                          label={{ value: 'Performance Score', angle: -90, position: 'insideLeft' }}
                      />
                      <RechartsTooltip
                          content={<CustomTooltip />}
                          formatter={(value: any) => [`${value}`, 'Performance Score']}
                        />
                        <Bar 
                          dataKey="appointments" 
                          fill="#3b82f6" 
                          name="Performance Score"
                          radius={[4, 4, 0, 0]}
                          isAnimationActive={false}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top Performing Industries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Top Performing Industries
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm p-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm">Industry Performance Calculation</h4>
                              <div className="text-xs space-y-1">
                                <p><strong>Performance Score:</strong></p>
                                <p>• Booked Appointment: +1 point</p>
                                <p>• Contacted Lead: +1 point</p>
                                <p><strong>Ranking:</strong></p>
                                <p>Industries are ranked by total number of successful appointments and contacts across all communication channels.</p>
                                <p className="mt-5 text-muted-foreground">
                                  Higher scores indicate better industry performance and conversion rates.
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={topIndustriesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="appointments"
                          isAnimationActive={false}
                        >
                          {topIndustriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              const total = topIndustriesData.reduce((sum, item) => sum + item.appointments, 0)
                              const percentage = total > 0 ? ((data.appointments / total) * 100).toFixed(1) : 0
                              return (
                                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                                  <p className="font-semibold text-foreground">
                                    {data.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Appointments: {data.appointments}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Percentage: {percentage}%
                                  </p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value, entry) => {
                            const data = topIndustriesData.find(item => item.name === value)
                            const total = topIndustriesData.reduce((sum, item) => sum + item.appointments, 0)
                            const percentage = total > 0 ? ((data?.appointments || 0) / total * 100).toFixed(1) : 0
                            return `${value} (${percentage}%)`
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* ICP Performance by Channels */}
              <div className="mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      ICP Performance by Channels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={topICPs} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                        <XAxis 
                          dataKey="name" 
                          angle={0}
                          textAnchor="middle"
                          height={80}
                          interval={0}
                          tick={{ fontSize: 12, fill: 'white', fontWeight: 'bold' }}
                          tickFormatter={(value) => {
                            // Convert to Title Case
                            return value.split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            ).join(' ')
                          }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                          label={{ value: 'Appointment Rate (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                        />
                        <RechartsTooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
                                  <p className="font-semibold text-foreground mb-3">
                                    {label.split(' ').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                    ).join(' ')}
                                  </p>
                                  {payload.map((entry: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2 mb-1">
                                      <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: entry.color }}
                                      ></div>
                                      <span className="text-sm text-foreground">
                                        {entry.name === 'emailAppointmentRate' ? 'Email Appointment Rate' : 
                                         entry.name === 'callAppointmentRate' ? 'Call Appointment Rate' : 
                                         entry.name === 'smsAppointmentRate' ? 'SMS Appointment Rate' : entry.name}: 
                                        <span className="font-semibold ml-1">
                                          {entry.value}%
                                        </span>
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="emailAppointmentRate" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                          name="emailAppointmentRate"
                          isAnimationActive={true}
                          animationDuration={1500}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="callAppointmentRate" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                          name="callAppointmentRate"
                          isAnimationActive={true}
                          animationDuration={1500}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="smsAppointmentRate" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#f59e0b', strokeWidth: 2, fill: 'white' }}
                          name="smsAppointmentRate"
                          isAnimationActive={true}
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Region-wise Performance */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Region-wise Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={regionData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar dataKey="callPickup" fill="#3b82f6" name="Call Pickup Rate %" isAnimationActive={false} />
                      <Bar dataKey="emailOpen" fill="#10b981" name="Email Open Rate %" isAnimationActive={false} />
                      <Bar dataKey="emailReply" fill="#f59e0b" name="Email Reply Rate %" isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

            </>
          ) : (
            <EmptyDashboard onGetStarted={() => setHasData(true)} />
          )}
        </div>
      </main>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  icon?: React.ReactNode
  variant?: "primary" | "secondary"
  loading?: boolean
}

function MetricCard({ title, value, icon, variant = "primary", loading = false }: MetricCardProps) {
  return (
    <div
      className={`${variant === "primary" ? "bg-card" : "bg-card/80"} border border-border rounded-lg p-3 shadow-sm transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-muted-foreground">{title}</span>
        {icon && (
          <div className={`p-1 bg-secondary rounded-md ${loading ? "animate-pulse" : ""}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className={`${loading ? "animate-pulse bg-muted rounded p-1 text-xs text-muted-foreground font-normal" : "text-xl font-bold"} mb-1`}>
          {loading ? "Updating..." : value}
        </div>
      </div>
    </div>
  )
}