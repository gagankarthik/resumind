"use client";

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
import { Trash2, Sparkles, ExternalLink, MapPin } from "lucide-react";
import type { Job } from "@/types/database";
import { deleteJob, scoreJobMatch } from "@/actions/jobs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function JobCard({ job }: { job: Job }) {
  const router = useRouter();
  const [scoring, setScoring] = useState(false);

  async function handleDelete() {
    const result = await deleteJob(job.id);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{job.title}</CardTitle>
            <CardDescription>{job.company}</CardDescription>
          </div>
          <div className="flex gap-1">
            {job.url && (
              <Button variant="ghost" size="icon" asChild>
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="size-4 text-destructive" />
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
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Match Score</span>
              <Badge
                variant={
                  job.match_score >= 70
                    ? "default"
                    : job.match_score >= 40
                      ? "secondary"
                      : "destructive"
                }
              >
                {job.match_score}%
              </Badge>
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
            <Sparkles className="mr-2 size-4" />
            {scoring ? "Scoring..." : "AI Match Score"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
