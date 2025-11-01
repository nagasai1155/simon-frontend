"use client"

import Link from "next/link"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Users, SettingsIcon, LogOut, ChevronRight, AlertTriangle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SettingsPopupProps {
  isOpen: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement>
}

export function SettingsPopup({ isOpen, onClose, anchorRef }: SettingsPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [placement, setPlacement] = useState<"right" | "left" | "top">("right")
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false)

  // Calculate optimal position based on viewport and anchor element
  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const calculatePosition = () => {
        if (!anchorRef.current || !popupRef.current) return

        const anchorRect = anchorRef.current.getBoundingClientRect()
        const popupRect = popupRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // Default placement is to the right of the sidebar
        let newPlacement: "right" | "left" | "top" = "right"
        let top = anchorRect.top
        let left = anchorRect.right + 10 // 10px gap

        // Check if popup would go off the right edge
        if (left + popupRect.width > viewportWidth - 20) {
          // Try left placement
          left = anchorRect.left - popupRect.width - 10
          newPlacement = "left"

          // If left placement also doesn't work, try top placement
          if (left < 20) {
            top = anchorRect.top - popupRect.height - 10
            left = anchorRect.left
            newPlacement = "top"

            // If that still doesn't work, revert to right but adjust to fit
            if (top < 20) {
              top = 20
              left = Math.min(anchorRect.right + 10, viewportWidth - popupRect.width - 20)
              newPlacement = "right"
            }
          }
        }

        // Ensure popup doesn't go off the bottom of the screen
        if (top + popupRect.height > viewportHeight - 20) {
          top = Math.max(20, viewportHeight - popupRect.height - 20)
        }

        // Ensure popup doesn't go off the top of the screen
        top = Math.max(20, top)

        setPosition({ top, left })
        setPlacement(newPlacement)
      }

      // Initial calculation
      setTimeout(calculatePosition, 0)

      // Recalculate on resize
      window.addEventListener("resize", calculatePosition)
      return () => window.removeEventListener("resize", calculatePosition)
    }
  }, [isOpen, anchorRef])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose, anchorRef])

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showSignOutConfirmation) {
          setShowSignOutConfirmation(false)
        } else {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose, showSignOutConfirmation])

  if (!isOpen) return null

  // Animation variants based on placement
  const animationVariants = {
    right: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -10 },
    },
    left: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 10 },
    },
    top: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 10 },
    },
  }

  // Create menu item with proper hover styles
  const MenuItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <Link
        href={href}
        className="flex items-center gap-3 p-2 rounded-lg transition-colors text-sm"
        onClick={onClose}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered ? "#27272B" : "transparent",
          color: isHovered ? "white" : "inherit",
        }}
      >
        <span className={`${isHovered ? "text-white" : "text-muted-foreground"}`}>{icon}</span>
        <span>{label}</span>
        <ChevronRight size={14} className={`ml-auto ${isHovered ? "text-white" : "text-muted-foreground"}`} />
      </Link>
    )
  }

  const handleSignOut = () => {
    // Implement actual sign out logic here
    console.log("User signed out")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popupRef}
          className="fixed z-[100] bg-background border border-border rounded-xl shadow-lg w-[320px] overflow-hidden"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            maxHeight: "calc(100vh - 40px)",
            overflowY: "auto",
          }}
          initial={animationVariants[placement].initial}
          animate={animationVariants[placement].animate}
          exit={animationVariants[placement].exit}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Settings Section */}
          <div className="py-2 px-3">
            <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide px-2">Settings</h3>
            <div className="space-y-1">
              <MenuItem href="/settings/members" icon={<Users size={16} />} label="Team Members" />

              <MenuItem href="/settings/integrations" icon={<SettingsIcon size={16} />} label="Integrations" />

              <MenuItem href="/settings" icon={<SettingsIcon size={16} />} label="General Settings" />
            </div>
          </div>

          {/* Sign Out */}
          <div className="p-3 border-t border-border">
            <button
              className="flex items-center gap-3 p-2 rounded-lg w-full text-left text-red-500 hover:bg-red-500/10 transition-colors text-sm"
              onClick={() => setShowSignOutConfirmation(true)}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Sign Out Confirmation Modal */}
          <AnimatePresence>
            {showSignOutConfirmation && (
              <motion.div
                className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col justify-center items-center p-4 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="bg-background border border-border rounded-lg shadow-lg p-4 w-full max-w-[280px]">
                  <div className="flex items-start mb-3">
                    <div className="flex-shrink-0 mr-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">Sign out confirmation</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Are you sure you want to sign out of your account?
                      </p>
                    </div>
                    <button
                      className="flex-shrink-0 ml-1 p-1 rounded-md hover:bg-accent/50"
                      onClick={() => setShowSignOutConfirmation(false)}
                    >
                      <X size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-accent/50 transition-colors"
                      onClick={() => setShowSignOutConfirmation(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
