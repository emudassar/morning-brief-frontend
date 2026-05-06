import { Link } from "react-router-dom";
import { CalendarClock, MessageCircle, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import MarketingNavbar from "../components/MarketingNavbar";

const features = [
  {
    title: "AI Briefing",
    description: "Start each day with a concise, intelligent summary of what matters most.",
    icon: Sparkles,
  },
  {
    title: "Telegram Delivery",
    description: "Receive your briefing where you already are, with zero extra app friction.",
    icon: MessageCircle,
  },
  {
    title: "Smart Scheduling",
    description: "Pick your ideal time and timezone so updates always arrive on your rhythm.",
    icon: CalendarClock,
  },
  {
    title: "Personalized Insights",
    description: "Tailor content by city, country, and modules to keep every briefing relevant.",
    icon: TrendingUp,
  },
];

export default function Landing() {
  return (
    <div className="app-shell">
      <MarketingNavbar />

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              Your day, briefed before it begins
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tightest sm:text-5xl">
              Clarity Before Coffee.
              <span className="block bg-brand-gradient bg-clip-text text-transparent">
                One briefing. Zero noise.
              </span>
            </h1>
            <p className="max-w-xl text-base text-muted sm:text-lg">
              Stop juggling weather apps, news tabs, and calendar checks. Morning Briefing Agent compiles your
              priorities into one clean Telegram update so you can start fast and focused.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/register">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  View Dashboard
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted">Loved by 1,000+ professionals</p>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="border-b border-slate-200/80 bg-slate-50 px-5 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Mock Dashboard</p>
            </div>
            <div className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs text-muted">Next briefing</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">08:00 - Asia/Karachi</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs text-muted">Status</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">Active</p>
                </div>
              </div>
              <div className="rounded-xl bg-brand-gradient p-4 text-white shadow-premium">
                <p className="text-sm font-semibold">Send briefing now</p>
                <p className="mt-1 text-xs text-white/90">One click to generate and deliver instantly.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Latest briefing</p>
                <p className="mt-2 text-sm text-slate-700">
                  Good morning! Weather is clear, your 10:30 meeting is coming up, and top headlines are ready.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-4 pb-20 scroll-mt-28 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="section-title">Built for focused mornings</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="p-6 transition hover:-translate-y-0.5 hover:shadow-premium">
                  <div className="mb-4 inline-flex rounded-lg bg-brand-50 p-2 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <Card className="p-8 sm:p-10">
            <h2 className="section-title">How it works</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {["Sign up", "Connect Telegram", "Get daily briefing"].map((step, idx) => (
                <div key={step} className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Step {idx + 1}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{step}</p>
                  <p className="mt-1 text-sm text-muted">
                    {idx === 0 && "Create your account and set your preferences in under a minute."}
                    {idx === 1 && "Link your Telegram in one command so delivery is instant and reliable."}
                    {idx === 2 && "Receive a personalized briefing every morning exactly when you need it."}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="py-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Simple, honest pricing</h2>
            <p className="mt-3 text-slate-500 text-base">Start free for 7 days. No credit card required.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition">
                Start Free Trial
              </Link>
              <Link to="/pricing" className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                See All Plans →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-3 border-t border-slate-200 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Morning Briefing Agent</p>
        <div className="flex items-center gap-4">
          <Link to="/login" className="link-brand text-sm">
            Sign in
          </Link>
          <Link to="/register" className="link-brand text-sm">
            Get Started
          </Link>
        </div>
      </footer>
    </div>
  );
}
