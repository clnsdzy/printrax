"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/client"
import { HugeiconsIcon } from "@hugeicons/react"
import { PrinterIcon, PlusSignIcon } from "@hugeicons/core-free-icons"

interface NavbarProps {
  onNewJob: () => void
}
const AUTO_LOGOUT_MS = 10 * 60 * 1000

export function Navbar({ onNewJob }: NavbarProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current)
      logoutTimerRef.current = null
    }
  }, [])

  const signOut = useCallback(
    async (redirectPath = "/auth/login") => {
      if (isSigningOut) {
        return
      }

      setIsSigningOut(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      clearLogoutTimer()
      setIsSigningOut(false)
      router.push(redirectPath)
      router.refresh()
    },
    [clearLogoutTimer, isSigningOut, router]
  )

  const resetLogoutTimer = useCallback(() => {
    clearLogoutTimer()
    logoutTimerRef.current = setTimeout(() => {
      void signOut("/auth/login?reason=timeout")
    }, AUTO_LOGOUT_MS)
  }, [clearLogoutTimer, signOut])

  useEffect(() => {
    resetLogoutTimer()

    const activityEvents: Array<keyof WindowEventMap> = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
    ]

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetLogoutTimer)
    })

    return () => {
      clearLogoutTimer()
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetLogoutTimer)
      })
    }
  }, [clearLogoutTimer, resetLogoutTimer])

  const handleLogout = async () => {
    await signOut()
  }
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={PrinterIcon} size={28} className="text-primary" />
          <span className="hidden text-xl font-bold tracking-tight sm:inline-block">Printrax</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={handleLogout} disabled={isSigningOut}>
            {isSigningOut ? "Signing out..." : "Logout"}
          </Button>
          <Button onClick={onNewJob}>
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            <span className="hidden sm:inline">New Job</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
