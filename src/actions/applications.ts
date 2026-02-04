"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ApplicationStatus } from "@/types/database";

const applicationSchema = z.object({
  job_id: z.string().uuid(),
  resume_id: z.string().uuid().optional().or(z.literal("")),
  status: z.enum([
    "applied",
    "screening",
    "interview",
    "offer",
    "rejected",
    "withdrawn",
  ]),
  applied_date: z.string().min(1, "Applied date is required"),
  notes: z.string().optional(),
});

export async function getApplications() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("applications")
    .select("*, job:jobs(*), resume:resumes(id, file_name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function createApplication(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const result = applicationSchema.safeParse({
    job_id: formData.get("job_id"),
    resume_id: formData.get("resume_id"),
    status: formData.get("status"),
    applied_date: formData.get("applied_date"),
    notes: formData.get("notes"),
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { error } = await supabase.from("applications").insert({
    user_id: user.id,
    job_id: result.data.job_id,
    resume_id: result.data.resume_id || null,
    status: result.data.status,
    applied_date: result.data.applied_date,
    notes: result.data.notes || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/applications");
  return { success: true };
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", applicationId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/applications");
  return { success: true };
}

export async function deleteApplication(applicationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", applicationId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/applications");
  return { success: true };
}
