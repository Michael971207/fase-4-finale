"use client"

import { Loader2 } from "lucide-react"

export default function GenerationStatusIndicator() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16"
      aria-live="polite"
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">
        Please give us an A
      </span>
      <span className="sr-only">Generating cover letter...</span>
    </div>
  )
}
