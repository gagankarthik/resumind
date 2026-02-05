import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/applications/status-badge";
import type { Application } from "@/types/database";
import { format } from "date-fns";
import { ClipboardList } from "lucide-react";

export function RecentApplications({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Applications</CardTitle>
        <CardDescription>Your latest tracked applications</CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ClipboardList className="mb-2 size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No applications yet. Start tracking your job search.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-md px-2 py-2.5 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {app.job?.title ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {app.job?.company ?? "—"} &middot;{" "}
                    {format(new Date(app.applied_date), "MMM d")}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
