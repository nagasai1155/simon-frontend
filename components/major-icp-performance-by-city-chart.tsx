"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Info, Droplets, Shield } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ICPPerformanceData {
  city: string
  icpType: string
  performanceScore: number
  appointments: number
  totalLeads: number
}

interface MajorICPPerformanceByCityChartProps {
  data: ICPPerformanceData[]
  loading?: boolean
}

const ICP_ICONS = {
  "Flood Leak Detection and Prevention": Shield,
  "Water Conservation and Monitoring": Droplets,
}

const ICP_COLORS = {
  "Flood Leak Detection and Prevention": "#3b82f6", // Blue
  "Water Conservation and Monitoring": "#10b981", // Green
}

const ICP_DISPLAY_NAMES = {
  "Flood Leak Detection and Prevention": "Flood Leak Detection and Prevention",
  "Water Conservation and Monitoring": "Water Conservation and Monitoring",
}

export function MajorICPPerformanceByCityChart({ data, loading = false }: MajorICPPerformanceByCityChartProps) {
  const [animatedData, setAnimatedData] = useState<any[]>([])
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "Flood Leak Detection and Prevention",
    "Water Conservation and Monitoring"
  ])

  useEffect(() => {
    if (data && data.length > 0) {
      // Process data for multi-line chart
      const cities = [...new Set(data.map(item => item.city))].slice(0, 6) // Top 6 cities
      const icpTypes = [
        "Flood Leak Detection and Prevention",
        "Water Conservation and Monitoring"
      ]

      // Create a map for quick lookup
      const dataMap = new Map<string, ICPPerformanceData>()
      data.forEach(item => {
        const key = `${item.city}|${item.icpType}`
        dataMap.set(key, item)
      })

      // Transform data for chart
      const chartData = cities.map(city => {
        const cityData: any = { city }
        
        icpTypes.forEach(icpType => {
          const key = `${city}|${icpType}`
          const item = dataMap.get(key)
          cityData[icpType] = item ? item.performanceScore : 0
        })
        
        return cityData
      })

      // Only animate on initial load, not on updates
      if (animatedData.length === 0) {
        setAnimatedData([])
        const timer = setTimeout(() => {
          setAnimatedData(chartData)
        }, 300)
        return () => clearTimeout(timer)
      } else {
        // Just update the data without animation to prevent disappearing lines
        setAnimatedData(chartData)
      }
    }
  }, [data, animatedData.length])

  if (loading) {
    return (
      <Card className="w-full border-2 border-border bg-card shadow-xl">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="w-5 h-5 text-primary animate-pulse" />
            Major ICP Performance by City
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-96 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading ICP performance data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full border-2 border-border bg-card shadow-xl">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="w-5 h-5 text-primary" />
            Major ICP Performance by City
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-96 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No ICP performance data available</p>
              <p className="text-sm mt-2">Start engaging with leads to see ICP analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const icpTypes = [
    "Flood Leak Detection and Prevention",
    "Water Conservation and Monitoring"
  ]

  return (
    <Card className="w-full border-2 border-border bg-card shadow-xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="w-5 h-5 text-primary" />
            Major ICP Performance by City
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
                  <p><strong>Scoring:</strong></p>
                  <p>• Call Made: +1 point</p>
                  <p>• Email Sent: +1 point</p>
                  <p>• SMS Sent: +1 point</p>
                  <p><strong>Success Bonus:</strong></p>
                  <p>• Appointment Booked/Contacted: +2 points</p>
                  <p className="mt-2 text-muted-foreground">
                    Major ICPs are ranked by total performance score across all communication channels and successful outcomes.
                  </p>
                </div>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Legend */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {icpTypes.map((icpType) => {
            const color = ICP_COLORS[icpType as keyof typeof ICP_COLORS]
            const Icon = ICP_ICONS[icpType as keyof typeof ICP_ICONS]
            const displayName = ICP_DISPLAY_NAMES[icpType as keyof typeof ICP_DISPLAY_NAMES]
            const isSelected = selectedMetrics.includes(icpType)
            
            return (
              <div 
                key={icpType} 
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary/10 border-primary/30 shadow-md' 
                    : 'bg-muted/30 border-border/50 hover:bg-muted/50'
                }`}
                onClick={() => {
                  if (isSelected) {
                    setSelectedMetrics(prev => prev.filter(m => m !== icpType))
                  } else {
                    setSelectedMetrics(prev => [...prev, icpType])
                  }
                }}
              >
                <div 
                  className="p-2 rounded-lg text-white flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">
                    {displayName}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Multi-line Chart */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={animatedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <XAxis 
                dataKey="city" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => {
                  // Convert to Title Case
                  return value.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  ).join(' ')
                }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Performance Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
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
                              {entry.name}: <span className="font-semibold">{entry.value}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
              
              {icpTypes.map((icpType) => {
                const color = ICP_COLORS[icpType as keyof typeof ICP_COLORS]
                const isSelected = selectedMetrics.includes(icpType)
                
                if (!isSelected) return null
                
                return (
                  <Line
                    key={icpType}
                    type="monotone"
                    dataKey={icpType}
                    stroke={color}
                    strokeWidth={3}
                    dot={{ fill: color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                )
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
