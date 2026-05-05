"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import { PrinterIcon, PlusSignIcon } from "@hugeicons/core-free-icons"

interface NavbarProps {
  onNewJob: () => void
}

export function Navbar({ onNewJob }: NavbarProps) {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={PrinterIcon} size={28} className="text-primary" />
          <span className="hidden text-xl font-bold tracking-tight sm:inline-block">Printrax</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={onNewJob}>
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            <span className="hidden sm:inline">New Job</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
