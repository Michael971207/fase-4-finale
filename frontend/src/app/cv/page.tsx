"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CvPage() {
  const router = useRouter()

  const [profile, setProfile] = useState("")
  const [content, setContent] = useState("")
  const [instructions, setInstructions] = useState("")

  useEffect(() => {
    setProfile(localStorage.getItem("cv_profile") || "")
    setContent(localStorage.getItem("cv_content") || "")
    setInstructions(localStorage.getItem("cv_instructions") || "")
  }, [])

  function saveCv() {
    localStorage.setItem("cv_profile", profile)
    localStorage.setItem("cv_content", content)
    localStorage.setItem("cv_instructions", instructions)
    toast.success("CV saved")
  }

  function deleteCv() {
    localStorage.removeItem("cv_profile")
    localStorage.removeItem("cv_content")
    localStorage.removeItem("cv_instructions")
    setProfile("")
    setContent("")
    setInstructions("")
    toast.success("CV deleted")
  }

  function continueFlow() {
    if (!content) {
      toast.error("CV content is required")
      return
    }
    router.push("/jobs")
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-4xl p-6 space-y-6">
        <h1 className="text-xl font-semibold text-center">Your CV</h1>

        <Textarea
          placeholder="Profile – short professional summary"
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          rows={3}
        />

        <Textarea
          placeholder="CV content (experience, education, skills)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        />

        <Textarea
          placeholder="Instructions (tone, style, focus)"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={3}
        />

        <div className="flex gap-3">
          <Button onClick={saveCv}>Save</Button>
          <Button variant="destructive" onClick={deleteCv}>Delete</Button>
          <Button className="ml-auto" onClick={continueFlow}>
            Continue
          </Button>
        </div>
      </Card>
    </main>
  )
}
