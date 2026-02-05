import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import openai from "@/lib/openai";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Please upload a PDF or DOCX file" },
        { status: 400 }
      );
    }

    // Extract text from file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let rawText: string;

    if (file.type === "application/pdf") {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      rawText = textResult.pages.map((p: { text: string }) => p.text).join("\n");
    } else {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    }

    // Upload file to Supabase Storage
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Parse resume with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a resume parser. Extract structured data from the resume text provided. Return a JSON object with this structure:
{
  "name": string or null,
  "email": string or null,
  "phone": string or null,
  "summary": string or null (brief professional summary),
  "experience": [{"title": string, "company": string, "duration": string, "description": string}],
  "education": [{"degree": string, "institution": string, "year": string}],
  "skills": [{"name": string, "category": string}]
}

For skills, categorize each skill into one of these categories:
- "Languages" (programming languages like JavaScript, Python, Java, etc.)
- "Frameworks" (React, Angular, Django, Spring, etc.)
- "Databases" (PostgreSQL, MongoDB, Redis, etc.)
- "Cloud & DevOps" (AWS, Docker, Kubernetes, CI/CD, etc.)
- "Tools" (Git, Jira, Figma, VS Code, etc.)
- "Soft Skills" (Leadership, Communication, Teamwork, etc.)
- "Other" (anything that doesn't fit above)`,
        },
        {
          role: "user",
          content: rawText,
        },
      ],
    });

    const parsedData = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    // Save resume record
    const { data: resume, error: insertError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_path: filePath,
        raw_text: rawText,
        parsed_data: parsedData,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to save resume" },
        { status: 500 }
      );
    }

    // Save parsed skills with categories
    if (parsedData.skills && parsedData.skills.length > 0) {
      const skills = parsedData.skills.map(
        (skill: string | { name: string; category: string }) => ({
          resume_id: resume.id,
          user_id: user.id,
          skill_name: typeof skill === "string" ? skill : skill.name,
          category: typeof skill === "string" ? null : skill.category,
        })
      );

      await supabase.from("parsed_skills").insert(skills);
    }

    return NextResponse.json({ resume, parsedData });
  } catch (error) {
    console.error("Resume parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse resume" },
      { status: 500 }
    );
  }
}
