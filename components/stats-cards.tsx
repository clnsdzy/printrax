import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FileIcon,
  Loading01Icon,
  CheckmarkCircle02Icon,
  DollarCircleIcon,
} from "@hugeicons/core-free-icons"

interface StatsCardsProps {
  totalJobs: number
  inProgress: number
  completed: number
  totalRevenue: number
}

export function StatsCards({
  totalJobs,
  inProgress,
  completed,
  totalRevenue,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Total Jobs",
      value: totalJobs,
      icon: FileIcon,
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Loading01Icon,
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckmarkCircle02Icon,
    },
    {
      label: "Total Revenue",
      value: totalRevenue,
      icon: DollarCircleIcon,
      currency: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="md:flex h-10 w-10 items-center justify-center rounded-lg bg-muted hidden md:block">
              <HugeiconsIcon icon={stat.icon} size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-semibold">
                {stat.currency ? (
                  <span className="inline-flex items-baseline gap-1">
                    <span className="text-inherit">N</span>
                    <span>{stat.value.toLocaleString("en-US", { minimumFractionDigits: 0 })}</span>
                  </span>
                ) : (
                  stat.value
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
