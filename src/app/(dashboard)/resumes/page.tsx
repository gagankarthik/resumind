import { Topbar } from "@/components/layout/topbar";
import { UploadDropzone } from "@/components/resumes/upload-dropzone";
import { ParsedResumeCard } from "@/components/resumes/parsed-resume-card";
import { getResumes } from "@/actions/resumes";
import { FileText } from "lucide-react";

export default async function ResumesPage() {
  const resumes = await getResumes();

  return (
    <>
      <Topbar title="Resumes" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Your Resumes</h2>
            <p className="text-muted-foreground">
              {resumes.length > 0
                ? `${resumes.length} resume${resumes.length !== 1 ? "s" : ""} uploaded`
                : "Upload your resume to get started"}
            </p>
          </div>
        </div>

        <UploadDropzone />

        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <FileText className="mb-3 size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              No resumes uploaded yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload a PDF or DOCX to get AI-powered parsing and skills
              extraction.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {resumes.map((resume) => (
              <ParsedResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
