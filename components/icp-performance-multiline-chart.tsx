"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, MapPin, Building2, Users, Home, Info } from "lucide-react"
import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ICPPerformanceData {
  city: string;
  icpType: string;
  performanceScore: number;
  appointments: number;
  totalLeads: number;
}

interface ICPPerformanceMultilineChartProps {
  data: ICPPerformanceData[];
  loading?: boolean;
}

const ICP_ICONS = {
  "Flood Leak Detection and Prevention": Building2,
  "Water Conservation and Monitoring": Users,
}

const ICP_COLORS = {
  "Flood Leak Detection and Prevention": "#3b82f6", // Blue
  "Water Conservation and Monitoring": "#10b981", // Green
}

const ICP_DISPLAY_NAMES = {
  "Flood Leak Detection and Prevention": "Flood Leak Detection and Prevention",
  "Water Conservation and Monitoring": "Water Conservation and Monitoring",
}

export function ICPPerformanceMultilineChart({ data, loading = false }: ICPPerformanceMultilineChartProps) {
  const [animatedData, setAnimatedData] = useState<any[]>([])
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "Flood Leak Detection and Prevention",
    "Water Conservation and Monitoring"
  ])

  useEffect(() => {
    if (data && data.length > 0) {
      // Process data for multi-line chart with channels on X-axis
      const channels = ["Email", "Call", "SMS"]
      const icpTypes = [
        "Flood Leak Detection and Prevention",
        "Water Conservation and Monitoring"
      ]

      // Transform data for chart - channels on X-axis
      const chartData = channels.map(channel => {
        const channelData: any = { channel }
        
        icpTypes.forEach(icpType => {
          // Calculate average performance score across all cities for this ICP type
          const icpData = data.filter(item => item.icpType === icpType)
          if (icpData.length > 0) {
            const avgScore = icpData.reduce((sum, item) => sum + item.performanceScore, 0) / icpData.length
            channelData[icpType] = Math.round(avgScore * 10) / 10 // Round to 1 decimal
          } else {
            channelData[icpType] = 0
          }
        })
        
        return channelData
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
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="w-5 h-5 text-primary" />
            ICP Performance Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div className="text-muted-foreground">Loading ICP performance data...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full border-2 border-border bg-card shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="w-5 h-5 text-primary" />
            ICP Performance Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="text-muted-foreground">No ICP performance data available</div>
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
            ICP Performance by Channels
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
                    <p className="mt-2 text-muted-foreground">
                      Shows performance scores for each major ICP across different communication channels.
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* ICP Type Legend with Toggle */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {icpTypes.map((icpType) => {
              const Icon = ICP_ICONS[icpType as keyof typeof ICP_ICONS]
              const color = ICP_COLORS[icpType as keyof typeof ICP_COLORS]
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
                    <div className="text-xs font-medium text-foreground truncate">
                      {displayName.split(' ')[0]}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {displayName.split(' ').slice(1).join(' ')}
                    </div>
                  </div>
                  <div 
                    className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                      isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                    }`}
                  />
                </div>
              )
            })}
          </div>

          {/* Multi-line Chart */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={animatedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="channel" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
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
                            Channel: {label}
                          </p>
                          {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 mb-1">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                              ></div>
                              <span className="text-sm text-foreground">
                                {ICP_DISPLAY_NAMES[entry.dataKey as keyof typeof ICP_DISPLAY_NAMES]}: 
                                <span className="font-semibold ml-1">
                                  {entry.value} score
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
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => ICP_DISPLAY_NAMES[value as keyof typeof ICP_DISPLAY_NAMES]}
                />
                
                {selectedMetrics.map((icpType) => (
                  <Line
                    key={icpType}
                    type="monotone"
                    dataKey={icpType}
                    stroke={ICP_COLORS[icpType as keyof typeof ICP_COLORS]}
                    strokeWidth={3}
                    dot={{ 
                      fill: ICP_COLORS[icpType as keyof typeof ICP_COLORS], 
                      strokeWidth: 2, 
                      r: 6 
                    }}
                    activeDot={{ 
                      r: 8, 
                      stroke: ICP_COLORS[icpType as keyof typeof ICP_COLORS], 
                      strokeWidth: 2, 
                      fill: 'white' 
                    }}
                    name={icpType}
                    isAnimationActive={true}
                    animationDuration={1500}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
