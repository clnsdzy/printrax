import type { Metadata, Viewport } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Printrax - Print Job Tracker",
  description: "A print job tracking system for small internet cafés",
}

export const viewport: Viewport = {
  themeColor: "#475569",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="printrax-ui-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
