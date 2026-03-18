"use client"

import { PrintJob } from "@/types/job"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { HugeiconsIcon } from "@hugeicons/react"
import { Edit02Icon, Delete02Icon, PrinterIcon } from "@hugeicons/core-free-icons"

interface JobsTableProps {
  jobs: PrintJob[]
  onUpdateProgress: (job: PrintJob) => void
  onDelete: (job: PrintJob) => void
}

function truncate(str: string, maxLength: number) {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + "..."
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
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <HugeiconsIcon icon={PrinterIcon} size={64} className="mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium text-muted-foreground">
            No print jobs yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Click the &quot;New Job&quot; button to create your first print job.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Print Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Name</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead className="hidden sm:table-cell">Rate</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => {
              const progressPercent = (job.quantityPrinted / job.quantity) * 100
              return (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.jobName}</TableCell>
                  <TableCell className="hidden max-w-[200px] md:table-cell">
                    {truncate(job.description || "-", 40)}
                  </TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap">
                      {job.quantityPrinted} / {job.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    ${job.rate.toFixed(2)}
                  </TableCell>
                  <TableCell>${job.amount.toFixed(2)}</TableCell>
                  <TableCell className="min-w-[100px]">
                    <Progress
                      value={progressPercent}
                      className="h-2"
                      indicatorClassName={getProgressColor(job.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(job.status)}>
                      {getStatusLabel(job.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUpdateProgress(job)}
                        title="Update Progress"
                      >
                        <HugeiconsIcon icon={Edit02Icon} size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(job)}
                        title="Delete"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
