import Link from "next/link"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { GridIcon, User02Icon } from "@hugeicons/core-free-icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Track jobs in one place",
    description: "Create, edit, and organize all print jobs from a single dashboard.",
  },
  {
    title: "Monitor production progress",
    description: "Update quantities as you print and instantly see completion status.",
  },
  {
    title: "See revenue at a glance",
    description: "Get quick totals for active jobs, completed jobs, and expected revenue.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={GridIcon} size={24} className="text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant={"outline"}>
              <Link href="/auth/login">
                <HugeiconsIcon icon={User02Icon} size={28} className="text-primary md:hidden" />
                <span className="hidden md:block">Login</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Print tracking for small to medium cybercafes
          </h1>
          <p className="text-lg text-muted-foreground">
            Printrax helps you manage print orders and monitor progress with a simple, clean workflow.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Get started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent/40 hover:shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Printrax. All rights reserved.</p>
      </footer>
    </div>
  )
}
