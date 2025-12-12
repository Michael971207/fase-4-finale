export async function postGenerate(payload: {
  job_description: string
  instructions?: string
}) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error("Generate failed")
  }

  return res.json()
}

export async function saveCoverLetter(payload: {
  content: string
  version: number
}) {
  // midlertidig mock
  console.log("Saving cover letter:", payload)
}
