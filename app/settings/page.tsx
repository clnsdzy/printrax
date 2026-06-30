import { redirect } from "next/navigation"
import { SettingsPage } from "@/components/settings-page"
import { createClient } from "@/lib/supabase/server"

export default async function Settings() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <SettingsPage />
}
