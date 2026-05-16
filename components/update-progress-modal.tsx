"use client"

import { useState, useEffect } from "react"
import { PrintJob } from "@/types/job"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UpdateProgressModalProps {
  job: PrintJob | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (id: string, quantityPrinted: number) => void
}

export function UpdateProgressModal({
  job,
  open,
  onOpenChange,
  onSubmit,
}: UpdateProgressModalProps) {
  const [newBatch, setNewBatch] = useState("")

  useEffect(() => {
    if (open) {
      setNewBatch("")
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!job || !newBatch) return

    const batchQty = parseInt(newBatch)
    if (batchQty < 0) return

    const newTotalQuantity = job.quantityPrinted + batchQty
    if (newTotalQuantity > job.quantity) return

    onSubmit(job.id, newTotalQuantity)
    onOpenChange(false)
  }

  const remainingQuantity = job ? job.quantity - job.quantityPrinted : 0

  if (!job) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          <DialogDescription>
            Update the number of units printed for this job.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Job Name</Label>
              <div className="flex h-9 w-full items-center rounded-md border bg-muted px-3 text-sm">
                {job.jobName}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Total Quantity</Label>
                <div className="flex h-9 w-full items-center rounded-md border bg-muted px-3 text-sm">
                  {job.quantity}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Current Qty Printed</Label>
                <div className="flex h-9 w-full items-center rounded-md border bg-muted px-3 text-sm">
                  {job.quantityPrinted}
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newBatch">New Batch *</Label>
              <Input
                id="newBatch"
                type="number"
                min="0"
                max={remainingQuantity}
                value={newBatch}
                onChange={(e) => setNewBatch(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Remaining quantity to print: {remainingQuantity}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Progress</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
