import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  ClipboardList,
  Bell,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Brain,
  Target,
  TrendingUp,
  Quote,
  Github,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import { MobileNav } from "@/components/landing/mobile-nav";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <Image src="logo.svg" width={125} height={125} alt="Resumind" />
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </Link>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
          <MobileNav />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Grid background */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_40%,transparent_100%)]" />

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 text-center sm:pt-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="size-3.5 text-chart-4" />
            AI-Powered Job Search Assistant
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Your job search,{" "}
            <span className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
              intelligently tracked
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Upload your resume, add job listings, and let AI score your match.
            Track every application from applied to offer in one place.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 sm:w-auto"
            >
              Start for free
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border px-8 text-base font-medium transition-all hover:bg-accent hover:-translate-y-0.5 sm:w-auto"
            >
              See how it works
            </Link>
          </div>

          {/* Social proof stats */}
          <div className="mt-16 flex flex-col items-center justify-center gap-6 text-sm text-muted-foreground sm:flex-row sm:gap-8">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-chart-2" />
              Free to use
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-chart-2" />
              No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-chart-2" />
              AI-powered insights
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="overflow-hidden rounded-xl border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <div className="size-3 rounded-full bg-destructive/60" />
              <div className="size-3 rounded-full bg-chart-4/60" />
              <div className="size-3 rounded-full bg-chart-2/60" />
              <span className="ml-2 text-xs text-muted-foreground">
                Resumind Dashboard
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-6 lg:grid-cols-4">
              {[
                { label: "Applications", val: "24", sub: "+3 this week", color: "border-l-chart-1" },
                { label: "Interviews", val: "8", sub: "33% rate", color: "border-l-chart-2" },
                { label: "Offers", val: "2", sub: "Looking good", color: "border-l-chart-4" },
                { label: "Reminders", val: "5", sub: "2 due today", color: "border-l-chart-3" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-lg border border-l-4 ${stat.color} bg-background p-3 sm:p-4`}
                >
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.val}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-3 sm:gap-4 sm:px-6 sm:pb-6">
              {[
                {
                  title: "Frontend Engineer",
                  co: "Vercel",
                  score: 92,
                  status: "Interview",
                },
                {
                  title: "Full Stack Developer",
                  co: "Stripe",
                  score: 85,
                  status: "Applied",
                },
                {
                  title: "Software Engineer",
                  co: "Linear",
                  score: 78,
                  status: "Screening",
                },
              ].map((job) => (
                <div
                  key={job.title}
                  className="rounded-lg border bg-background p-4"
                >
                  <p className="text-sm font-medium">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.co}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="mr-3 flex-1">
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-chart-2"
                          style={{ width: `${job.score}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium">{job.score}%</span>
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex rounded-md border px-2 py-0.5 text-xs">
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to land the job
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From resume parsing to offer tracking, Resumind handles the busywork
            so you can focus on what matters.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "AI Resume Parsing",
              desc: "Upload your PDF and our AI extracts skills, experience, and education automatically. No manual data entry.",
              gradient: "from-chart-1/20 to-chart-1/5",
              iconColor: "text-chart-1",
            },
            {
              icon: Target,
              title: "Job Match Scoring",
              desc: "Get an instant 0-100 compatibility score for any job listing based on your resume. Know where you stand.",
              gradient: "from-chart-2/20 to-chart-2/5",
              iconColor: "text-chart-2",
            },
            {
              icon: ClipboardList,
              title: "Application Tracker",
              desc: "Track every application from Applied to Offer with inline status updates. Never lose track of where you are.",
              gradient: "from-chart-3/20 to-chart-3/5",
              iconColor: "text-chart-3",
            },
            {
              icon: Bell,
              title: "Smart Reminders",
              desc: "Set follow-up reminders linked to specific applications. Overdue items are highlighted so nothing slips.",
              gradient: "from-chart-4/20 to-chart-4/5",
              iconColor: "text-chart-4",
            },
            {
              icon: Brain,
              title: "Skills Overview",
              desc: "See all your parsed skills in one place. Identify gaps and strengths at a glance from your dashboard.",
              gradient: "from-chart-5/20 to-chart-5/5",
              iconColor: "text-chart-5",
            },
            {
              icon: TrendingUp,
              title: "Dashboard Analytics",
              desc: "Get a bird's-eye view with stats on total applications, interview rates, offers, and upcoming deadlines.",
              gradient: "from-chart-1/20 to-chart-2/5",
              iconColor: "text-chart-1",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 transition-all hover:bg-accent/50 hover:shadow-lg hover:-translate-y-1"
            >
              <div
                className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${feature.gradient} p-2.5`}
              >
                <feature.icon className={`size-5 ${feature.iconColor}`} />
              </div>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps to a smarter job search
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Get started in minutes, not hours. Resumind simplifies every step.
            </p>
          </div>

          <div className="relative mt-16 grid gap-12 sm:grid-cols-3">
            {/* Connecting line (desktop only) */}
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-muted-foreground/20 sm:block" />

            {[
              {
                step: "01",
                icon: FileText,
                title: "Upload your resume",
                desc: "Drop a PDF or DOCX and our AI instantly parses your skills, experience, and education into structured data.",
              },
              {
                step: "02",
                icon: Briefcase,
                title: "Add job listings",
                desc: "Paste job descriptions and get an AI-powered match score telling you how well you fit each role.",
              },
              {
                step: "03",
                icon: ClipboardList,
                title: "Track & follow up",
                desc: "Log applications, update statuses inline, set reminders, and watch your dashboard stats grow.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="relative z-10 mx-auto mb-4 flex size-14 items-center justify-center rounded-full border-2 bg-background shadow-sm">
                  <item.icon className="size-6 text-foreground" />
                </div>
                <span className="inline-flex h-6 items-center rounded-full bg-primary/10 px-2.5 text-xs font-bold uppercase tracking-widest text-primary">
                  Step {item.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by job seekers
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            See what people are saying about how Resumind transformed their job
            search.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote:
                "Resumind saved me hours of spreadsheet tracking. The AI match scoring helped me focus on roles where I actually had a shot.",
              name: "Sarah Chen",
              role: "Software Engineer at Vercel",
            },
            {
              quote:
                "The resume parsing is incredibly accurate. It pulled out every skill and experience detail perfectly. I landed 3 interviews in my first week.",
              name: "Marcus Johnson",
              role: "Full Stack Developer at Stripe",
            },
            {
              quote:
                "I love the reminder system. I never forget to follow up anymore, and the dashboard gives me a clear picture of my progress.",
              name: "Priya Patel",
              role: "Product Designer at Linear",
            },
          ].map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-xl border bg-card p-6 transition-all hover:shadow-md"
            >
              <Quote className="mb-3 size-5 text-muted-foreground/40" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-chart-2/10 to-chart-3/5 px-8 py-16 text-center shadow-lg ring-1 ring-border">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to take control of your job search?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join Resumind and let AI do the heavy lifting. Upload your first
              resume and start matching with jobs in minutes.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5"
            >
              Get started — it&apos;s free
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="text-lg font-bold tracking-tight">
                <Image
                  src="logo.svg"
                  width={100}
                  height={100}
                  alt="Resumind"
                />
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                AI-powered job search assistant that helps you land your dream
                role.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Product</h4>
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  How it works
                </Link>
                <Link
                  href="#testimonials"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Testimonials
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Company</h4>
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Legal</h4>
              <div className="mt-3 flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Privacy</span>
                <span className="text-sm text-muted-foreground">Terms</span>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Resumind. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Github className="size-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <Twitter className="size-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
