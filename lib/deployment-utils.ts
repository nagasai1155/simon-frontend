/**
 * Utility functions for optimizing the application for deployment
 */

// Preload critical resources
export const preloadResources = (resources: string[]) => {
  if (typeof window === "undefined") return

  resources.forEach((resource) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.href = resource

    if (resource.endsWith(".js")) {
      link.as = "script"
    } else if (resource.endsWith(".css")) {
      link.as = "style"
    } else if (resource.endsWith(".woff2") || resource.endsWith(".woff") || resource.endsWith(".ttf")) {
      link.as = "font"
      link.crossOrigin = "anonymous"
    } else if (
      resource.endsWith(".jpg") ||
      resource.endsWith(".jpeg") ||
      resource.endsWith(".png") ||
      resource.endsWith(".webp")
    ) {
      link.as = "image"
    }

    document.head.appendChild(link)
  })
}

// Lazy load non-critical resources
export const lazyLoadResources = (resources: string[]) => {
  if (typeof window === "undefined") return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyElement = entry.target as HTMLElement
        const resource = lazyElement.dataset.src

        if (resource) {
          if (lazyElement.tagName === "IMG") {
            ;(lazyElement as HTMLImageElement).src = resource
          } else if (lazyElement.tagName === "IFRAME") {
            ;(lazyElement as HTMLIFrameElement).src = resource
          }

          lazyElement.removeAttribute("data-src")
          observer.unobserve(lazyElement)
        }
      }
    })
  })

  document.querySelectorAll("[data-src]").forEach((element) => {
    observer.observe(element)
  })
}

// Measure and report performance metrics
export const reportPerformanceMetrics = () => {
  if (typeof window === "undefined" || !window.performance) return

  // Wait until the page is fully loaded
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = window.performance.timing

      // Calculate key metrics
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart
      const firstPaint = perfData.responseEnd - perfData.navigationStart
      const ttfb = perfData.responseStart - perfData.navigationStart

      // Log metrics (in production, you'd send these to an analytics service)
      console.log("Performance Metrics:")
      console.log("- Total Page Load Time:", pageLoadTime + "ms")
      console.log("- DOM Content Loaded:", domContentLoaded + "ms")
      console.log("- First Paint:", firstPaint + "ms")
      console.log("- Time to First Byte:", ttfb + "ms")

      // Collect Web Vitals if available
      if ("web-vitals" in window) {
        // @ts-ignore - In a real app, you'd properly import the web-vitals library
        import("web-vitals").then(({ getCLS, getFID, getLCP }) => {
          getCLS(console.log)
          getFID(console.log)
          getLCP(console.log)
        })
      }
    }, 0)
  })
}
