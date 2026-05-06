"use client"

import Link from "next/link"
import { PrintJob } from "@/types/job"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { HugeiconsIcon } from "@hugeicons/react"
import { PencilEdit02Icon, Delete02Icon, PrinterIcon } from "@hugeicons/core-free-icons"

interface JobsTableProps {
  jobs: PrintJob[]
  onUpdateProgress: (job: PrintJob) => void
  onEdit: (job: PrintJob) => void
  onDelete: (job: PrintJob) => void
}

function getStatusColor(status: PrintJob["status"]) {
  switch (status) {
    case "not_started":
      return "bg-red-500"
    case "in_progress":
      return "bg-yellow-500"
    case "completed":
      return "bg-green-500"
  }
}

function getStatusDotColor(status: PrintJob["status"]) {
  switch (status) {
    case "not_started":
      return "#ef4444"
    case "in_progress":
      return "#eab308"
    case "completed":
      return "#22c55e"
  }
}

export function JobsTable({ jobs, onUpdateProgress, onEdit, onDelete }: JobsTableProps) {
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
            <Link key={job.id} href={`/jobs/${job.id}`} className="group">
              <Card className="flex h-full flex-col border transition-all hover:border-foreground/20 hover:shadow-lg">
                <CardContent className="flex flex-1 flex-col gap-4 p-6">
                  {/* Header with title and status dot */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold leading-tight">
                        {job.jobName}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        #{job.id.slice(-6)}
                      </span>
                    </div>
                    <div
                      className="mt-1 size-3 shrink-0"
                      style={{ backgroundColor: getStatusDotColor(job.status) }}
                      title={job.status}
                    />
                  </div>

                  {/* Progress Section */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {job.quantityPrinted} / {job.quantity}
                      </span>
                    </div>
                    <Progress
                      value={progressPercent}
                      className="h-2"
                      indicatorClassName={getStatusColor(job.status)}
                    />
                  </div>

                  {/* Actions Section */}
                  <div className="flex flex-wrap gap-2 pt-2" onClick={(e) => e.preventDefault()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onUpdateProgress(job)}
                    >
                      
                      Update Progress
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(job)}
                      title="Edit job"
                    >
                      <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
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
            </Link>
          )
        })}
      </div>
    </div>
  )
}
