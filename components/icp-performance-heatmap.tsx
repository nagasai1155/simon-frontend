"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, MapPin, Building2, Users, Home } from "lucide-react"
import { useState, useEffect } from "react"

interface ICPPerformanceData {
  city: string;
  icpType: string;
  performanceScore: number;
  appointments: number;
  totalLeads: number;
}

interface ICPPerformanceHeatmapProps {
  data: ICPPerformanceData[];
  loading?: boolean;
}

const ICP_ICONS = {
  "NEW CONSTRUCTION & DEVELOPMENTS": Building2,
  "MULTI-UNIT RESIDENTIAL RETROFITS": Home,
  "HOSPITALITY & COMMERCIAL": Users,
  "SENIOR LIVING COMMUNITIES": Building2,
}

const ICP_COLORS = {
  "NEW CONSTRUCTION & DEVELOPMENTS": "from-blue-500 to-blue-700",
  "MULTI-UNIT RESIDENTIAL RETROFITS": "from-green-500 to-green-700", 
  "HOSPITALITY & COMMERCIAL": "from-purple-500 to-purple-700",
  "SENIOR LIVING COMMUNITIES": "from-orange-500 to-orange-700",
}

export function ICPPerformanceHeatmap({ data, loading = false }: ICPPerformanceHeatmapProps) {
  const [animatedData, setAnimatedData] = useState<ICPPerformanceData[]>([])
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  useEffect(() => {
    if (data && data.length > 0) {
      // Animate data appearance
      setAnimatedData([])
      const timer = setTimeout(() => {
        setAnimatedData(data)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [data])

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

  // Get unique cities and ICP types
  const cities = [...new Set(animatedData.map(item => item.city))].slice(0, 6) // Top 6 cities
  const icpTypes = [
    "NEW CONSTRUCTION & DEVELOPMENTS",
    "MULTI-UNIT RESIDENTIAL RETROFITS", 
    "HOSPITALITY & COMMERCIAL",
    "SENIOR LIVING COMMUNITIES"
  ]

  // Create a map for quick lookup
  const dataMap = new Map<string, ICPPerformanceData>()
  animatedData.forEach(item => {
    const key = `${item.city}|${item.icpType}`
    dataMap.set(key, item)
  })

  // Calculate min and max performance scores for scaling
  const scores = animatedData.map(item => item.performanceScore)
  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)
  const scoreRange = maxScore - minScore

  // Function to get performance level
  const getPerformanceLevel = (score: number) => {
    if (scoreRange === 0) return "low"
    const normalized = (score - minScore) / scoreRange
    if (normalized >= 0.7) return "high"
    if (normalized >= 0.4) return "medium"
    return "low"
  }

  // Function to get size based on performance
  const getSize = (score: number) => {
    if (scoreRange === 0) return "w-16 h-16"
    const normalized = (score - minScore) / scoreRange
    if (normalized >= 0.7) return "w-20 h-20"
    if (normalized >= 0.4) return "w-18 h-18"
    return "w-14 h-14"
  }

  return (
    <Card className="w-full border-2 border-border bg-card shadow-xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <TrendingUp className="w-5 h-5 text-primary" />
          ICP Performance Matrix
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Interactive performance visualization by city and ICP type
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* ICP Type Legend */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {icpTypes.map((icpType) => {
              const Icon = ICP_ICONS[icpType as keyof typeof ICP_ICONS]
              const colorClass = ICP_COLORS[icpType as keyof typeof ICP_COLORS]
              return (
                <div key={icpType} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass} text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">
                      {icpType.split(' ')[0]}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {icpType.split(' ').slice(1).join(' ')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Performance Matrix */}
          <div className="space-y-4">
            {cities.map((city, cityIndex) => (
              <div 
                key={city} 
                className="group"
                style={{ animationDelay: `${cityIndex * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground truncate">{city}</span>
                  </div>
                  <div className="flex gap-2">
                    {icpTypes.map((icpType) => {
                      const key = `${city}|${icpType}`
                      const item = dataMap.get(key)
                      
                      if (!item || item.performanceScore === 0) {
                        return (
                          <div 
                            key={icpType} 
                            className="w-16 h-16 bg-muted/20 rounded-xl border border-border/30 flex items-center justify-center opacity-50"
                          >
                            <span className="text-xs text-muted-foreground">-</span>
                          </div>
                        )
                      }

                      const Icon = ICP_ICONS[icpType as keyof typeof ICP_ICONS]
                      const colorClass = ICP_COLORS[icpType as keyof typeof ICP_COLORS]
                      const performanceLevel = getPerformanceLevel(item.performanceScore)
                      const sizeClass = getSize(item.performanceScore)
                      
                      return (
                        <div
                          key={icpType}
                          className={`${sizeClass} bg-gradient-to-br ${colorClass} rounded-xl border-2 border-white/20 flex flex-col items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer group-hover:opacity-80 hover:!opacity-100 relative overflow-hidden`}
                          onClick={() => setSelectedCity(selectedCity === city ? null : city)}
                          title={`${city} - ${icpType}\nPerformance Score: ${item.performanceScore}\nAppointments: ${item.appointments}\nTotal Leads: ${item.totalLeads}`}
                        >
                          {/* Animated background pulse */}
                          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                          
                          {/* Content */}
                          <div className="relative z-10 flex flex-col items-center justify-center">
                            <Icon className="w-4 h-4 mb-1" />
                            <span className="text-xs font-bold">{item.performanceScore}</span>
                            <span className="text-xs opacity-80">{item.appointments}A</span>
                          </div>
                          
                          {/* Performance indicator */}
                          <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                            performanceLevel === 'high' ? 'bg-green-400' :
                            performanceLevel === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* City details (expandable) */}
                {selectedCity === city && (
                  <div className="ml-6 p-4 bg-muted/20 rounded-lg border border-border/30 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {icpTypes.map((icpType) => {
                        const key = `${city}|${icpType}`
                        const item = dataMap.get(key)
                        if (!item) return null
                        
                        return (
                          <div key={icpType} className="p-3 bg-background/50 rounded-lg border border-border/20">
                            <div className="text-xs font-medium text-foreground mb-2">
                              {icpType.split(' ')[0]}
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div>Score: <span className="text-foreground font-medium">{item.performanceScore}</span></div>
                              <div>Appointments: <span className="text-foreground font-medium">{item.appointments}</span></div>
                              <div>Total Leads: <span className="text-foreground font-medium">{item.totalLeads}</span></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Performance Legend */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Performance Scale:</span> Score | A = Appointments
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
