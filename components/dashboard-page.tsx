"use client"

import { useEffect, useMemo, useState } from "react"
import { PrintJob } from "@/types/job"
import { useJobs } from "@/hooks/use-jobs"
import { PrintJobsTab, usePreferences } from "@/hooks/use-preferences"
import { Navbar } from "@/components/navbar"
import { StatsCards } from "@/components/stats-cards"
import { JobsTable } from "@/components/jobs-table"
import { NewJobModal } from "@/components/new-job-modal"
import { UpdateProgressModal } from "@/components/update-progress-modal"
import { EditJobModal } from "@/components/edit-job-modal"
import { DeleteConfirmModal } from "@/components/delete-confirm-modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"

const statusSearchLabels: Record<PrintJob["status"], string> = {
  completed: "completed complete done",
  in_progress: "in progress ongoing active",
  not_started: "not started pending queued",
}

export function DashboardPage() {
  const { jobs, isLoaded, addJob, updateProgress, updateJob, deleteJob, stats } = useJobs()
  const { preferences } = usePreferences()
  const [newJobOpen, setNewJobOpen] = useState(false)
  const [updateProgressOpen, setUpdateProgressOpen] = useState(false)
  const [editJobOpen, setEditJobOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<PrintJobsTab>(
    preferences.defaultPrintJobsTab
  )

  useEffect(() => {
    setActiveTab(preferences.defaultPrintJobsTab)
  }, [preferences.defaultPrintJobsTab])

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
    } catch (err) {
      console.error("[v0] Failed to add job:", err)
      setError(err instanceof Error ? err.message : "Failed to create job")
    }
  }

  const handleUpdateProgress = (job: PrintJob) => {
    setSelectedJob(job)
    setUpdateProgressOpen(true)
  }

  const handleEditJob = (job: PrintJob) => {
    setSelectedJob(job)
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

  const handleDelete = (job: PrintJob) => {
    setSelectedJob(job)
    setDeleteConfirmOpen(true)
  }

  const tabFilteredJobs = useMemo(() => {
    switch (activeTab) {
      case "completed":
        return jobs.filter((job) => job.status === "completed")
      case "ongoing":
        return jobs.filter((job) => job.status === "in_progress")
      case "not_started":
        return jobs.filter((job) => job.status === "not_started")
      case "all":
      default:
        return jobs
    }
  }, [activeTab, jobs])

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  const filteredJobs = useMemo(() => {
    if (!normalizedSearchQuery) {
      return tabFilteredJobs
    }

    return tabFilteredJobs.filter((job) => {
      const shortId = job.id.slice(-6)
      const searchableValues = [
        job.jobName,
        job.description,
        job.id,
        shortId,
        `#${shortId}`,
        statusSearchLabels[job.status],
      ]

      return searchableValues.some((value) =>
        value.toLowerCase().includes(normalizedSearchQuery)
      )
    })
  }, [normalizedSearchQuery, tabFilteredJobs])

  const emptyTitle = normalizedSearchQuery
    ? "No matching print jobs"
    : activeTab === "all"
      ? "No print jobs yet"
      : "No print jobs in this status"

  const emptyDescription = normalizedSearchQuery
    ? "Try searching by job name, description, job ID, or status."
    : activeTab === "all"
      ? "Click the \"New Job\" button to create your first print job."
      : "Choose another status filter or create a new print job."

  const getJobCount = (status: string) => {
    switch (status) {
      case "completed":
        return jobs.filter((job) => job.status === "completed").length
      case "ongoing":
        return jobs.filter((job) => job.status === "in_progress").length
      case "not_started":
        return jobs.filter((job) => job.status === "not_started").length
      case "all":
      default:
        return jobs.length
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNewJob={() => setNewJobOpen(true)} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {preferences.showKpiCards && (
            <StatsCards
              totalJobs={stats.totalJobs}
              inProgress={stats.inProgress}
              completed={stats.completed}
              totalRevenue={stats.totalRevenue}
            />
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Print Jobs</h2>
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as PrintJobsTab)}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <TabsList className="max-w-full flex-wrap justify-start group-data-horizontal/tabs:h-auto">
                  <TabsTrigger value="all">All ({getJobCount("all")})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({getJobCount("completed")})</TabsTrigger>
                  <TabsTrigger value="ongoing">Ongoing ({getJobCount("ongoing")})</TabsTrigger>
                  <TabsTrigger value="not_started">Not Started ({getJobCount("not_started")})</TabsTrigger>
                </TabsList>
                <div className="relative w-full sm:ml-auto sm:max-w-sm">
                  <label htmlFor="dashboard-job-search" className="sr-only">
                    Search print jobs
                  </label>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    <HugeiconsIcon icon={Search01Icon} size={16} />
                  </span>
                  <Input
                    id="dashboard-job-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search jobs..."
                    className="h-8 pl-9"
                  />
                </div>
              </div>
              <TabsContent value={activeTab} className="mt-6">
                <JobsTable
                  jobs={filteredJobs}
                  onUpdateProgress={handleUpdateProgress}
                  onEdit={handleEditJob}
                  onDelete={handleDelete}
                  showFinancials={preferences.showFinancials}
                  showWaste={preferences.showWaste}
                  emptyTitle={emptyTitle}
                  emptyDescription={emptyDescription}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <NewJobModal
        open={newJobOpen}
        onOpenChange={setNewJobOpen}
        onSubmit={handleAddJob}
      />

      {error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <UpdateProgressModal
        job={selectedJob}
        open={updateProgressOpen}
        onOpenChange={setUpdateProgressOpen}
        onSubmit={updateProgress}
      />

      <EditJobModal
        job={selectedJob}
        open={editJobOpen}
        onOpenChange={setEditJobOpen}
        onSubmit={handleUpdateJob}
      />

      <DeleteConfirmModal
        job={selectedJob}
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={deleteJob}
      />
    </div>
  )
}
