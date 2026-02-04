import { Topbar } from "@/components/layout/topbar";
import { ReminderList } from "@/components/reminders/reminder-list";
import { AddReminderDialog } from "@/components/reminders/add-reminder-dialog";
import { getReminders } from "@/actions/reminders";
import { getApplications } from "@/actions/applications";

export default async function RemindersPage() {
  const [reminders, applications] = await Promise.all([
    getReminders(),
    getApplications(),
  ]);

  return (
    <>
      <Topbar title="Reminders" />
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <AddReminderDialog applications={applications} />
        </div>
        <ReminderList reminders={reminders} />
      </div>
    </>
  );
}
