"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trash2, Sparkles, ExternalLink, MapPin, Loader2 } from "lucide-react";
import type { Job } from "@/types/database";
import { deleteJob, scoreJobMatch } from "@/actions/jobs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function JobCard({ job }: { job: Job }) {
  const router = useRouter();
  const [scoring, setScoring] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const initial = job.company.charAt(0).toUpperCase();

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    const result = await deleteJob(job.id);
    setDeleting(false);
    setConfirmDelete(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Job deleted");
      router.refresh();
    }
  }

  async function handleScore() {
    setScoring(true);
    const result = await scoreJobMatch(job.id);
    setScoring(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Match score: ${result.score}%`);
      router.refresh();
    }
  }

  const scoreColor =
    job.match_score !== null
      ? job.match_score >= 70
        ? "text-chart-2"
        : job.match_score >= 40
          ? "text-chart-4"
          : "text-destructive"
      : "";

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              {initial}
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base">{job.title}</CardTitle>
              <CardDescription>{job.company}</CardDescription>
            </div>
          </div>
          <div className="flex shrink-0 gap-1">
            {job.url && (
              <Button variant="ghost" size="icon" asChild>
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            )}
            <Button
              variant={confirmDelete ? "destructive" : "ghost"}
              size={confirmDelete ? "sm" : "icon"}
              onClick={handleDelete}
              onBlur={() => setConfirmDelete(false)}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : confirmDelete ? (
                "Confirm"
              ) : (
                <Trash2 className="size-4 text-destructive" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {job.location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3" /> {job.location}
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>

        {job.match_score !== null ? (
          <div className="space-y-1.5 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Match Score</span>
              <span className={`text-lg font-bold ${scoreColor}`}>
                {job.match_score}%
              </span>
            </div>
            <Progress value={job.match_score} />
            {job.match_reasoning && (
              <p className="text-xs text-muted-foreground">
                {job.match_reasoning}
              </p>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleScore}
            disabled={scoring}
            className="w-full"
          >
            {scoring ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 size-4" />
            )}
            {scoring ? "Scoring..." : "AI Match Score"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
