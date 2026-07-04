"use client"

import { useRouter } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { type Theme, useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  defaultPreferences,
  type PrintJobsTab,
  usePreferences,
} from "@/hooks/use-preferences"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeftIcon } from "@hugeicons/core-free-icons"

const tabOptions: Array<{ value: PrintJobsTab; label: string }> = [
  { value: "all", label: "All" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "not_started", label: "Not Started" },
]

function SettingRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-5">
      <div className="min-w-0 space-y-1">
        <Label
          htmlFor={id}
          className="text-xs font-bold uppercase tracking-normal text-foreground"
        >
          {title}
        </Label>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onCheckedChange(!checked)}
        className="group mt-0.5 flex h-4 w-8 shrink-0 items-center border border-foreground/80 bg-muted p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-checked:bg-foreground"
      >
        <span className="block h-3 w-3 bg-foreground transition-transform group-aria-checked:translate-x-4 group-aria-checked:bg-background" />
      </button>
    </div>
  )
}

export function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { preferences, updatePreference, resetPreferences } = usePreferences()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage display preferences and default print job views.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <HugeiconsIcon icon={ArrowLeftIcon} size={16} data-icon="inline-start" />
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Choose how Printrax looks across your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={theme} onValueChange={(value) => setTheme(value as Theme)}>
                <TabsList className="w-full sm:w-fit">
                  <TabsTrigger value="light">Light</TabsTrigger>
                  <TabsTrigger value="dark">Dark</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Print Job Display</CardTitle>
              <CardDescription>
                Control which production and money fields appear on job pages.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow
                id="show-financials"
                title="Financials"
                description="Display rates, totals, earned revenue, and pending revenue on print jobs."
                checked={preferences.showFinancials}
                onCheckedChange={(checked) =>
                  updatePreference("showFinancials", checked)
                }
              />
              <SettingRow
                id="show-waste"
                title="Waste fields"
                description="Display waste tracking and waste-adjusted remaining quantities."
                checked={preferences.showWaste}
                onCheckedChange={(checked) => updatePreference("showWaste", checked)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Set the dashboard density and default jobs list tab.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="divide-y divide-border">
                <SettingRow
                  id="show-kpi-cards"
                  title="KPI cards"
                  description="Display total jobs, active jobs, completed jobs, and revenue cards."
                  checked={preferences.showKpiCards}
                  onCheckedChange={(checked) =>
                    updatePreference("showKpiCards", checked)
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Default print jobs tab
                  </Label>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Choose the tab selected when the dashboard opens.
                  </p>
                </div>
                <Tabs
                  value={preferences.defaultPrintJobsTab}
                  onValueChange={(value) =>
                    updatePreference("defaultPrintJobsTab", value as PrintJobsTab)
                  }
                >
                  <TabsList className="flex h-auto w-full flex-wrap justify-start sm:w-fit">
                    {tabOptions.map((option) => (
                      <TabsTrigger key={option.value} value={option.value}>
                        {option.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={resetPreferences}
              disabled={
                preferences.showFinancials === defaultPreferences.showFinancials &&
                preferences.showWaste === defaultPreferences.showWaste &&
                preferences.showKpiCards === defaultPreferences.showKpiCards &&
                preferences.defaultPrintJobsTab ===
                  defaultPreferences.defaultPrintJobsTab
              }
            >
              Reset Preferences
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
