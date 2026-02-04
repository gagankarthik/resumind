import { Topbar } from "@/components/layout/topbar";
import { UploadDropzone } from "@/components/resumes/upload-dropzone";
import { ParsedResumeCard } from "@/components/resumes/parsed-resume-card";
import { getResumes } from "@/actions/resumes";

export default async function ResumesPage() {
  const resumes = await getResumes();

  return (
    <>
      <Topbar title="Resumes" />
      <div className="p-6 space-y-6">
        <UploadDropzone />
        {resumes.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No resumes uploaded yet. Upload a PDF to get started.
          </p>
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
