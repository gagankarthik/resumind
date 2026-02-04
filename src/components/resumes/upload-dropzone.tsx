"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function UploadDropzone() {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const allowed = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowed.includes(file.type)) {
        toast.error("Please upload a PDF or DOCX file");
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to upload");
        }

        toast.success("Resume uploaded and parsed successfully!");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to upload resume"
        );
      } finally {
        setUploading(false);
      }
    },
    [router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      } ${uploading ? "pointer-events-none opacity-50" : ""}`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <>
          <Loader2 className="mb-2 size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Uploading and parsing...
          </p>
        </>
      ) : (
        <>
          <Upload className="mb-2 size-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            {isDragActive ? "Drop your resume here" : "Drop a PDF or DOCX resume here"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse
          </p>
        </>
      )}
    </div>
  );
}
