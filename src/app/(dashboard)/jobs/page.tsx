import { Topbar } from "@/components/layout/topbar";
import { AddJobDialog } from "@/components/jobs/add-job-dialog";
import { JobCard } from "@/components/jobs/job-card";
import { getJobs } from "@/actions/jobs";

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <>
      <Topbar title="Jobs" />
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <AddJobDialog />
        </div>
        {jobs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No jobs added yet. Add a job to get started with AI matching.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
