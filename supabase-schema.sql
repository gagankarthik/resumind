-- Resumind Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (auto-created on signup)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Resumes table
create table public.resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  file_name text not null,
  file_path text not null,
  raw_text text,
  parsed_data jsonb,
  created_at timestamptz default now() not null
);

alter table public.resumes enable row level security;
create policy "Users can manage own resumes" on public.resumes for all using (auth.uid() = user_id);

-- Parsed skills table
create table public.parsed_skills (
  id uuid default uuid_generate_v4() primary key,
  resume_id uuid references public.resumes on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  skill_name text not null,
  category text,
  created_at timestamptz default now() not null
);

alter table public.parsed_skills enable row level security;
create policy "Users can manage own skills" on public.parsed_skills for all using (auth.uid() = user_id);

-- Jobs table
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  company text not null,
  location text,
  description text not null,
  url text,
  match_score integer,
  match_reasoning text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.jobs enable row level security;
create policy "Users can manage own jobs" on public.jobs for all using (auth.uid() = user_id);

-- Application status enum
create type public.application_status as enum (
  'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'
);

-- Applications table
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  job_id uuid references public.jobs on delete cascade not null,
  resume_id uuid references public.resumes on delete set null,
  status public.application_status default 'applied' not null,
  applied_date date not null,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.applications enable row level security;
create policy "Users can manage own applications" on public.applications for all using (auth.uid() = user_id);

-- Reminders table
create table public.reminders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  application_id uuid references public.applications on delete set null,
  title text not null,
  description text,
  due_date date not null,
  is_completed boolean default false not null,
  created_at timestamptz default now() not null
);

alter table public.reminders enable row level security;
create policy "Users can manage own reminders" on public.reminders for all using (auth.uid() = user_id);

-- Storage bucket for resumes
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false);

create policy "Users can upload own resumes" on storage.objects
  for insert with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view own resumes" on storage.objects
  for select using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own resumes" on storage.objects
  for delete using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);
