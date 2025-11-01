"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Info, Droplets, Shield } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MajorICPData {
  name: string
  appointments: number
  performanceScore: number
  emailAppointmentRate: number
  callAppointmentRate: number
  smsAppointmentRate: number
}

interface MajorICPPerformanceChartsProps {
  data: MajorICPData[]
  loading?: boolean
}

const MAJOR_ICP_ICONS = {
  "Flood Leak Detection and Prevention": Shield,
  "Water Conservation and Monitoring": Droplets,
}

const MAJOR_ICP_COLORS = {
  "Flood Leak Detection and Prevention": "#3b82f6", // Blue
  "Water Conservation and Monitoring": "#10b981", // Green
}

const MAJOR_ICP_DISPLAY_NAMES = {
  "Flood Leak Detection and Prevention": "Flood Leak Detection & Prevention",
  "Water Conservation and Monitoring": "Water Conservation & Monitoring",
}

export function MajorICPPerformanceCharts({ data, loading = false }: MajorICPPerformanceChartsProps) {
  const [animatedData, setAnimatedData] = useState<any[]>([])

  useEffect(() => {
    if (data && data.length > 0) {
      // Process data for charts
      const processedData = data.map((item, index) => ({
        ...item,
        displayName: MAJOR_ICP_DISPLAY_NAMES[item.name as keyof typeof MAJOR_ICP_DISPLAY_NAMES] || item.name,
        color: MAJOR_ICP_COLORS[item.name as keyof typeof MAJOR_ICP_COLORS] || "#6b7280",
        animationDelay: index * 200
      }))

      // Animate data appearance
      setTimeout(() => {
        setAnimatedData(processedData)
      }, 300)
    } else {
      setAnimatedData([])
    }
  }, [data])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="w-full border-2 border-border bg-card shadow-xl overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="w-5 h-5 text-primary animate-pulse" />
              Major ICP Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading major ICP data...</div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full border-2 border-border bg-card shadow-xl overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="w-5 h-5 text-primary animate-pulse" />
              Major ICP Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading distribution data...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="w-full border-2 border-border bg-card shadow-xl overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="w-5 h-5 text-primary" />
              Major ICP Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No major ICP performance data available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full border-2 border-border bg-card shadow-xl overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="w-5 h-5 text-primary" />
              Major ICP Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Droplets className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No distribution data available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }


  return (
    <div className="w-full">
      {/* Performance Bar Chart */}
      <Card className="w-full border-2 border-border bg-card shadow-xl overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="w-5 h-5 text-primary" />
              Major ICP Performance
            </div>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-semibold">Major ICP Performance Metrics</p>
                    <p><strong>Performance Score:</strong> Based on engagement and outcomes</p>
                    <p><strong>Channel Rates:</strong> Appointment booking rates per channel</p>
                    <p><strong>Scoring:</strong></p>
                    <p>• Call Made: +1 point</p>
                    <p>• Email Sent: +1 point</p>
                    <p>• SMS Sent: +1 point</p>
                    <p><strong>Success Bonus:</strong></p>
                    <p>• Appointment Booked/Contacted: +2 points</p>
                  </div>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pb-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={animatedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                <XAxis 
                  dataKey="displayName" 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'performanceScore') {
                      return [value, 'Performance Score']
                    }
                    return [`${value}%`, name]
                  }}
                  labelFormatter={(label) => `Major ICP: ${label}`}
                />
                <Bar 
                  dataKey="emailAppointmentRate" 
                  name="Email Rate" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Bar 
                  dataKey="callAppointmentRate" 
                  name="Call Rate" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
                <Bar 
                  dataKey="smsAppointmentRate" 
                  name="SMS Rate" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1400}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
