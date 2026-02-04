export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  raw_text: string | null;
  parsed_data: ParsedResumeData | null;
  created_at: string;
}

export interface ParsedResumeData {
  name: string | null;
  email: string | null;
  phone: string | null;
  summary: string | null;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface ParsedSkill {
  id: string;
  resume_id: string;
  user_id: string;
  skill_name: string;
  category: string | null;
  created_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string | null;
  description: string;
  url: string | null;
  match_score: number | null;
  match_reasoning: string | null;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  resume_id: string | null;
  status: ApplicationStatus;
  applied_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  job?: Job;
  resume?: Resume;
}

export interface DiscoveredJob {
  company: string;
  role: string;
  location: string;
  salary_range: string;
  match_score: number;
  match_reasoning: string;
  description: string;
  search_url: string;
  source: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  application_id: string | null;
  title: string;
  description: string | null;
  due_date: string;
  is_completed: boolean;
  created_at: string;
  // Joined fields
  application?: Application & { job?: Job };
}
