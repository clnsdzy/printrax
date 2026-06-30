"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ComputerIcon,
  GridIcon,
  Logout03Icon,
  PlusSignIcon,
  UserCircleIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"

interface NavbarProps {
  onNewJob?: () => void
}
const AUTO_LOGOUT_MS = 30 * 60 * 1000

export function Navbar({ onNewJob }: NavbarProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [userId, setUserId] = useState<string>("")
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
      localStorage.removeItem("rememberMe")
      clearLogoutTimer()
      setIsSigningOut(false)
      router.push(redirectPath)
      router.refresh()
    },
    [clearLogoutTimer, isSigningOut, router]
  )

  const resetLogoutTimer = useCallback(() => {
    clearLogoutTimer()
    if (!rememberMe) {
      logoutTimerRef.current = setTimeout(() => {
        void signOut("/auth/login?reason=timeout")
      }, AUTO_LOGOUT_MS)
    }
  }, [clearLogoutTimer, signOut, rememberMe])

  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true"
    setRememberMe(savedRememberMe)
    
    const fetchUserId = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    
    void fetchUserId()
  }, [])

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
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <HugeiconsIcon icon={GridIcon} size={24} className="text-primary" />
        </Link>
        <div className="flex items-center gap-3">
          {userId && (
            <div className="hidden border px-2 py-1 text-xs text-muted-foreground sm:block">
              <span className="font-mono font-medium text-foreground">
                {userId.slice(-6)}
              </span>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open profile menu">
                <HugeiconsIcon icon={UserCircleIcon} size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <HugeiconsIcon icon={GridIcon} size={16} />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <HugeiconsIcon icon={UserIcon} size={16} />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <HugeiconsIcon icon={ComputerIcon} size={16} />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={handleLogout}
                disabled={isSigningOut}
              >
                <HugeiconsIcon icon={Logout03Icon} size={16} />
                {isSigningOut ? "Signing out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {onNewJob && (
            <Button onClick={onNewJob}>
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              <span className="hidden sm:inline">New Job</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
