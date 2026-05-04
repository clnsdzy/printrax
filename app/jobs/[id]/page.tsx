"use client"

import { useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { PrintJob } from "@/types/job"
import { useJobs } from "@/hooks/use-jobs"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { UpdateProgressModal } from "@/components/update-progress-modal"
import { DeleteConfirmModal } from "@/components/delete-confirm-modal"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeftIcon } from "@hugeicons/core-free-icons"

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string
  const { jobs, isLoaded, updateProgress, deleteJob } = useJobs()
  
  const [updateProgressOpen, setUpdateProgressOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const job = useMemo(() => jobs.find((j) => j.id === jobId), [jobs, jobId])

  const handleDelete = () => {
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = (id: string) => {
    deleteJob(id)
    router.push("/")
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
        <Navbar onNewJob={() => {}} />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            className="mb-6"
            onClick={() => router.push("/")}
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNewJob={() => {}} />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => router.push("/")}
        >
          <HugeiconsIcon icon={ArrowLeftIcon} size={16} className="mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl">{job.jobName}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Created on {formattedDate} at {formattedTime}
                  </p>
                </div>
                <Badge variant={getStatusBadgeVariant(job.status)} className="ml-4">
                  {getStatusLabel(job.status)}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Description Card */}
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

          {/* Progress Card */}
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
                        {" "}
                        / {job.quantity}
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
              </div>

              {remainingQuantity > 0 && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    {remainingQuantity} items remaining
                  </p>
                </div>
              )}

              <Button
                onClick={() => setUpdateProgressOpen(true)}
                className="w-full"
              >
                Update Progress
              </Button>
            </CardContent>
          </Card>

          {/* Financials Card */}
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
                    ${job.rate.toFixed(2)}
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Amount
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    ${job.amount.toFixed(2)}
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Revenue Earned
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    ${(job.rate * job.quantityPrinted).toFixed(2)}
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Revenue
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    ${(job.rate * remainingQuantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="w-full"
              >
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

      <DeleteConfirmModal
        job={job}
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
