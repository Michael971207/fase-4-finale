import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const {
    job_description,
    instructions,
    cv_context,
    variant,
  } = await req.json()

  const content = `
Dear Hiring Manager,

I am writing to apply for the position described as "${job_description}". Based on my background and professional experience outlined in my CV, I believe I am a strong candidate for this role.

My experience includes relevant technical and professional skills that align well with the requirements of the position. I have worked extensively with technologies and methodologies that enable me to deliver high-quality results, take ownership of my work and contribute effectively to team-based environments.

${instructions ? `In particular, my experience with ${instructions} allows me to quickly adapt and add value in this role.` : ""}

I am motivated, structured and solution-oriented, and I thrive in environments where continuous improvement and responsibility are valued. I am confident that my background and mindset would allow me to make a positive contribution to your organization.

I would welcome the opportunity to further discuss how my skills and experience can support your team.

Kind regards,  
Abdullah Michael Moulay
`.trim()

  return NextResponse.json({
    data: {
      content,
    },
  })
}
