"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().min(1, "Due date is required"),
  application_id: z.string().uuid().optional().or(z.literal("")),
});

export async function getReminders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("reminders")
    .select("*, application:applications(*, job:jobs(title, company))")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  return data ?? [];
}

export async function createReminder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const result = reminderSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    due_date: formData.get("due_date"),
    application_id: formData.get("application_id"),
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { error } = await supabase.from("reminders").insert({
    user_id: user.id,
    title: result.data.title,
    description: result.data.description || null,
    due_date: result.data.due_date,
    application_id: result.data.application_id || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/reminders");
  return { success: true };
}

export async function toggleReminder(reminderId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("reminders")
    .update({ is_completed: isCompleted })
    .eq("id", reminderId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/reminders");
  return { success: true };
}

export async function deleteReminder(reminderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("reminders")
    .delete()
    .eq("id", reminderId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/reminders");
  return { success: true };
}
