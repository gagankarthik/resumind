"use server";

import { createClient } from "@/lib/supabase/server";
import openai from "@/lib/openai";
import type { DiscoveredJob } from "@/types/database";

export async function discoverJobs(): Promise<{
  jobs?: DiscoveredJob[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Get the most recent resume
  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!resume) return { error: "No resume found. Upload a resume first." };

  const parsed = resume.parsed_data as {
    skills?: string[];
    experience?: { title: string; company: string; description: string }[];
    education?: { degree: string; institution: string; year: string }[];
  } | null;

  const skills = parsed?.skills?.join(", ") || "No skills found";
  const experience =
    parsed?.experience
      ?.map(
        (e) => `${e.title} at ${e.company}: ${e.description}`
      )
      .join("\n") || "No experience found";
  const education =
    parsed?.education
      ?.map((e) => `${e.degree} from ${e.institution} (${e.year})`)
      .join("\n") || "No education found";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a career advisor and job market expert. Based on the candidate's resume, generate 8 realistic job listings that would be a good fit. Return diverse results across different companies and seniority levels.

Return JSON: { "jobs": [{ "company": string, "role": string, "location": string (city, state or "Remote"), "salary_range": string (e.g. "$120k - $160k"), "match_score": number (0-100), "match_reasoning": string (1-2 sentences why this is a good match), "description": string (a realistic 4-6 sentence job description including responsibilities and requirements), "source": string (one of "LinkedIn", "Indeed", "Glassdoor") }] }

Make the jobs realistic and varied - include a mix of companies (well-known and mid-size), locations, and salary ranges appropriate for the candidate's experience level. Each job should have a unique company.`,
      },
      {
        role: "user",
        content: `CANDIDATE SKILLS: ${skills}\n\nCANDIDATE EXPERIENCE:\n${experience}\n\nCANDIDATE EDUCATION:\n${education}`,
      },
    ],
  });

  const result = JSON.parse(completion.choices[0].message.content || "{}");

  if (!result.jobs || !Array.isArray(result.jobs)) {
    return { error: "Failed to generate job suggestions. Please try again." };
  }

  const enrichedJobs: DiscoveredJob[] = result.jobs.map(
    (job: {
      company: string;
      role: string;
      location: string;
      salary_range: string;
      match_score: number;
      match_reasoning: string;
      description: string;
      source: string;
    }) => ({
      ...job,
      search_url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.role + " " + job.company)}`,
    })
  );

  return { jobs: enrichedJobs };
}
