"use client"

import type React from "react"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Settings, Users, Puzzle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const getActiveTab = () => {
    if (pathname === "/settings/general") return "general"
    if (pathname === "/settings/members") return "members"
    if (pathname === "/settings/integrations") return "integrations"
    return "general"
  }

  const activeTab = getActiveTab()

  const handleTabChange = (value: string) => {
    if (value === "general") router.push("/settings/general")
    if (value === "members") router.push("/settings/members")
    if (value === "integrations") router.push("/settings/integrations")
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header with Back Button and Segmented Control */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                prefetch={true}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
              
              {/* Segmented Control - Pill Shaped - Right Corner */}
              <div className="inline-flex items-center bg-muted/50 p-1 rounded-full shadow-sm">
                <button
                  onClick={() => handleTabChange("general")}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap",
                    activeTab === "general"
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Settings className="w-4 h-4" />
                  General Settings
                </button>
                
                <button
                  onClick={() => handleTabChange("members")}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap",
                    activeTab === "members"
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Users className="w-4 h-4" />
                  Members
                </button>
                
                <button
                  onClick={() => handleTabChange("integrations")}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap",
                    activeTab === "integrations"
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Puzzle className="w-4 h-4" />
                  Integrations
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-fade-in">{children}</div>
      </div>
    </div>
  )
}
