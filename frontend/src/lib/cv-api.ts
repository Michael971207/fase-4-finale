import { supabase } from "@/lib/supabase-client"

export type CVContent = {
  education?: string
  work_experience?: string
  skills?: string
}

export async function loadCV(): Promise<CVContent> {
  const { data, error } = await supabase
    .from("cvs")
    .select("content")
    .single()

  // PGRST116 = no rows found (første gang)
  if (error && error.code !== "PGRST116") {
    throw error
  }

  return (data?.content ?? {}) as CVContent
}

export async function saveCV(content: CVContent) {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr || !user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase
    .from("cvs")
    .upsert(
      {
        user_id: user.id,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )

  if (error) throw error
}
