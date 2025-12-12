"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import GenerationStatusIndicator from "@/components/generation/generation-status-indicator"
import { postGenerate, saveCoverLetter } from "@/lib/api-client"
import { toast } from "sonner"

export default function GeneratePage() {
  const [jobDesc, setJobDesc] = useState("")
  const [instructions, setInstructions] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [versions, setVersions] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("0")

  async function generate() {
    if (!jobDesc) return
    setIsGenerating(true)

    try {
      const cvName =
        typeof window !== "undefined"
          ? localStorage.getItem("cv_filename")
          : null

      const res = await postGenerate({
        job_description: jobDesc,
        instructions,
      })

      setVersions((prev) => {
        const next = [...prev, res.data.content]
        setActiveTab(String(next.length - 1))
        return next
      })
    } catch {
      toast.error("Failed to generate cover letter")
    } finally {
      setIsGenerating(false)
    }
  }

  async function save() {
    setIsSaving(true)
    try {
      await saveCoverLetter({
        content: versions[Number(activeTab)],
        version: Number(activeTab) + 1,
      })
      toast.success("Cover letter saved")
    } catch {
      toast.error("Save failed")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="grid grid-cols-2 gap-8 p-8 max-w-6xl mx-auto">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          CV uploaded:{" "}
          <strong>{typeof window !== "undefined" && localStorage.getItem("cv_filename")}</strong>
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Job Description *
          </label>
          <Textarea
            className="bg-muted/40 border border-input focus-visible:ring-1 focus-visible:ring-primary"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={8}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Optional instructions
          </label>
          <Textarea
            className="bg-muted/40 border border-input focus-visible:ring-1 focus-visible:ring-primary"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
          />
        </div>

        <Button
          onClick={generate}
          disabled={!jobDesc || isGenerating}
        >
          {versions.length === 0
            ? "Generate Cover Letter"
            : "Regenerate"}
        </Button>
      </div>

      <Card className="p-6 min-h-[400px]">
        {isGenerating ? (
          <GenerationStatusIndicator />
        ) : versions.length === 0 ? (
          <p className="text-muted-foreground text-center mt-20">
            Your generated cover letter will appear here.
          </p>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              {versions.map((_, i) => (
                <TabsTrigger
                  key={i}
                  value={String(i)}
                >
                  Version {i + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {versions.map((text, i) => (
              <TabsContent
                key={i}
                value={String(i)}
              >
                <div className="space-y-4">
                  <pre className="whitespace-pre-wrap">
                    {text}
                  </pre>
                  <Button
                    onClick={save}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </Card>
    </main>
  )
}
