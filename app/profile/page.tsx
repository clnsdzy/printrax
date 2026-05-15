import { redirect } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

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

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const metadata = user.user_metadata ?? {}

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              View your account details.
            </p>
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
                  <dd className="mt-1 text-lg font-semibold">
                    {getDisplayName(metadata)}
                  </dd>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Email
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {user.email ?? "Not available"}
                  </dd>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <dt className="text-sm font-medium text-muted-foreground">
                    User ID
                  </dt>
                  <dd className="mt-1 break-all text-lg font-semibold">
                    {user.id}
                  </dd>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Account Created
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {formatDate(user.created_at)}
                  </dd>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Last Sign In
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {formatDate(user.last_sign_in_at)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
