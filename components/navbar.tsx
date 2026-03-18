"use client"

import { Button } from "@/components/ui/button"
import { Printer01Icon, Add01Icon } from "hugeicons-react"

interface NavbarProps {
  onNewJob: () => void
}

export function Navbar({ onNewJob }: NavbarProps) {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Printer01Icon size={28} className="text-primary" />
          <span className="text-xl font-bold tracking-tight">Printrax</span>
        </div>
        <Button onClick={onNewJob}>
          <Add01Icon size={16} />
          New Job
        </Button>
      </div>
    </header>
  )
}
