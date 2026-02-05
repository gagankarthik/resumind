import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CalendarDays, Bell } from "lucide-react";
import type { Reminder } from "@/types/database";
import { format, isPast, isToday } from "date-fns";

export function UpcomingReminders({
  reminders,
}: {
  reminders: Reminder[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upcoming Reminders</CardTitle>
        <CardDescription>Don&apos;t forget to follow up</CardDescription>
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Bell className="mb-2 size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No upcoming reminders. You&apos;re all caught up.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {reminders.map((reminder) => {
              const dueDate = new Date(reminder.due_date);
              const overdue = isPast(dueDate) && !isToday(dueDate);

              return (
                <div
                  key={reminder.id}
                  className={`flex items-start gap-2 rounded-md px-2 py-2.5 text-sm transition-colors hover:bg-muted/50 ${
                    overdue ? "border-l-2 border-l-destructive" : ""
                  }`}
                >
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{reminder.title}</p>
                    <p
                      className={
                        overdue
                          ? "text-destructive font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {overdue ? "Overdue: " : ""}
                      {format(dueDate, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
