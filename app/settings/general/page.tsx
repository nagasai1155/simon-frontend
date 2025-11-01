"use client"

import { useState } from "react"
import { Settings, Moon, Sun } from "lucide-react"
import ThemeSelectorModal from "@/components/theme-selector-modal"
import { useTheme } from "@/components/theme-provider"

export default function GeneralSettingsPage() {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
  const { theme } = useTheme()

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-4 h-4 text-[hsl(var(--apple-yellow))]" />
      case "dark":
        return <Moon className="w-4 h-4 text-[hsl(var(--apple-blue))]" />
      default:
        return <Sun className="w-4 h-4 text-[hsl(var(--apple-yellow))]" />
    }
  }

  const getThemeName = () => {
    switch (theme) {
      case "light":
        return "Light"
      case "dark":
        return "Dark"
      default:
        return "Light"
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-5 h-5 text-muted-foreground" />
        <h1 className="text-2xl font-bold">General Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="theme-card p-5 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Account Settings</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Organization Name</label>
                <input
                  type="text"
                  defaultValue="Blackvolution"
                  className="w-full min-w-[300px] bg-background border border-input rounded-lg py-2 px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time Zone</label>
                <select className="w-full min-w-[300px] bg-background border border-input rounded-lg py-2 px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  <option>(UTC-08:00) Pacific Time</option>
                  <option>(UTC-05:00) Eastern Time</option>
                  <option>(UTC+00:00) UTC</option>
                  <option>(UTC+01:00) Central European Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="theme-card p-5 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>

          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="w-full flex items-center justify-between p-3 bg-background hover:bg-secondary/50 border border-input rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">{getThemeIcon()}</div>
              <div>
                <div className="text-sm font-medium">Theme</div>
                <div className="text-xs text-muted-foreground">{getThemeName()}</div>
              </div>
            </div>
            <div className="text-xs text-[hsl(var(--apple-blue))]">Change</div>
          </button>
        </div>

        {/* Security Settings */}
        <div className="theme-card p-5 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Security Settings</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter your current password"
                  className="w-full min-w-[300px] min-w-[350px] bg-background border border-input rounded-lg py-2 px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full min-w-[300px] min-w-[350px] bg-background border border-input rounded-lg py-2 px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full min-w-[300px] min-w-[350px] bg-background border border-input rounded-lg py-2 px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Theme Selector Modal */}
      <ThemeSelectorModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
    </div>
  )
}
