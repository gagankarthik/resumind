import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/types/database";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; dotColor: string }
> = {
  applied: { label: "Applied", variant: "secondary", dotColor: "bg-muted-foreground" },
  screening: { label: "Screening", variant: "outline", dotColor: "bg-chart-4" },
  interview: { label: "Interview", variant: "default", dotColor: "bg-chart-1" },
  offer: { label: "Offer", variant: "default", dotColor: "bg-chart-2" },
  rejected: { label: "Rejected", variant: "destructive", dotColor: "bg-destructive" },
  withdrawn: { label: "Withdrawn", variant: "outline", dotColor: "bg-muted-foreground" },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className="gap-1.5">
      <span className={`size-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </Badge>
  );
}
