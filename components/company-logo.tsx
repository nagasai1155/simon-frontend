import type { FC } from "react"

interface CompanyLogoProps {
  name: string
  className?: string
}

export const CompanyLogo: FC<CompanyLogoProps> = ({ name, className = "" }) => {
  // Generate a color based on the company name
  const generateColor = (name: string) => {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    const hue = hash % 360
    return `hsl(${hue}, 65%, 55%)`
  }

  // Get initials from company name
  const getInitials = (name: string) => {
    const words = name.split(" ")
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase()
    }
    return words
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const bgColor = generateColor(name)
  const initials = getInitials(name)

  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <span className="text-xs font-bold text-white">{initials}</span>
    </div>
  )
}
