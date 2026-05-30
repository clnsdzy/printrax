export type JobStatus = "not_started" | "in_progress" | "completed"

export interface PrintJob {
  id: string
  jobName: string
  description: string
  rate: number
  quantity: number
  quantityPrinted: number
  amount: number
  status: JobStatus
  createdAt: string
  batches: number[]
  packs: number
  qtyPerPack: number
}

export function deriveStatus(quantityPrinted: number, quantity: number): JobStatus {
  if (quantityPrinted === 0) return "not_started"
  if (quantityPrinted >= quantity) return "completed"
  return "in_progress"
}

export function calculateAmount(rate: number, quantity: number): number {
  return rate * quantity
}
