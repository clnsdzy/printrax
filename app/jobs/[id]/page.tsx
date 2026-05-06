import { redirect } from "next/navigation"
import { JobDetailPageClient } from "@/components/job-detail-page"
import { createClient } from "@/lib/supabase/server"

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <JobDetailPageClient jobId={id} />
}
