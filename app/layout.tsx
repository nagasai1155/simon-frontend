import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import Script from "next/script"

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: true,
})

export const metadata: Metadata = {
  title: "Connected Sensors - Set Up for Success",
  description: "Get everything ready in just 15 minutes",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "16x16" },
    ],
    apple: { url: "/favicon.png", sizes: "180x180" },
  },
  generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#000" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical assets */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="vite-ui-theme"
        >
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>

        {/* Initialize theme before page renders */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const theme = localStorage.getItem('vite-ui-theme');
                const html = document.documentElement;
                if (theme === 'light') {
                  html.classList.remove('dark');
                } else {
                  html.classList.add('dark');
                }
              } catch (e) {
                console.error('Theme initialization error:', e);
              }
            })();
          `}
        </Script>
        {/* Performance monitoring script - deferred */}
        <Script id="performance-monitoring" strategy="afterInteractive">
          {`
            // Initialize performance monitoring
            window.addEventListener('load', () => {
              setTimeout(() => {
                if (window.performance) {
                  const perfData = window.performance.timing;
                  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                  console.log('Page load time:', pageLoadTime + 'ms');
                }
              }, 0);
            });
          `}
        </Script>
      </body>
    </html>
  )
}
