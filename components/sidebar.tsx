"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"

import { BarChart3, ChevronRight, MessageCircle, TrendingUp, ChevronLeft, Home, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={`h-full bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))] flex flex-col transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-56 ml-6"
        }`}
      >
        {/* Logo Section */}
        <div className={`flex items-center ${isCollapsed ? "justify-center px-3" : "justify-between pl-3 pr-5"} mt-1 pt-7 pb-4 relative`}>
          {isCollapsed ? (
            <div className="w-full flex justify-center items-center">
              <div className="flex-shrink-0 relative flex items-center justify-center w-10 h-10">
                <Image
                  src="/favicon.png"
                  alt="Connected Sensors Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 relative flex items-center justify-center w-10 h-10">
                  <Image
                    src="/favicon.png"
                    alt="Connected Sensors Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-base font-bold text-foreground leading-tight block truncate">
                    Connected Sensors
                  </span>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-md hover:bg-[hsl(var(--sidebar-hover-bg))] transition-colors flex-shrink-0 ml-2"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            </>
          )}
        </div>


        {/* Navigation */}
        <div className="flex-1 overflow-y-auto pt-4">
          {/* Main Section */}
          <div className="mb-6">
            {!isCollapsed && (
              <p className="text-xs text-muted-foreground mb-4 px-3 font-semibold uppercase tracking-wider">MAIN</p>
            )}
            <nav className="space-y-3">
              <SidebarNavItem
                href="/"
                icon={<Home className="w-4 h-4" />}
                label="Home"
                active={pathname === "/"}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                href="/dashboard"
                icon={<BarChart3 className="w-4 h-4" />}
                label="Dashboard"
                active={pathname === "/dashboard"}
                isCollapsed={isCollapsed}
              />
            </nav>
          </div>

          {/* Sales Section */}
          <div className="mb-6">
            {!isCollapsed && (
              <p className="text-xs text-muted-foreground mb-4 px-3 font-semibold uppercase tracking-wider">SALES</p>
            )}
            <nav className="space-y-3">
              <SidebarNavItem
                href="/sales-pipeline"
                icon={<TrendingUp className="w-4 h-4" />}
                label="Sales Pipeline"
                active={pathname === "/sales-pipeline" || pathname.startsWith("/sales-pipeline/")}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                href="/conversations"
                icon={<MessageCircle className="w-4 h-4" />}
                label="Conversations"
                active={pathname === "/conversations"}
                isCollapsed={isCollapsed}
              />
            </nav>
          </div>

          {/* Settings Section */}
          <div className="mb-6">
            {!isCollapsed && (
              <p className="text-xs text-muted-foreground mb-4 px-3 font-semibold uppercase tracking-wider">SETTINGS</p>
            )}
            <nav className="space-y-3">
              <SidebarNavItem
                href="/settings"
                icon={<Settings className="w-4 h-4" />}
                label="Settings"
                active={pathname === "/settings" || pathname.startsWith("/settings/")}
                isCollapsed={isCollapsed}
              />
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-[hsl(var(--sidebar-hover-bg))] transition-colors w-full flex items-center justify-center"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="w-full flex justify-center">
                <ThemeToggle />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

interface SidebarNavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
  isCollapsed?: boolean
}

function SidebarNavItem({ href, icon, label, active = false, isCollapsed = false }: SidebarNavItemProps) {
  const content = (
    <Link
      href={href}
      prefetch={true}
      scroll={true}
      className={`flex items-center ${isCollapsed ? "justify-center px-2" : "justify-between px-5"} py-3 rounded-md transition-all duration-200 ease-in-out ${
        active
          ? "bg-[hsl(var(--sidebar-active-bg))] text-[hsl(var(--sidebar-active-fg))]"
          : "text-muted-foreground hover:bg-[hsl(var(--sidebar-hover-bg))] hover:text-foreground"
      }`}
    >
      <div className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-3"}`}>
        <span className={`transition-colors duration-200 ${active ? "text-[hsl(var(--sidebar-active-fg))]" : "text-muted-foreground"}`}>{icon}</span>
        {!isCollapsed && <span className="text-sm">{label}</span>}
      </div>
      {!isCollapsed && active && <ChevronRight className="w-3.5 h-3.5 text-[hsl(var(--sidebar-active-fg))]" />}
    </Link>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}
