"use client"

import { useEffect, useState } from "react"
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

export function DashboardPage() {
  const { jobs, isLoaded, addJob, updateProgress, updateJob, deleteJob, stats } = useJobs()
  const { preferences } = usePreferences()
  const [newJobOpen, setNewJobOpen] = useState(false)
  const [updateProgressOpen, setUpdateProgressOpen] = useState(false)
  const [editJobOpen, setEditJobOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null)
  const [error, setError] = useState<string | null>(null)
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

  const getFilteredJobs = () => {
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
  }

  const filteredJobs = getFilteredJobs()

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
              <TabsList>
                <TabsTrigger value="all">All ({getJobCount("all")})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({getJobCount("completed")})</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing ({getJobCount("ongoing")})</TabsTrigger>
                <TabsTrigger value="not_started">Not Started ({getJobCount("not_started")})</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab} className="mt-6">
                <JobsTable
                  jobs={filteredJobs}
                  onUpdateProgress={handleUpdateProgress}
                  onEdit={handleEditJob}
                  onDelete={handleDelete}
                  showFinancials={preferences.showFinancials}
                  showWaste={preferences.showWaste}
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
