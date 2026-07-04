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
  showFinancials?: boolean
  showWaste?: boolean
  emptyTitle?: string
  emptyDescription?: string
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

export function JobsTable({
  jobs,
  onUpdateProgress,
  onEdit,
  onDelete,
  showFinancials = true,
  showWaste = true,
  emptyTitle = "No print jobs yet",
  emptyDescription = "Click the \"New Job\" button to create your first print job.",
}: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <HugeiconsIcon icon={PrinterIcon} size={64} className="mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium text-muted-foreground">
          {emptyTitle}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {emptyDescription}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => {
          const progressPercent = (job.quantityPrinted / job.quantity) * 100
          const remainingQuantity = Math.max(
            job.quantity - job.quantityPrinted - (showWaste ? job.waste : 0),
            0
          )
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
                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-muted-foreground">
                      <span>
                        Remaining:{" "}
                        <span className="font-medium text-foreground">
                          {remainingQuantity}
                        </span>
                      </span>
                      {showWaste && job.waste > 0 && (
                        <span className="text-right">
                          Waste:{" "}
                          <span className="font-medium text-foreground">
                            {job.waste}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {showFinancials && (
                    <div className="grid grid-cols-2 gap-3 border-t pt-3 text-xs">
                      <div>
                        <p className="text-muted-foreground">Rate</p>
                        <p className="mt-1 font-medium">
                          N{job.rate.toLocaleString("en-US")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Total</p>
                        <p className="mt-1 font-medium">
                          N{job.amount.toLocaleString("en-US")}
                        </p>
                      </div>
                    </div>
                  )}

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
