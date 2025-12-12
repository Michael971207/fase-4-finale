"use client"

import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type SaveState = "default" | "unsaved" | "saved"

interface StatefulTextboxProps {
  value: string
  onChange: (value: string) => void
  saveState: SaveState
  label: string
}

export function StatefulTextbox({
  value,
  onChange,
  saveState,
  label,
}: StatefulTextboxProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "transition-colors",
          saveState === "unsaved" &&
            "border-yellow-500 focus-visible:ring-yellow-500",
          saveState === "saved" &&
            "border-green-500 focus-visible:ring-green-500"
        )}
      />

      <div aria-live="polite" className="sr-only">
        {saveState === "unsaved" && "You have unsaved changes"}
        {saveState === "saved" && "All changes saved"}
      </div>
    </div>
  )
}
