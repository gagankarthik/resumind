import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
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
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming reminders.</p>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => {
              const dueDate = new Date(reminder.due_date);
              const overdue = isPast(dueDate) && !isToday(dueDate);

              return (
                <div key={reminder.id} className="flex items-start gap-2 text-sm">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{reminder.title}</p>
                    <p
                      className={
                        overdue
                          ? "text-destructive"
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
