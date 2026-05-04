"use client"

import { useState } from "react"
import { PrintJob } from "@/types/job"
import { useJobs } from "@/hooks/use-jobs"
import { Navbar } from "@/components/navbar"
import { StatsCards } from "@/components/stats-cards"
import { JobsTable } from "@/components/jobs-table"
import { NewJobModal } from "@/components/new-job-modal"
import { UpdateProgressModal } from "@/components/update-progress-modal"
import { DeleteConfirmModal } from "@/components/delete-confirm-modal"

export default function Dashboard() {
  const { jobs, isLoaded, addJob, updateProgress, deleteJob, stats } = useJobs()
  const [newJobOpen, setNewJobOpen] = useState(false)
  const [updateProgressOpen, setUpdateProgressOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAddJob = async (data: {
    jobName: string
    description: string
    rate: number
    quantity: number
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

  const handleDelete = (job: PrintJob) => {
    setSelectedJob(job)
    setDeleteConfirmOpen(true)
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
          <StatsCards
            totalJobs={stats.totalJobs}
            inProgress={stats.inProgress}
            completed={stats.completed}
            totalRevenue={stats.totalRevenue}
          />
          
          <JobsTable
            jobs={jobs}
            onUpdateProgress={handleUpdateProgress}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <NewJobModal
        open={newJobOpen}
        onOpenChange={setNewJobOpen}
        onSubmit={handleAddJob}
      />
      
      {error && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-50 border border-red-200 rounded-md p-4 max-w-sm">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <UpdateProgressModal
        job={selectedJob}
        open={updateProgressOpen}
        onOpenChange={setUpdateProgressOpen}
        onSubmit={updateProgress}
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
