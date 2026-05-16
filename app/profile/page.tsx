"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditNameModal } from "@/components/edit-name-modal"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeftIcon, PencilEdit02Icon } from "@hugeicons/core-free-icons"
import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

function formatDate(value?: string) {
  if (!value) {
    return "Not available"
  }

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function getDisplayName(metadata: Record<string, unknown>) {
  const name =
    metadata.first_name ??
    metadata.firstName ??
    metadata.name ??
    metadata.full_name

  return typeof name === "string" && name.trim() ? name.trim() : "Not set"
}

function getLastSixDigits(userId: string): string {
  return userId.slice(-6)
}

export default function ProfilePage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState<string>("Not set")
  const [email, setEmail] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [createdAt, setCreatedAt] = useState<string>("")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const metadata = user.user_metadata ?? {}
      setDisplayName(getDisplayName(metadata))
      setEmail(user.email ?? "Not available")
      setUserId(user.id)
      setCreatedAt(formatDate(user.created_at))
      setIsLoading(false)
    }

    void fetchUser()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                View your account details.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <HugeiconsIcon icon={ArrowLeftIcon} size={16} data-icon="inline-start" />
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-6 sm:grid-cols-2">
                <div className="border-l-2 border-primary pl-4">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Name
                  </dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-semibold">{displayName}</span>
                    <button
                      onClick={() => setIsEditOpen(true)}
                      className="rounded hover:bg-muted p-1"
                      aria-label="Edit name"
                    >
                      <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
                    </button>
                  </dd>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Email
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {email}
                  </dd>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <dt className="text-sm font-medium text-muted-foreground">
                    User ID
                  </dt>
                  <dd className="mt-1 break-all text-lg font-semibold">
                    {getLastSixDigits(userId)}
                  </dd>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Account Created
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {createdAt}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </main>

      <EditNameModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        currentName={displayName}
        onNameUpdated={setDisplayName}
      />
    </div>
  )
}
