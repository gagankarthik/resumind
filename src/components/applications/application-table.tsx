"use client";

import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, ClipboardList } from "lucide-react";
import { StatusBadge } from "./status-badge";
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
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    const result = await updateApplicationStatus(id, status);
    if (result.error) {
      toast.error(result.error);
    } else {
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    setDeletingId(id);
    const result = await deleteApplication(id);
    setDeletingId(null);
    setConfirmId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Application deleted");
      router.refresh();
    }
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <ClipboardList className="mb-3 size-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">
          No applications yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add one to start tracking your job search.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile card layout */}
      <div className="space-y-3 md:hidden">
        {applications.map((app) => (
          <Card key={app.id} className="transition-colors hover:bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {app.job?.title ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {app.job?.company ?? "—"}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Applied {format(new Date(app.applied_date), "MMM d, yyyy")}
                </p>
                <div className="flex items-center gap-2">
                  <Select
                    value={app.status}
                    onValueChange={(val) =>
                      handleStatusChange(app.id, val as ApplicationStatus)
                    }
                  >
                    <SelectTrigger className="h-8 w-[120px] text-xs">
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
                  <Button
                    variant={confirmId === app.id ? "destructive" : "ghost"}
                    size="sm"
                    onClick={() => handleDelete(app.id)}
                    onBlur={() => setConfirmId(null)}
                    disabled={deletingId === app.id}
                    className="h-8"
                  >
                    {deletingId === app.id ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : confirmId === app.id ? (
                      "Delete?"
                    ) : (
                      <Trash2 className="size-3 text-destructive" />
                    )}
                  </Button>
                </div>
              </div>
              {app.notes && (
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                  {app.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden rounded-md border md:block">
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
              <TableRow key={app.id} className="group">
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
                    variant={confirmId === app.id ? "destructive" : "ghost"}
                    size={confirmId === app.id ? "sm" : "icon"}
                    onClick={() => handleDelete(app.id)}
                    onBlur={() => setConfirmId(null)}
                    disabled={deletingId === app.id}
                  >
                    {deletingId === app.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : confirmId === app.id ? (
                      "Confirm"
                    ) : (
                      <Trash2 className="size-4 text-destructive opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
