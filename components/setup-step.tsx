"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Check, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"

interface ActionItem {
  icon: ReactNode
  title: string
  description: string
  href: string
  onClick?: () => void
}

interface SetupStepProps {
  id?: string
  number: number
  title: string
  description: string
  isActive: boolean
  isCompleted: boolean
  isExpanded: boolean
  onToggle: () => void
  actions: ActionItem[]
}

export default function SetupStep({
  id,
  number,
  title,
  description,
  isActive,
  isCompleted,
  isExpanded,
  onToggle,
  actions,
}: SetupStepProps) {
  return (
    <div
      id={id}
      className={`rounded-md border ${
        isExpanded
          ? "border-primary shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
          : isActive
            ? "border-border"
            : "border-border/50"
      } overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "transform translate-y-0" : ""}`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className={`w-full p-3.5 flex items-start justify-between ${
          isExpanded ? "bg-secondary" : isActive ? "bg-secondary/50" : "bg-card"
        } text-left transition-colors duration-200 hover:bg-opacity-90 focus:outline-none focus:ring-1 focus:ring-primary/25 focus:ring-inset`}
      >
        <div className="flex items-start gap-3">
          {/* Number or Check */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 
            transition-all duration-300 ease-in-out ${
              isCompleted ? "bg-green-600" : isActive ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {isCompleted ? (
              <Check className="w-4 h-4 animate-fadeIn" />
            ) : (
              <span className="text-sm font-semibold">{number}</span>
            )}
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="text-[15px] font-semibold mb-0.5">{title}</h3>
            <p className="text-muted-foreground text-[13px]">{description}</p>
          </div>
        </div>

        {/* Toggle Icon */}
        <div
          className={`text-muted-foreground mt-1 transition-transform duration-200 ${isExpanded ? "rotate-0" : "rotate-180"}`}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Actions */}
      {isExpanded && (
        <div className="bg-card border-t border-border animate-fadeIn">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              onClick={
                action.onClick
                  ? (e) => {
                      e.preventDefault()
                      action.onClick()
                    }
                  : undefined
              }
              className="flex items-center justify-between p-3.5 hover:bg-secondary/50 border-b border-border last:border-b-0 
                transition-all duration-150 group hover:pl-4 focus:outline-none focus:bg-secondary/50 focus:pl-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 bg-muted rounded flex items-center justify-center flex-shrink-0 
                  transition-colors duration-200 group-hover:bg-muted/80"
                >
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    {action.icon}
                  </span>
                </div>
                <div>
                  <h4 className="text-[13px] font-medium mb-0.5 group-hover:text-foreground transition-colors duration-200">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-200">
                    {action.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground transform transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
