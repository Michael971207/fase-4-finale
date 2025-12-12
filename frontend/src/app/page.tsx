import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="border rounded-lg p-8 text-center space-y-4">
        <h1 className="text-3xl font-bold">CVAI Turbo v2</h1>
        <p className="text-muted-foreground">
          Refined Minimalist · Innovator Theme
        </p>

        <Button asChild>
          <Link href="/login">
            Generate Cover Letter
          </Link>
        </Button>
      </div>
    </main>
  )
}
