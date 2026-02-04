"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, DollarSign, ExternalLink, Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import type { DiscoveredJob } from "@/types/database";
import { createJob } from "@/actions/jobs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DiscoverJobCard({ job }: { job: DiscoveredJob }) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    const formData = new FormData();
    formData.set("title", job.role);
    formData.set("company", job.company);
    formData.set("location", job.location);
    formData.set("description", job.description);
    formData.set("url", job.search_url);

    const result = await createJob(formData);
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Saved "${job.role}" to your jobs`);
      setSaved(true);
      router.refresh();
    }
  }

  const scoreColor =
    job.match_score >= 70
      ? "text-green-600"
      : job.match_score >= 40
        ? "text-yellow-600"
        : "text-red-600";

  const scoreBadgeVariant =
    job.match_score >= 70
      ? "default"
      : job.match_score >= 40
        ? "secondary"
        : "destructive";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{job.role}</CardTitle>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
          <Badge variant="outline">{job.source}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="size-3.5" />
            {job.salary_range}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Match</span>
            <Badge variant={scoreBadgeVariant} className={scoreColor}>
              {job.match_score}%
            </Badge>
          </div>
          <Progress value={job.match_score} />
          <p className="text-xs text-muted-foreground">{job.match_reasoning}</p>
        </div>

        <div>
          <p className={`text-sm ${expanded ? "" : "line-clamp-3"}`}>
            {job.description}
          </p>
          <Button
            variant="ghost"
            size="xs"
            className="mt-1 h-auto p-0 text-xs text-muted-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-1 size-3" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 size-3" />
                Show full JD
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={job.search_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1 size-3.5" />
              View on {job.source}
            </a>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || saved}
          >
            <Bookmark className="mr-1 size-3.5" />
            {saved ? "Saved" : saving ? "Saving..." : "Save to Jobs"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
