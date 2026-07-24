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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface EditJobModalProps {
  job: PrintJob | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (
    id: string,
    jobName: string,
    description: string,
    rate: number,
    quantity: number,
    packs: number,
    qtyPerPack: number
  ) => void
  onReset: (id: string) => Promise<void>
}

export function EditJobModal({
  job,
  open,
  onOpenChange,
  onSubmit,
  onReset,
}: EditJobModalProps) {
  const [jobName, setJobName] = useState("")
  const [description, setDescription] = useState("")
  const [rate, setRate] = useState("")
  const [packs, setPacks] = useState("")
  const [qtyPerPack, setQtyPerPack] = useState("")
  const [validationMessage, setValidationMessage] = useState("")
  const [resetConfirmationOpen, setResetConfirmationOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [resetError, setResetError] = useState("")

  useEffect(() => {
    if (job && open) {
      setJobName(job.jobName)
      setDescription(job.description)
      setRate(job.rate.toString())
      setPacks(job.packs.toString())
      setQtyPerPack(job.qtyPerPack.toString())
      setValidationMessage("")
      setResetConfirmationOpen(false)
      setResetError("")
    }
  }, [job, open])

  const handleReset = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (!job || job.quantityPrinted === 0 || isResetting) return

    setIsResetting(true)
    setResetError("")

    try {
      await onReset(job.id)
      setResetConfirmationOpen(false)
      onOpenChange(false)
    } catch (error) {
      setResetError(
        error instanceof Error ? error.message : "Failed to reset print job."
      )
    } finally {
      setIsResetting(false)
    }
  }

  const calculatedQuantity = parseInt(packs || "0") * parseInt(qtyPerPack || "0")
  const calculatedAmount =
    rate && calculatedQuantity > 0 ? (parseFloat(rate) * calculatedQuantity).toFixed(2) : "0.00"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!job || !rate || !packs || !qtyPerPack || !jobName) return

    const parsedRate = parseFloat(rate)
    const parsedPacks = parseInt(packs)
    const parsedQtyPerPack = parseInt(qtyPerPack)
    const parsedQuantity = parsedPacks * parsedQtyPerPack

    if (parsedRate < 0) {
      setValidationMessage("Rate per unit must be 0 or greater.")
      return
    }

    if (parsedQuantity < job.quantityPrinted) {
      setValidationMessage(
        `Total quantity cannot be less than already printed units (${job.quantityPrinted}).`
      )
      return
    }

    setValidationMessage("")
    onSubmit(
      job.id,
      jobName,
      description,
      parsedRate,
      parsedQuantity,
      parsedPacks,
      parsedQtyPerPack
    )
    onOpenChange(false)
  }

  if (!job) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update the rate per unit and total quantity for this job.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editJobName">Job Name *</Label>
              <Input
                id="editJobName"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editDescription">Description</Label>
              <Input
                id="editDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Current Qty Printed</Label>
              <div className="flex h-9 w-full items-center rounded-md border bg-muted px-3 text-sm">
                {job.quantityPrinted}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editPacks">Packs *</Label>
                <Input
                  id="editPacks"
                  type="number"
                  min="1"
                  value={packs}
                  onChange={(e) => setPacks(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editQtyPerPack">Qty Per Pack *</Label>
                <Input
                  id="editQtyPerPack"
                  type="number"
                  min="1"
                  value={qtyPerPack}
                  onChange={(e) => setQtyPerPack(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Total Quantity</Label>
              <div className="flex h-9 w-full items-center rounded-md border bg-muted px-3 text-sm">
                <span className="text-sm font-medium">{calculatedQuantity}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {packs} packs × {qtyPerPack} per pack = {calculatedQuantity}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editRate">Rate per Unit (N) *</Label>
              <Input
                id="editRate"
                type="number"
                step="0.01"
                min="0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Total Amount</Label>
              <div className="flex h-9 w-full items-center rounded-md border bg-muted px-3 text-sm">
                <span className="inline-flex items-baseline gap-1 text-sm">
                  <span className="text-inherit">₦</span>
                  <span>{calculatedAmount}</span>
                </span>
              </div>
            </div>
            {validationMessage && (
              <p className="text-sm text-destructive">{validationMessage}</p>
            )}
            </div>
            <DialogFooter className="gap-2 sm:justify-between sm:space-x-0">
              <Button
                type="button"
                variant="destructive"
                disabled={job.quantityPrinted === 0}
                onClick={() => setResetConfirmationOpen(true)}
              >
                Reset Print Job
              </Button>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={resetConfirmationOpen}
        onOpenChange={setResetConfirmationOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset this print job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset the total quantity printed for &quot;
              {job.jobName}&quot; from {job.quantityPrinted} to 0. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {resetError && (
            <p role="alert" className="text-sm text-destructive">
              {resetError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>
              Keep Print Total
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                disabled={isResetting}
                onClick={handleReset}
              >
                {isResetting ? "Resetting..." : "Yes, Reset to 0"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
