"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, Info, Building2, Home, Users, Zap } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SubICPData {
  name: string
  appointments: number
  performanceScore: number
  emailAppointmentRate: number
  callAppointmentRate: number
  smsAppointmentRate: number
}

interface SubICPPerformanceChartProps {
  data: SubICPData[]
  loading?: boolean
}

const SUB_ICP_ICONS = {
  "NEW CONSTRUCTION & DEVELOPMENTS": Building2,
  "MULTI-UNIT RESIDENTIAL RETROFITS": Home,
  "HOSPITALITY & COMMERCIAL": Users,
  "SENIOR LIVING COMMUNITIES": Building2,
}

const SUB_ICP_COLORS = {
  "NEW CONSTRUCTION & DEVELOPMENTS": "#3b82f6", // Blue
  "MULTI-UNIT RESIDENTIAL RETROFITS": "#10b981", // Green
  "HOSPITALITY & COMMERCIAL": "#8b5cf6", // Purple
  "SENIOR LIVING COMMUNITIES": "#f59e0b", // Orange
}

const SUB_ICP_DISPLAY_NAMES = {
  "NEW CONSTRUCTION & DEVELOPMENTS": "New Construction & Developments",
  "MULTI-UNIT RESIDENTIAL RETROFITS": "Multi-Unit Residential Retrofits",
  "HOSPITALITY & COMMERCIAL": "Hospitality & Commercial",
  "SENIOR LIVING COMMUNITIES": "Senior Living Communities",
}

export function SubICPPerformanceChart({ data, loading = false }: SubICPPerformanceChartProps) {
  const [animatedData, setAnimatedData] = useState<any[]>([])

  useEffect(() => {
    if (data && data.length > 0) {
      // Process data for multi-bar chart
      const processedData = data.map((item, index) => ({
        ...item,
        displayName: SUB_ICP_DISPLAY_NAMES[item.name as keyof typeof SUB_ICP_DISPLAY_NAMES] || item.name,
        color: SUB_ICP_COLORS[item.name as keyof typeof SUB_ICP_COLORS] || "#6b7280",
        animationDelay: index * 100
      }))

      // Animate data appearance
      setTimeout(() => {
        setAnimatedData(processedData)
      }, 200)
    } else {
      setAnimatedData([])
    }
  }, [data])

  if (loading) {
    return (
      <Card className="w-full border-2 border-border bg-card shadow-xl overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="w-5 h-5 text-primary animate-pulse" />
            Sub-ICP Performance by Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading sub-ICP performance data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full border-2 border-border bg-card shadow-xl overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="w-5 h-5 text-primary" />
            Sub-ICP Performance by Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No sub-ICP performance data available</p>
              <p className="text-sm mt-2">Start engaging with leads to see sub-ICP analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border-2 border-border bg-card shadow-xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="w-5 h-5 text-primary" />
            Sub-ICP Performance by Channels
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-2">
                  <p className="font-semibold">Sub-ICP Performance Metrics</p>
                  <p><strong>Performance Score:</strong> Based on engagement and outcomes</p>
                  <p><strong>Channel Rates:</strong> Appointment booking rates per channel</p>
                  <p><strong>Scoring:</strong></p>
                  <p>• Call Made: +1 point</p>
                  <p>• Email Sent: +1 point</p>
                  <p>• SMS Sent: +1 point</p>
                  <p><strong>Success Bonus:</strong></p>
                  <p>• Appointment Booked/Contacted: +2 points</p>
                  <p className="mt-2 text-muted-foreground">
                    Sub-ICPs are ranked by total performance score across all communication channels and successful outcomes.
                  </p>
                </div>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={animatedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
              <XAxis 
                dataKey="displayName" 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tickFormatter={(value) => {
                  // Truncate long names to prevent overlap
                  if (value.length > 15) {
                    return value.substring(0, 12) + "..."
                  }
                  return value
                }}
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
                labelFormatter={(label) => `Sub-ICP: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="emailAppointmentRate" 
                name="Email Appointment Rate" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <Bar 
                dataKey="callAppointmentRate" 
                name="Call Appointment Rate" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Bar 
                dataKey="smsAppointmentRate" 
                name="SMS Appointment Rate" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
                animationDuration={1400}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Performance Score Display */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {animatedData.map((item, index) => {
            const IconComponent = SUB_ICP_ICONS[item.name as keyof typeof SUB_ICP_ICONS] || Building2
            return (
              <div
                key={item.name}
                className="bg-gradient-to-br from-background to-muted/20 border border-border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                style={{
                  animationDelay: `${item.animationDelay}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <IconComponent className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.displayName}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Performance Score:</span>
                    <span className="font-semibold text-foreground">{item.performanceScore}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Appointments:</span>
                    <span className="font-semibold text-foreground">{item.appointments}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
