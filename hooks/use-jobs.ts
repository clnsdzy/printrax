"use client"

import { useState, useEffect, useCallback } from "react"
import { PrintJob, deriveStatus, calculateAmount } from "@/types/job"

const STORAGE_KEY = "printrax_jobs"

const initialMockJobs: PrintJob[] = [
  {
    id: "1",
    jobName: "Business Cards - ABC Corp",
    description: "Premium matte business cards with gold foil accents for the CEO",
    rate: 2.5,
    quantity: 500,
    quantityPrinted: 0,
    amount: 1250,
    status: "not_started",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "2",
    jobName: "Event Flyers - Music Festival",
    description: "A4 glossy flyers for the upcoming summer music festival event",
    rate: 0.75,
    quantity: 1000,
    quantityPrinted: 650,
    amount: 750,
    status: "in_progress",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "3",
    jobName: "Restaurant Menus - The Bistro",
    description: "Laminated tri-fold menus with updated seasonal dishes and prices",
    rate: 4.0,
    quantity: 100,
    quantityPrinted: 100,
    amount: 400,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "4",
    jobName: "Wedding Invitations - Smith",
    description: "Elegant ivory cardstock invitations with envelope printing",
    rate: 3.0,
    quantity: 200,
    quantityPrinted: 85,
    amount: 600,
    status: "in_progress",
    createdAt: new Date().toISOString(),
  },
]

export function useJobs() {
  const [jobs, setJobs] = useState<PrintJob[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setJobs(JSON.parse(stored))
      } catch {
        setJobs(initialMockJobs)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockJobs))
      }
    } else {
      setJobs(initialMockJobs)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockJobs))
    }
    setIsLoaded(true)
  }, [])

  const saveJobs = useCallback((newJobs: PrintJob[]) => {
    setJobs(newJobs)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newJobs))
  }, [])

  const addJob = useCallback(
    (jobData: { jobName: string; description: string; rate: number; quantity: number }) => {
      const newJob: PrintJob = {
        id: Date.now().toString(),
        jobName: jobData.jobName,
        description: jobData.description,
        rate: jobData.rate,
        quantity: jobData.quantity,
        quantityPrinted: 0,
        amount: calculateAmount(jobData.rate, jobData.quantity),
        status: "not_started",
        createdAt: new Date().toISOString(),
      }
      saveJobs([...jobs, newJob])
    },
    [jobs, saveJobs]
  )

  const updateProgress = useCallback(
    (id: string, quantityPrinted: number) => {
      const updatedJobs = jobs.map((job) => {
        if (job.id === id) {
          const newQuantityPrinted = Math.min(quantityPrinted, job.quantity)
          return {
            ...job,
            quantityPrinted: newQuantityPrinted,
            status: deriveStatus(newQuantityPrinted, job.quantity),
          }
        }
        return job
      })
      saveJobs(updatedJobs)
    },
    [jobs, saveJobs]
  )

  const deleteJob = useCallback(
    (id: string) => {
      saveJobs(jobs.filter((job) => job.id !== id))
    },
    [jobs, saveJobs]
  )

  const stats = {
    totalJobs: jobs.length,
    inProgress: jobs.filter((j) => j.status === "in_progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    totalRevenue: jobs.reduce((acc, j) => acc + j.amount, 0),
  }

  return { jobs, isLoaded, addJob, updateProgress, deleteJob, stats }
}
