import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/applications/status-badge";
import type { Application } from "@/types/database";
import { format } from "date-fns";

export function RecentApplications({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No applications yet.</p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium">{app.job?.title ?? "—"}</p>
                  <p className="text-muted-foreground">
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
