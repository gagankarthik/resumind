"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Briefcase, GraduationCap } from "lucide-react";
import type { Resume, ParsedResumeData } from "@/types/database";
import { deleteResume } from "@/actions/resumes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export function ParsedResumeCard({ resume }: { resume: Resume }) {
  const router = useRouter();
  const parsed = resume.parsed_data as ParsedResumeData | null;

  async function handleDelete() {
    const result = await deleteResume(resume.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Resume deleted");
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4" />
              {resume.file_name}
            </CardTitle>
            <CardDescription>
              Uploaded {format(new Date(resume.created_at), "MMM d, yyyy")}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
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
            <div>
              <h4 className="mb-2 flex items-center gap-1 text-sm font-medium">
                <Briefcase className="size-3" /> Experience
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
          )}

          {parsed.education && parsed.education.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-1 text-sm font-medium">
                <GraduationCap className="size-3" /> Education
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
          )}

          {parsed.skills && parsed.skills.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {parsed.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
