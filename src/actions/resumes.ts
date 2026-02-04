"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getResumes() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function deleteResume(resumeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Get file path for storage deletion
  const { data: resume } = await supabase
    .from("resumes")
    .select("file_path")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();

  if (resume?.file_path) {
    await supabase.storage.from("resumes").remove([resume.file_path]);
  }

  // Delete skills
  await supabase.from("parsed_skills").delete().eq("resume_id", resumeId);

  // Delete resume record
  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", resumeId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/resumes");
  return { success: true };
}
