"use client"

import type React from "react"

import { BarChart3, ArrowRight, Megaphone, Users, Mail, Calendar } from "lucide-react"

interface EmptyDashboardProps {
  onGetStarted: () => void
}

export default function EmptyDashboard({ onGetStarted }: EmptyDashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-8">
        <BarChart3 className="w-10 h-10 text-muted-foreground" />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your dashboard is empty</h2>
      <p className="text-muted-foreground max-w-md mb-10">
        Complete the setup process to start tracking your campaign performance and see your metrics here.
      </p>

      <button
        onClick={onGetStarted}
        className="flex items-center gap-2 bg-[#635AFE] hover:bg-[#5048E5] text-white py-2.5 px-5 rounded-lg text-sm font-medium transition-colors mb-16 shadow-sm"
      >
        <span>Get Started</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        <StepCard
          number={1}
          title="Create a Campaign"
          description="Set up your first outreach campaign"
          icon={<Megaphone className="w-6 h-6" />}
        />
        <StepCard
          number={2}
          title="Add Prospects"
          description="Import or add contacts to reach out to"
          icon={<Users className="w-6 h-6" />}
        />
        <StepCard
          number={3}
          title="Send Messages"
          description="Start your email or SMS outreach"
          icon={<Mail className="w-6 h-6" />}
        />
        <StepCard
          number={4}
          title="Book Meetings"
          description="Convert prospects into appointments"
          icon={<Calendar className="w-6 h-6" />}
        />
      </div>
    </div>
  )
}

interface StepCardProps {
  number: number
  title: string
  description: string
  icon: React.ReactNode
}

function StepCard({ number, title, description, icon }: StepCardProps) {
  return (
    <div className="theme-card p-5 flex flex-col items-center text-center h-full">
      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">{icon}</div>
      <div className="inline-block px-2.5 py-1 bg-secondary rounded-full text-xs font-medium mb-3">Step {number}</div>
      <h3 className="text-base font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
