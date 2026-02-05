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

  const firstName =
    user.user_metadata?.full_name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "there";

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
      .select("skill_name, category")
      .eq("user_id", user.id),
  ]);

  const allApps = applications ?? [];
  const allReminders = reminders ?? [];

  // Deduplicate and group skills by category
  const skillMap = new Map<string, string>();
  for (const s of skills ?? []) {
    if (!skillMap.has(s.skill_name)) {
      skillMap.set(s.skill_name, s.category ?? "Other");
    }
  }
  const categorizedSkills: Record<string, string[]> = {};
  for (const [name, category] of skillMap) {
    if (!categorizedSkills[category]) {
      categorizedSkills[category] = [];
    }
    categorizedSkills[category].push(name);
  }

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
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {firstName}
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your job search progress.
          </p>
        </div>

        <StatsCards
          stats={{
            totalApplications: totalApps ?? 0,
            interviews: interviewCount ?? 0,
            offers: offerCount ?? 0,
            pendingReminders: reminderCount ?? 0,
          }}
        />

        <div>
          <h3 className="mb-3 text-lg font-semibold">Activity</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <RecentApplications applications={allApps} />
            <UpcomingReminders reminders={allReminders} />
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold">Skills Profile</h3>
          <SkillsOverview skillsByCategory={categorizedSkills} />
        </div>
      </div>
    </>
  );
}
