import { Card, CardContent } from "@/components/ui/card"
import {
  File01Icon,
  Loading03Icon,
  CheckmarkCircle01Icon,
  DollarCircleIcon,
} from "hugeicons-react"

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
      icon: File01Icon,
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Loading03Icon,
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckmarkCircle01Icon,
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarCircleIcon,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <stat.icon size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
