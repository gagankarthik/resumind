"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import openai from "@/lib/openai";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  url: z.string().url().optional().or(z.literal("")),
});

export async function getJobs() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function createJob(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const result = jobSchema.safeParse({
    title: formData.get("title"),
    company: formData.get("company"),
    location: formData.get("location"),
    description: formData.get("description"),
    url: formData.get("url"),
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { error } = await supabase.from("jobs").insert({
    user_id: user.id,
    title: result.data.title,
    company: result.data.company,
    location: result.data.location || null,
    description: result.data.description,
    url: result.data.url || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/jobs");
  return { success: true };
}

export async function deleteJob(jobId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/jobs");
  return { success: true };
}

export async function scoreJobMatch(jobId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Get the job
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", user.id)
    .single();

  if (!job) return { error: "Job not found" };

  // Get the most recent resume
  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!resume) return { error: "No resume found. Upload a resume first." };

  const parsed = resume.parsed_data as { skills?: string[]; experience?: { title: string; company: string; description: string }[] } | null;
  const skills = parsed?.skills?.join(", ") || "No skills found";
  const experience =
    parsed?.experience
      ?.map(
        (e: { title: string; company: string; description: string }) =>
          `${e.title} at ${e.company}: ${e.description}`
      )
      .join("\n") || "No experience found";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a job-resume matching expert. Score how well the candidate matches the job.
Return JSON: { "score": number (0-100), "reasoning": string (2-3 sentences) }`,
      },
      {
        role: "user",
        content: `JOB:\nTitle: ${job.title}\nCompany: ${job.company}\nDescription: ${job.description}\n\nCANDIDATE SKILLS: ${skills}\n\nCANDIDATE EXPERIENCE:\n${experience}`,
      },
    ],
  });

  const result = JSON.parse(completion.choices[0].message.content || "{}");

  await supabase
    .from("jobs")
    .update({
      match_score: result.score,
      match_reasoning: result.reasoning,
    })
    .eq("id", jobId);

  revalidatePath("/jobs");
  return { score: result.score, reasoning: result.reasoning };
}
