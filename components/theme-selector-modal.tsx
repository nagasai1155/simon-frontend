"use client"
import { X, Moon, Sun, Check } from "lucide-react"
import { useTheme } from "./theme-provider"

interface ThemeSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ThemeSelectorModal({ isOpen, onClose }: ThemeSelectorModalProps) {
  const { theme, setTheme } = useTheme()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-card border border-border rounded-xl w-full max-w-md shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Options */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground mb-2">Choose how Connected Sensors looks to you</p>

          <div className="grid grid-cols-1 gap-3">
            {/* Light Theme Option */}
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center p-3 rounded-lg border ${
                theme === "light"
                  ? "border-[hsl(var(--apple-blue))] bg-[hsl(var(--apple-blue))]/5"
                  : "border-border hover:bg-secondary/50"
              } transition-all`}
            >
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--apple-gray-100))] flex items-center justify-center mr-3 border border-[hsl(var(--apple-gray-200))]">
                <Sun className="w-5 h-5 text-[hsl(var(--apple-gray-700))]" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-foreground">Light</div>
                <div className="text-xs text-muted-foreground">Light background with dark text</div>
              </div>
              {theme === "light" && (
                <div className="w-5 h-5 rounded-full bg-[#016AFF] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>

            {/* Dark Theme Option */}
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center p-3 rounded-lg border ${
                theme === "dark"
                  ? "border-[hsl(var(--apple-blue))] bg-[hsl(var(--apple-blue))]/5"
                  : "border-border hover:bg-secondary/50"
              } transition-all`}
            >
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--apple-gray-800))] flex items-center justify-center mr-3 border border-[hsl(var(--apple-gray-700))]">
                <Moon className="w-5 h-5 text-[hsl(var(--apple-gray-300))]" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-foreground">Dark</div>
                <div className="text-xs text-muted-foreground">Dark background with light text</div>
              </div>
              {theme === "dark" && (
                <div className="w-5 h-5 rounded-full bg-[#016AFF] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-border bg-card">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
