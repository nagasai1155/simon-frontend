"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Monitor theme changes
  useEffect(() => {
    if (mounted) {
      console.log("Current theme:", theme)
      console.log("Resolved theme:", resolvedTheme)
      console.log("HTML classList:", document.documentElement.classList.toString())
    }
  }, [theme, resolvedTheme, mounted])

  const toggleTheme = () => {
    const currentTheme = theme || resolvedTheme || "dark"
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    console.log("Theme toggle clicked - current:", currentTheme, "switching to:", newTheme)
    setTheme(newTheme)
    
    // Force apply the class immediately
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-md transition-colors hover:bg-secondary"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </button>
    )
  }

  const currentTheme = theme || resolvedTheme || "dark"

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md transition-colors hover:bg-secondary"
      aria-label="Toggle theme"
      type="button"
    >
      {currentTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </button>
  )
}
