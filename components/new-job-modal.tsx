"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"

interface NewJobModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    jobName: string
    description: string
    rate: number
    quantity: number
  }) => void
}

export function NewJobModal({ open, onOpenChange, onSubmit }: NewJobModalProps) {
  const [jobName, setJobName] = useState("")
  const [description, setDescription] = useState("")
  const [rate, setRate] = useState("")
  const [quantity, setQuantity] = useState("")

  const calculatedAmount =
    rate && quantity ? (parseFloat(rate) * parseInt(quantity)).toFixed(2) : "0.00"

  useEffect(() => {
    if (!open) {
      setJobName("")
      setDescription("")
      setRate("")
      setQuantity("")
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobName.trim() || !rate || !quantity) return

    onSubmit({
      jobName: jobName.trim(),
      description: description.trim(),
      rate: parseFloat(rate),
      quantity: parseInt(quantity),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Print Job</DialogTitle>
          <DialogDescription>
            Fill in the details for the new print job. Amount will be calculated
            automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="jobName">Job Name *</Label>
              <Input
                id="jobName"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                placeholder="e.g., Business Cards - ABC Corp"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional job description..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rate">Rate per Unit ($) *</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity Ordered *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Total Amount</Label>
              <div className="flex h-9 w-full items-center rounded-md border bg-muted px-3 text-sm">
                ${calculatedAmount}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
