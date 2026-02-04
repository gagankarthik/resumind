"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, CalendarDays } from "lucide-react";
import type { Reminder } from "@/types/database";
import { toggleReminder, deleteReminder } from "@/actions/reminders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format, isPast, isToday } from "date-fns";

export function ReminderList({ reminders }: { reminders: Reminder[] }) {
  const router = useRouter();

  async function handleToggle(id: string, checked: boolean) {
    const result = await toggleReminder(id, checked);
    if (result.error) toast.error(result.error);
    else router.refresh();
  }

  async function handleDelete(id: string) {
    const result = await deleteReminder(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Reminder deleted");
      router.refresh();
    }
  }

  if (reminders.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No reminders yet. Add one to stay on track.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reminders.map((reminder) => {
        const dueDate = new Date(reminder.due_date);
        const overdue = isPast(dueDate) && !isToday(dueDate) && !reminder.is_completed;

        return (
          <Card
            key={reminder.id}
            className={reminder.is_completed ? "opacity-60" : ""}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={reminder.is_completed}
                  onCheckedChange={(checked) =>
                    handleToggle(reminder.id, checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <CardTitle
                    className={`text-base ${reminder.is_completed ? "line-through" : ""}`}
                  >
                    {reminder.title}
                  </CardTitle>
                  {reminder.description && (
                    <CardDescription>{reminder.description}</CardDescription>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(reminder.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pl-10">
              <div className="flex items-center gap-4 text-sm">
                <span
                  className={`flex items-center gap-1 ${overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}
                >
                  <CalendarDays className="size-3" />
                  {overdue ? "Overdue: " : ""}
                  {format(dueDate, "MMM d, yyyy")}
                </span>
                {reminder.application?.job && (
                  <span className="text-muted-foreground">
                    {reminder.application.job.title} at{" "}
                    {reminder.application.job.company}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
