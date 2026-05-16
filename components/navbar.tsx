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
import { useTheme } from "@/components/theme-provider"
import { createClient } from "@/lib/supabase/client"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ComputerIcon,
  GridIcon,
  Logout03Icon,
  Moon02Icon,
  PlusSignIcon,
  SunIcon,
  UserCircleIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"

interface NavbarProps {
  onNewJob?: () => void
}
const AUTO_LOGOUT_MS = 30 * 60 * 1000

export function Navbar({ onNewJob }: NavbarProps) {
  const router = useRouter()
  const { setTheme } = useTheme()
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
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground px-3 py-1 rounded-md bg-muted/50">
            <UserIcon size={14} />
            <span className="font-mono">{userId.slice(-6)}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open profile menu">
                <HugeiconsIcon icon={UserCircleIcon} size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <HugeiconsIcon icon={UserIcon} size={16} />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <HugeiconsIcon icon={SunIcon} size={16} />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <HugeiconsIcon icon={Moon02Icon} size={16} />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <HugeiconsIcon icon={ComputerIcon} size={16} />
                System
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
