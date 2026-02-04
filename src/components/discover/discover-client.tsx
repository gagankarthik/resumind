"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { discoverJobs } from "@/actions/discover";
import { DiscoverJobCard } from "./discover-job-card";
import { DiscoverSkeleton } from "./discover-skeleton";
import type { DiscoveredJob } from "@/types/database";
import { toast } from "sonner";

type State = "idle" | "loading" | "results" | "error";

export function DiscoverClient() {
  const [state, setState] = useState<State>("idle");
  const [jobs, setJobs] = useState<DiscoveredJob[]>([]);
  const [error, setError] = useState<string>("");

  async function handleDiscover() {
    setState("loading");
    setError("");

    const result = await discoverJobs();

    if (result.error) {
      setError(result.error);
      setState("error");
      toast.error(result.error);
    } else if (result.jobs && result.jobs.length > 0) {
      setJobs(result.jobs);
      setState("results");
    } else {
      setError("No job suggestions found. Please try again.");
      setState("error");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          AI-powered job discovery based on your resume skills and experience.
        </p>
        <Button onClick={handleDiscover} disabled={state === "loading"}>
          <Sparkles className="mr-2 size-4" />
          {state === "loading" ? "Discovering..." : "Discover Jobs"}
        </Button>
      </div>

      {state === "loading" && <DiscoverSkeleton />}

      {state === "error" && (
        <p className="text-center text-muted-foreground py-8">{error}</p>
      )}

      {state === "results" && (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job, i) => (
            <DiscoverJobCard key={`${job.company}-${job.role}-${i}`} job={job} />
          ))}
        </div>
      )}

      {state === "idle" && (
        <p className="text-center text-muted-foreground py-8">
          Click &quot;Discover Jobs&quot; to get AI-powered job suggestions tailored to your resume.
        </p>
      )}
    </div>
  );
}
