"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Delete02Icon,
  FileIcon,
  PencilEdit02Icon,
  PrinterIcon,
} from "@hugeicons/core-free-icons"
import { PrintJob } from "@/types/job"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

type ActivityType = "batch" | "waste" | "edit" | "created"

interface ActivityActor {
  firstName: string
}

interface ActivityDetail {
  label: string
  value: string
}

interface JobActivity {
  id: string
  type: ActivityType
  title: string
  summary: string
  meta: string
  description: string
  details: ActivityDetail[]
}

interface JobActivityCardProps {
  job: PrintJob
  showWaste?: boolean
}

const MAX_VISIBLE_ACTIVITIES = 10

const formatNumber = (value: number) => value.toLocaleString("en-US")

const formatCurrency = (value: number) =>
  `N ${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

const getPercent = (value: number, total: number) => {
  if (total <= 0) return "0%"

  return `${Math.min((value / total) * 100, 100).toFixed(0)}%`
}

const getFirstName = (metadata: Record<string, unknown>) => {
  const name =
    metadata.first_name ??
    metadata.firstName ??
    metadata.name ??
    metadata.full_name

  if (typeof name !== "string" || !name.trim()) {
    return "Unknown"
  }

  return name.trim().split(/\s+/)[0]
}

const getActivityStyles = (type: ActivityType) => {
  switch (type) {
    case "batch":
      return {
        icon: PrinterIcon,
        iconClassName: "text-primary",
        dotClassName: "bg-primary",
      }
    case "waste":
      return {
        icon: Delete02Icon,
        iconClassName: "text-destructive",
        dotClassName: "bg-destructive",
      }
    case "edit":
      return {
        icon: PencilEdit02Icon,
        iconClassName: "text-muted-foreground",
        dotClassName: "bg-muted-foreground",
      }
    case "created":
      return {
        icon: FileIcon,
        iconClassName: "text-muted-foreground",
        dotClassName: "bg-muted-foreground",
      }
  }
}

const buildActivities = (job: PrintJob, showWaste: boolean): JobActivity[] => {
  const batchActivities = job.batches.map((batch, index) => {
    const cumulativePrinted = job.batches
      .slice(0, index + 1)
      .reduce((total, currentBatch) => total + currentBatch, 0)

    return {
      id: `batch-${index}`,
      type: "batch" as const,
      title: `Batch ${index + 1} logged`,
      summary: `${formatNumber(batch)} units added to production`,
      meta: getPercent(cumulativePrinted, job.quantity),
      description: "A production batch was added to this print job.",
      details: [
        { label: "Batch quantity", value: `${formatNumber(batch)} units` },
        {
          label: "Cumulative printed",
          value: `${formatNumber(cumulativePrinted)} of ${formatNumber(job.quantity)} units`,
        },
        { label: "Batch order", value: `${index + 1} of ${job.batches.length}` },
      ],
    }
  })

  const wasteActivity =
    showWaste && job.waste > 0
      ? [
          {
            id: "waste",
            type: "waste" as const,
            title: "Waste updated",
            summary: `${formatNumber(job.waste)} units marked as waste`,
            meta: `${getPercent(job.waste, job.quantity)} waste`,
            description: "Waste units are subtracted from the remaining saleable quantity.",
            details: [
              { label: "Current waste", value: `${formatNumber(job.waste)} units` },
              {
                label: "Remaining after waste",
                value: `${formatNumber(Math.max(job.quantity - job.quantityPrinted - job.waste, 0))} units`,
              },
              {
                label: "Printed quantity",
                value: `${formatNumber(job.quantityPrinted)} units`,
              },
            ],
          },
        ]
      : []

  const editableDetailsActivity: JobActivity = {
    id: "editable-details",
    type: "edit",
    title: "Saved job details",
    summary: "Latest editable values for quantity, packs, and rate",
    meta: "Current",
    description: "This reflects the latest saved job values after edits.",
    details: [
      { label: "Job name", value: job.jobName },
      { label: "Total quantity", value: `${formatNumber(job.quantity)} units` },
      { label: "Packs", value: formatNumber(job.packs) },
      { label: "Quantity per pack", value: formatNumber(job.qtyPerPack) },
      { label: "Rate", value: formatCurrency(job.rate) },
    ],
  }

  const createdActivity: JobActivity = {
    id: "created",
    type: "created",
    title: "Job created",
    summary: `${formatNumber(job.quantity)} units scheduled for production`,
    meta: formatDateTime(job.createdAt),
    description: "The print job was created and added to the production queue.",
    details: [
      { label: "Created", value: formatDateTime(job.createdAt) },
      { label: "Initial quantity", value: `${formatNumber(job.quantity)} units` },
      { label: "Total amount", value: formatCurrency(job.amount) },
      {
        label: "Description",
        value: job.description || "No description provided",
      },
    ],
  }

  return [
    ...wasteActivity,
    ...batchActivities.reverse(),
    editableDetailsActivity,
    createdActivity,
  ]
}

export function JobActivityCard({ job, showWaste = true }: JobActivityCardProps) {
  const [actor, setActor] = useState<ActivityActor>({
    firstName: "Unknown",
  })
  const [visibleActivityCount, setVisibleActivityCount] = useState(
    MAX_VISIBLE_ACTIVITIES
  )
  const allActivities = buildActivities(job, showWaste)
  const activities = allActivities.slice(0, visibleActivityCount)
  const activityLabel = activities.length === 1 ? "event" : "events"
  const hasMoreActivities = visibleActivityCount < allActivities.length

  useEffect(() => {
    let isActive = true

    const fetchActor = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!isActive || !user) {
        return
      }

      setActor({
        firstName: getFirstName(user.user_metadata ?? {}),
      })
    }

    void fetchActor()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    setVisibleActivityCount(MAX_VISIBLE_ACTIVITIES)
  }, [job.id, showWaste])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Activity</CardTitle>
            <CardDescription>
              {showWaste
                ? "Production batches, waste, and saved job edits."
                : "Production batches and saved job edits."}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="w-fit">
            {activities.length}
            {allActivities.length > MAX_VISIBLE_ACTIVITIES
              ? ` of ${allActivities.length}`
              : ""}{" "}
            {activityLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {activities.map((activity) => {
            const { icon, iconClassName, dotClassName } = getActivityStyles(activity.type)

            return (
              <HoverCard key={activity.id} openDelay={150} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <button
                    type="button"
                    className="grid w-full grid-cols-[auto_1fr] gap-3 px-0 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:grid-cols-[auto_1fr_auto] sm:px-2"
                    aria-label={`${activity.title}: ${activity.summary}`}
                  >
                    <span className="relative mt-0.5 flex h-8 w-8 items-center justify-center border bg-background">
                      <span
                        className={`absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 ${dotClassName}`}
                        aria-hidden="true"
                      />
                      <HugeiconsIcon
                        icon={icon}
                        size={16}
                        className={iconClassName}
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {activity.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {activity.summary}
                      </span>
                    </span>
                    <span className="col-start-2 text-xs font-medium text-muted-foreground sm:col-start-auto sm:mt-1">
                      {activity.meta}
                    </span>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent
                  align="start"
                  className="w-[min(20rem,calc(100vw-2rem))] p-4 text-sm"
                >
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                    <div className="grid gap-2 border-t pt-3">
                      <div className="grid grid-cols-[8rem_1fr] gap-3 text-xs">
                        <span className="text-muted-foreground">
                          Changed by
                        </span>
                        <span className="min-w-0 break-words text-right font-medium text-foreground">
                          {actor.firstName}
                        </span>
                      </div>
                      {activity.details.map((detail) => (
                        <div
                          key={detail.label}
                          className="grid grid-cols-[8rem_1fr] gap-3 text-xs"
                        >
                          <span className="text-muted-foreground">
                            {detail.label}
                          </span>
                          <span className="min-w-0 break-words text-right font-medium text-foreground">
                            {detail.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )
          })}
        </div>
        {hasMoreActivities && (
          <div className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                setVisibleActivityCount((currentCount) =>
                  Math.min(
                    currentCount + MAX_VISIBLE_ACTIVITIES,
                    allActivities.length
                  )
                )
              }
            >
              View More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
