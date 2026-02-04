import { Topbar } from "@/components/layout/topbar";
import { ApplicationTable } from "@/components/applications/application-table";
import { AddApplicationDialog } from "@/components/applications/add-application-dialog";
import { getApplications } from "@/actions/applications";
import { getJobs } from "@/actions/jobs";
import { getResumes } from "@/actions/resumes";

export default async function ApplicationsPage() {
  const [applications, jobs, resumes] = await Promise.all([
    getApplications(),
    getJobs(),
    getResumes(),
  ]);

  return (
    <>
      <Topbar title="Applications" />
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <AddApplicationDialog jobs={jobs} resumes={resumes} />
        </div>
        <ApplicationTable applications={applications} />
      </div>
    </>
  );
}
