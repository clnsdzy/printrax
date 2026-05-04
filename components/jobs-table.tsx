"use client"

import Link from "next/link"
import { PrintJob } from "@/types/job"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { HugeiconsIcon } from "@hugeicons/react"
import { PencilEdit02Icon, Delete02Icon, PrinterIcon } from "@hugeicons/core-free-icons"

interface JobsTableProps {
  jobs: PrintJob[]
  onUpdateProgress: (job: PrintJob) => void
  onDelete: (job: PrintJob) => void
}

function getStatusBadgeVariant(status: PrintJob["status"]) {
  switch (status) {
    case "not_started":
      return "notStarted"
    case "in_progress":
      return "inProgress"
    case "completed":
      return "completed"
  }
}

function getStatusLabel(status: PrintJob["status"]) {
  switch (status) {
    case "not_started":
      return "Not Started"
    case "in_progress":
      return "In Progress"
    case "completed":
      return "Completed"
  }
}

function getProgressColor(status: PrintJob["status"]) {
  switch (status) {
    case "not_started":
      return "bg-red-500"
    case "in_progress":
      return "bg-yellow-500"
    case "completed":
      return "bg-green-500"
  }
}

export function JobsTable({ jobs, onUpdateProgress, onDelete }: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <HugeiconsIcon icon={PrinterIcon} size={64} className="mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium text-muted-foreground">
          No print jobs yet
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Click the &quot;New Job&quot; button to create your first print job.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Print Jobs</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => {
          const progressPercent = (job.quantityPrinted / job.quantity) * 100
          return (
            <Card key={job.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="flex-1"
                  >
                    <CardTitle className="text-base hover:text-primary transition-colors">
                      {job.jobName}
                    </CardTitle>
                  </Link>
                  <Badge variant={getStatusBadgeVariant(job.status)}>
                    {getStatusLabel(job.status)}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {job.description || "No description"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4">
                {/* Progress Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {job.quantityPrinted} / {job.quantity}
                    </span>
                  </div>
                  <Progress
                    value={progressPercent}
                    className="h-2"
                    indicatorClassName={getProgressColor(job.status)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(progressPercent)}% complete
                  </p>
                </div>

                {/* Financials Section */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Rate</p>
                    <p className="font-semibold">₦{job.rate.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold">₦{job.amount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onUpdateProgress(job)}
                  >
                    <HugeiconsIcon icon={PencilEdit02Icon} size={16} data-icon="inline-start" />
                    Update
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(job)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
