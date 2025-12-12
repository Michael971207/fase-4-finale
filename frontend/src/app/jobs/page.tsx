"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { nanoid } from "nanoid"

type Job = {
  id: string
  title: string
  advertisement: string
  createdAt: number
}

export default function JobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [title, setTitle] = useState("")
  const [advertisement, setAdvertisement] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("job_applications")
    if (stored) setJobs(JSON.parse(stored))
  }, [])

  function saveJobs(next: Job[]) {
    setJobs(next)
    localStorage.setItem("job_applications", JSON.stringify(next))
  }

  function addJob() {
    if (!title || !advertisement) return

    const job: Job = {
      id: nanoid(),
      title,
      advertisement,
      createdAt: Date.now(),
    }

    saveJobs([...jobs, job])
    setTitle("")
    setAdvertisement("")
  }

  function selectJob(id: string) {
    localStorage.setItem("active_job_id", id)
    router.push("/generate")
  }

  function deleteJob(id: string) {
    saveJobs(jobs.filter(j => j.id !== id))
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-4xl p-6 space-y-6">
        <h1 className="text-xl font-semibold text-center">
          Job Applications
        </h1>

        <Input
          placeholder="Job title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Job advertisement"
          value={advertisement}
          onChange={(e) => setAdvertisement(e.target.value)}
          rows={6}
        />

        <Button onClick={addJob}>
          Add job
        </Button>

        {jobs.map(job => (
          <div key={job.id} className="border p-3 rounded">
            <strong>{job.title}</strong>
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => selectJob(job.id)}>
                Use
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteJob(job.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </main>
  )
}
