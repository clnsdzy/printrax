"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { jsPDF } from "jspdf"
import { PrintJob } from "@/types/job"
import { useJobs } from "@/hooks/use-jobs"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UpdateProgressModal } from "@/components/update-progress-modal"
import { EditJobModal } from "@/components/edit-job-modal"
import { DeleteConfirmModal } from "@/components/delete-confirm-modal"
import { NewJobModal } from "@/components/new-job-modal"
import { JobActivityCard } from "@/components/job-activity-card"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeftIcon, PencilEdit02Icon, Delete02Icon, Download04Icon } from "@hugeicons/core-free-icons"

interface JobDetailPageClientProps {
  jobId: string
}

export function JobDetailPageClient({ jobId }: JobDetailPageClientProps) {
  const router = useRouter()
  const { jobs, isLoaded, updateProgress, updateJob, deleteJob, addJob } = useJobs()

  const [updateProgressOpen, setUpdateProgressOpen] = useState(false)
  const [editJobOpen, setEditJobOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [newJobOpen, setNewJobOpen] = useState(false)
  const [wasteInput, setWasteInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const job = useMemo(() => jobs.find((j) => j.id === jobId), [jobs, jobId])

  const handleEditJob = () => {
    setEditJobOpen(true)
  }

  const handleUpdateJob = async (
    id: string,
    jobName: string,
    description: string,
    rate: number,
    quantity: number,
    packs: number,
    qtyPerPack: number
  ) => {
    try {
      setError(null)
      await updateJob(id, jobName, description, rate, quantity, packs, qtyPerPack)
      setEditJobOpen(false)
    } catch (err) {
      console.error("[v0] Failed to update job:", err)
      setError(err instanceof Error ? err.message : "Failed to update job")
    }
  }

  const handleDelete = () => {
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = (id: string) => {
    deleteJob(id)
    router.push("/dashboard")
  }

  const handleUpdateWaste = async () => {
    if (!job || wasteInput === "") return
    try {
      setError(null)
      const waste = parseInt(wasteInput)
      if (isNaN(waste) || waste < 0) {
        setError("Waste must be a valid number")
        return
      }
      await updateJob(job.id, job.jobName, job.description, job.rate, job.quantity, job.packs, job.qtyPerPack, waste)
      setWasteInput("")
    } catch (err) {
      console.error("[v0] Failed to update waste:", err)
      setError(err instanceof Error ? err.message : "Failed to update waste")
    }
  }

  const handleAddJob = async (data: {
    jobName: string
    description: string
    rate: number
    quantity: number
    packs: number
    qtyPerPack: number
  }) => {
    try {
      setError(null)
      await addJob(data)
      setNewJobOpen(false)
      router.push("/dashboard")
    } catch (err) {
      console.error("[v0] Failed to add job:", err)
      setError(err instanceof Error ? err.message : "Failed to create job")
    }
  }

  const handleExportPDF = (job: PrintJob) => {
    const doc = new jsPDF()
    const createdDate = new Date(job.createdAt)
    const formattedDate = createdDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const formatPdfCurrency = (value: number) =>
      `N ${value.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`
    const details = [
      ["Job Title", job.jobName],
      ["Date", formattedDate],
      ["Total Quantity", job.quantity.toString()],
      ["Rate", formatPdfCurrency(job.rate)],
      ["Total Amount", formatPdfCurrency(job.amount)],
    ]

    doc.setTextColor(37, 99, 235)
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("Print Job Summary", 20, 22)

    doc.setDrawColor(37, 99, 235)
    doc.line(20, 30, 190, 30)

    details.forEach(([label, value], index) => {
      const yPosition = 45 + index * 12

      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(107, 114, 128)
      doc.text(`${label}:`, 20, yPosition)

      doc.setFont("helvetica", "normal")
      doc.setTextColor(30, 30, 30)
      doc.text(value, 80, yPosition)
    })

    doc.save(`${job.jobName}-summary.pdf`)
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onNewJob={() => setNewJobOpen(true)} />

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            className="mb-6"
            onClick={() => router.push("/dashboard")}
          >
            <HugeiconsIcon icon={ArrowLeftIcon} size={16} className="mr-2" />
            Back
          </Button>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <h3 className="text-lg font-medium">Job not found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The job you&apos;re looking for doesn&apos;t exist.
              </p>
            </CardContent>
          </Card>
        </main>

        <NewJobModal
          open={newJobOpen}
          onOpenChange={setNewJobOpen}
          onSubmit={handleAddJob}
        />
      </div>
    )
  }

  const progressPercent = (job.quantityPrinted / job.quantity) * 100
  const remainingQuantity = job.quantity - job.quantityPrinted

  const getStatusLabel = (status: PrintJob["status"]) => {
    switch (status) {
      case "not_started":
        return "Not Started"
      case "in_progress":
        return "In Progress"
      case "completed":
        return "Completed"
    }
  }

  const getStatusBadgeVariant = (status: PrintJob["status"]) => {
    switch (status) {
      case "not_started":
        return "notStarted"
      case "in_progress":
        return "inProgress"
      case "completed":
        return "completed"
    }
  }

  const getProgressColor = (status: PrintJob["status"]) => {
    switch (status) {
      case "not_started":
        return "bg-red-500"
      case "in_progress":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
    }
  }

  const createdDate = new Date(job.createdAt)
  const formattedDate = createdDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = createdDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

  const getAbbreviatedId = (id: string) => `#${id.slice(-6)}`

  const packsPrinted = job.qtyPerPack > 0 ? (job.quantityPrinted / job.qtyPerPack).toFixed(2) : "0.00"

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNewJob={() => setNewJobOpen(true)} />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => router.push("/dashboard")}
        >
          <HugeiconsIcon icon={ArrowLeftIcon} size={16} className="mr-2" />
          Dashboard
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl">{job.jobName}</CardTitle>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>Job ID: {getAbbreviatedId(job.id)}</p>
                    <p>{formattedDate} at {formattedTime}</p>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(job.status)} className="inline-block sm:ml-4 sm:inline">
                  {getStatusLabel(job.status)}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {job.description || "No description provided"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Production Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Printed
                    </p>
                    <p className="text-3xl font-bold">
                      {job.quantityPrinted}
                      <span className="text-xl text-muted-foreground">
                        {" "}/ {job.quantity}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {progressPercent.toFixed(0)}% complete
                  </p>
                </div>
                <Progress
                  value={progressPercent}
                  className="h-3"
                  indicatorClassName={getProgressColor(job.status)}
                />
                {job.batches && job.batches.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Batches: {job.batches.join(", ")}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-medium text-muted-foreground">Packs Printed</p>
                  <p className="mt-1 text-lg font-semibold">{packsPrinted}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-medium text-muted-foreground">Qty Per Pack</p>
                  <p className="mt-1 text-lg font-semibold">{job.qtyPerPack}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-medium text-muted-foreground">Total Packs</p>
                  <p className="mt-1 text-lg font-semibold">{job.packs}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {remainingQuantity > 0 && (
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      Items Remaining (Qty - Waste)
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {remainingQuantity - job.waste}
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="waste">Waste (Units)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="waste"
                      type="number"
                      min="0"
                      value={wasteInput}
                      onChange={(e) => setWasteInput(e.target.value)}
                      placeholder="Enter waste units"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleUpdateWaste}
                      disabled={!wasteInput}
                      className="whitespace-nowrap"
                    >
                      Update Waste
                    </Button>
                  </div>
                  {job.waste > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Current waste: {job.waste} units
                    </p>
                  )}
                </div>
              </div>

              <Button onClick={() => setUpdateProgressOpen(true)} className="w-full">
                Update Progress
              </Button>
            </CardContent>
          </Card>

          <JobActivityCard job={job} />

          <Card>
            <CardHeader>
              <CardTitle>Financials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Rate per Unit
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    <span className="inline-flex items-baseline gap-1">
                      <span className="text-inherit">N</span>
                      <span>{formatCurrency(job.rate)}</span>
                    </span>
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Amount
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    <span className="inline-flex items-baseline gap-1">
                      <span className="text-inherit">N</span>
                      <span>{formatCurrency(job.amount)}</span>
                    </span>
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Revenue Earned
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    <span className="inline-flex items-baseline gap-1">
                      <span className="text-inherit">N</span>
                      <span>{formatCurrency(job.rate * job.quantityPrinted)}</span>
                    </span>
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Revenue
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    <span className="inline-flex items-baseline gap-1">
                      <span className="text-inherit">N</span>
                      <span>{formatCurrency(job.rate * remainingQuantity)}</span>
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => handleExportPDF(job)}
                className="w-full sm:flex-1"
              >
                <HugeiconsIcon icon={Download04Icon} size={16} data-icon="inline-start" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleEditJob}
                className="w-full sm:flex-2"
              >
                <HugeiconsIcon icon={PencilEdit02Icon} size={16} data-icon="inline-start" />
                Edit Job
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="w-full sm:flex-1"
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} data-icon="inline-start" />
                Delete Job
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <UpdateProgressModal
        job={job}
        open={updateProgressOpen}
        onOpenChange={setUpdateProgressOpen}
        onSubmit={updateProgress}
      />

      <EditJobModal
        job={job}
        open={editJobOpen}
        onOpenChange={setEditJobOpen}
        onSubmit={handleUpdateJob}
      />

      <DeleteConfirmModal
        job={job}
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
      />

      <NewJobModal
        open={newJobOpen}
        onOpenChange={setNewJobOpen}
        onSubmit={handleAddJob}
      />
    </div>
  )
}
