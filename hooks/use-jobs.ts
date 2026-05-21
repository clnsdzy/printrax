"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { PrintJob, deriveStatus, calculateAmount } from "@/types/job"

export function useJobs() {
  const [jobs, setJobs] = useState<PrintJob[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Fetch all jobs on mount
  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/jobs")
      if (!response.ok) throw new Error("Failed to fetch jobs")
      const data = await response.json()

      const formattedJobs: PrintJob[] = data.map((job: any) => ({
        id: job.id,
        jobName: job.job_name,
        description: job.description,
        quantity: job.quantity_ordered,
        quantityPrinted: job.quantity_printed,
        rate: parseFloat(job.rate_per_unit),
        amount: calculateAmount(parseFloat(job.rate_per_unit), job.quantity_ordered),
        status: deriveStatus(job.quantity_printed, job.quantity_ordered),
        createdAt: job.created_at,
        batches: job.batches || [],
      }))

      setJobs(formattedJobs)
      setIsLoaded(true)
    } catch (error) {
      console.error("[v0] Error fetching jobs:", error)
      setIsLoaded(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addJob = useCallback(
    async (jobData: { jobName: string; description: string; rate: number; quantity: number }) => {
      try {
        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobName: jobData.jobName,
            description: jobData.description,
            quantity: jobData.quantity,
            rate: jobData.rate,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("[v0] API error response:", errorData)
          throw new Error(errorData.error || "Failed to create job")
        }
        
        const data = await response.json()
        console.log("[v0] Job created successfully:", data)

        const newJob: PrintJob = {
          id: data.id,
          jobName: data.job_name,
          description: data.description,
          quantity: data.quantity_ordered,
          quantityPrinted: data.quantity_printed,
          rate: parseFloat(data.rate_per_unit),
          amount: calculateAmount(parseFloat(data.rate_per_unit), data.quantity_ordered),
          status: deriveStatus(data.quantity_printed, data.quantity_ordered),
          createdAt: data.created_at,
          batches: data.batches || [],
        }

        setJobs((prev) => [newJob, ...prev])
      } catch (error) {
        console.error("[v0] Error creating job:", error)
        throw error
      }
    },
    []
  )

  const updateProgress = useCallback(async (id: string, quantityPrinted: number) => {
    try {
      const job = jobs.find((j) => j.id === id)
      if (!job) return

      const batchAdded = quantityPrinted - job.quantityPrinted

      const response = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobName: job.jobName,
          description: job.description,
          quantity: job.quantity,
          quantityPrinted: Math.min(quantityPrinted, job.quantity),
          rate: job.rate,
          newBatch: batchAdded,
        }),
      })

      if (!response.ok) throw new Error("Failed to update job")
      const data = await response.json()

      const updatedJob: PrintJob = {
        id: data.id,
        jobName: data.job_name,
        description: data.description,
        quantity: data.quantity_ordered,
        quantityPrinted: data.quantity_printed,
        rate: parseFloat(data.rate_per_unit),
        amount: calculateAmount(parseFloat(data.rate_per_unit), data.quantity_ordered),
        status: deriveStatus(data.quantity_printed, data.quantity_ordered),
        createdAt: data.created_at,
        batches: data.batches || [],
      }

      setJobs((prev) => prev.map((j) => (j.id === id ? updatedJob : j)))
      toast.success(`${updatedJob.jobName} updated`, {
        description: `Added ${batchAdded} units to batch`,
      })
    } catch (error) {
      console.error("[v0] Error updating job:", error)
      toast.error("Failed to update job")
      throw error
    }
  }, [jobs])

  const updateJob = useCallback(
    async (
      id: string,
      jobName: string,
      description: string,
      rate: number,
      quantity: number
    ) => {
      try {
        const job = jobs.find((j) => j.id === id)
        if (!job) return

        const response = await fetch(`/api/jobs/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobName,
            description,
            quantity,
            quantityPrinted: job.quantityPrinted,
            rate,
          }),
        })

      if (!response.ok) throw new Error("Failed to update job")
      const data = await response.json()

      const updatedJob: PrintJob = {
        id: data.id,
        jobName: data.job_name,
        description: data.description,
        quantity: data.quantity_ordered,
        quantityPrinted: data.quantity_printed,
        rate: parseFloat(data.rate_per_unit),
        amount: calculateAmount(parseFloat(data.rate_per_unit), data.quantity_ordered),
        status: deriveStatus(data.quantity_printed, data.quantity_ordered),
        createdAt: data.created_at,
        batches: data.batches || [],
      }

      setJobs((prev) => prev.map((j) => (j.id === id ? updatedJob : j)))
      toast.success(`${updatedJob.jobName} updated`, {
        description: "Job details have been updated",
      })
    } catch (error) {
      console.error("[v0] Error updating job:", error)
      toast.error("Failed to update job")
      throw error
    }
  }, [jobs])

  const deleteJob = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete job")
      setJobs((prev) => prev.filter((j) => j.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting job:", error)
      throw error
    }
  }, [])

  const stats = {
    totalJobs: jobs.length,
    inProgress: jobs.filter((j) => j.status === "in_progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    totalRevenue: jobs.reduce((acc, j) => acc + j.amount, 0),
  }

  return { jobs, isLoading, isLoaded, addJob, updateProgress, updateJob, deleteJob, stats }
}
