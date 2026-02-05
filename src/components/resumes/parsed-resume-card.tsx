"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  FileText,
  Briefcase,
  GraduationCap,
  Download,
  FileIcon,
  FileType,
  Loader2,
} from "lucide-react";
import type { Resume, ParsedResumeData, CategorizedSkill } from "@/types/database";
import { deleteResume, getResumeDownloadUrl } from "@/actions/resumes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export function ParsedResumeCard({ resume }: { resume: Resume }) {
  const router = useRouter();
  const parsed = resume.parsed_data as ParsedResumeData | null;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const isPdf = resume.file_name.toLowerCase().endsWith(".pdf");

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    const result = await deleteResume(resume.id);
    setDeleting(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Resume deleted");
      router.refresh();
    }
    setConfirmDelete(false);
  }

  async function handleDownload() {
    setDownloading(true);
    const result = await getResumeDownloadUrl(resume.id);
    setDownloading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    if (result.url) {
      const a = document.createElement("a");
      a.href = result.url;
      a.download = result.fileName || resume.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 rounded-md bg-muted p-2 shrink-0">
              {isPdf ? (
                <FileIcon className="size-5 text-destructive" />
              ) : (
                <FileType className="size-5 text-chart-1" />
              )}
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-base">
                {resume.file_name}
              </CardTitle>
              <CardDescription>
                Uploaded {format(new Date(resume.created_at), "MMM d, yyyy")}
              </CardDescription>
            </div>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              disabled={downloading}
              title="Download"
            >
              {downloading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
            </Button>
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
      {parsed && (
        <CardContent className="space-y-4">
          {parsed.name && (
            <p className="font-medium">{parsed.name}</p>
          )}
          {parsed.summary && (
            <p className="text-sm text-muted-foreground">{parsed.summary}</p>
          )}

          {parsed.experience && parsed.experience.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                  <Briefcase className="size-3.5 text-chart-2" /> Experience
                </h4>
                <div className="space-y-2">
                  {parsed.experience.slice(0, 3).map((exp, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-medium">{exp.title}</span>
                      <span className="text-muted-foreground">
                        {" "}at {exp.company} ({exp.duration})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {parsed.education && parsed.education.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                  <GraduationCap className="size-3.5 text-chart-4" /> Education
                </h4>
                {parsed.education.map((edu, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">{edu.degree}</span>
                    <span className="text-muted-foreground">
                      {" "}- {edu.institution} ({edu.year})
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {parsed.skills && parsed.skills.length > 0 && (() => {
            // Support both flat strings and categorized skills
            const isCategorized =
              typeof parsed.skills[0] === "object" &&
              parsed.skills[0] !== null;

            if (isCategorized) {
              const grouped: Record<string, string[]> = {};
              for (const s of parsed.skills as CategorizedSkill[]) {
                const cat = s.category || "Other";
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(s.name);
              }
              return (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Skills</h4>
                    {Object.entries(grouped).map(([category, skills]) => (
                      <div key={category}>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {category}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((skill, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            }

            return (
              <>
                <Separator />
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(parsed.skills as string[]).map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </CardContent>
      )}
    </Card>
  );
}
