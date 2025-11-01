import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility for conditional class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Animation durations
export const ANIMATION = {
  fast: 150,
  default: 250,
  slow: 350,
}

// Easing functions - FIXED: Using standard Framer Motion easing names
export const EASING = {
  easeInOut: "easeInOut",
  easeOut: "easeOut",
  easeIn: "easeIn",
  sharp: "easeInOut",
}

// Animation variants for Framer Motion
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION.default / 1000,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ANIMATION.fast / 1000,
      ease: EASING.easeIn,
    },
  },
}

export const slideUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION.default / 1000,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: ANIMATION.fast / 1000,
      ease: EASING.easeIn,
    },
  },
}

export const slideRight = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION.default / 1000,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: {
      duration: ANIMATION.fast / 1000,
      ease: EASING.easeIn,
    },
  },
}

// Staggered children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      ease: EASING.easeOut,
    },
  },
}

// Format large numbers with K, M, B suffixes
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B"
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K"
  }
  return num.toString()
}

// Generate skeleton loading arrays
export function generateSkeletonArray(count: number): number[] {
  return Array.from({ length: count }, (_, i) => i)
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
