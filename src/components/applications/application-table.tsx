"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Application, ApplicationStatus } from "@/types/database";
import { updateApplicationStatus, deleteApplication } from "@/actions/applications";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const statuses: ApplicationStatus[] = [
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

export function ApplicationTable({
  applications,
}: {
  applications: Application[];
}) {
  const router = useRouter();

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    const result = await updateApplicationStatus(id, status);
    if (result.error) {
      toast.error(result.error);
    } else {
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteApplication(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Application deleted");
      router.refresh();
    }
  }

  if (applications.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No applications yet. Add one to start tracking.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium">
                {app.job?.title ?? "—"}
              </TableCell>
              <TableCell>{app.job?.company ?? "—"}</TableCell>
              <TableCell>
                <Select
                  value={app.status}
                  onValueChange={(val) =>
                    handleStatusChange(app.id, val as ApplicationStatus)
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {format(new Date(app.applied_date), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                {app.notes || "—"}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(app.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
