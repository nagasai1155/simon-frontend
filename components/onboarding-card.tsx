import type { ReactNode } from "react"

interface OnboardingCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function OnboardingCard({ icon, title, description }: OnboardingCardProps) {
  return (
    <div className="border border-[#222222] rounded-xl p-6 hover:border-[#333333] transition-colors">
      <div className="bg-[#1a1a1a] w-12 h-12 rounded-md flex items-center justify-center mb-6">
        <span className="text-gray-300">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
