import { Topbar } from "@/components/layout/topbar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { UpcomingReminders } from "@/components/dashboard/upcoming-reminders";
import { SkillsOverview } from "@/components/dashboard/skills-overview";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [
    { data: applications },
    { data: reminders },
    { data: skills },
  ] = await Promise.all([
    supabase
      .from("applications")
      .select("*, job:jobs(title, company)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_completed", false)
      .order("due_date", { ascending: true })
      .limit(5),
    supabase
      .from("parsed_skills")
      .select("skill_name")
      .eq("user_id", user.id),
  ]);

  const allApps = applications ?? [];
  const allReminders = reminders ?? [];
  const allSkills = [...new Set((skills ?? []).map((s) => s.skill_name))];

  // Compute stats from all applications (need full count)
  const { count: totalApps } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: interviewCount } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "interview");

  const { count: offerCount } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "offer");

  const { count: reminderCount } = await supabase
    .from("reminders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_completed", false);

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-6 space-y-6">
        <StatsCards
          stats={{
            totalApplications: totalApps ?? 0,
            interviews: interviewCount ?? 0,
            offers: offerCount ?? 0,
            pendingReminders: reminderCount ?? 0,
          }}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <RecentApplications applications={allApps} />
          <UpcomingReminders reminders={allReminders} />
        </div>
        <SkillsOverview skills={allSkills} />
      </div>
    </>
  );
}
