import { useNavigate } from "react-router-dom";

const monthlyCheckoutUrl = import.meta.env.VITE_LEMONSQUEEZY_MONTHLY_URL;
const yearlyCheckoutUrl = import.meta.env.VITE_LEMONSQUEEZY_YEARLY_URL;

const monthlyFeatures = [
  "Unlimited daily briefings",
  "All modules (Weather, News, Quote, Crypto)",
  "Telegram delivery",
  "Full briefing history",
  "Custom delivery time",
  "Priority support",
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple pricing for every stage</h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Start free, then upgrade whenever you want more daily briefings and full feature access.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              Start Here
            </span>
            <h2 className="mt-4 text-2xl font-bold">Free Trial</h2>
            <p className="mt-2 text-3xl font-extrabold">$0 for 7 days</p>
            <p className="mt-1 text-sm text-slate-600">No credit card required</p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ Daily AI briefing for 7 days</li>
              <li>✓ Weather + News modules</li>
              <li>✓ Telegram delivery</li>
              <li>✗ After trial: 3 briefings/week only</li>
              <li>✗ No custom modules</li>
              <li>✗ No briefing history</li>
            </ul>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Start Free Trial
            </button>
          </article>

          <article className="scale-105 rounded-2xl border-2 border-amber-400 bg-white p-6 shadow-md">
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Most Popular
            </span>
            <h2 className="mt-4 text-2xl font-bold">Monthly</h2>
            <p className="mt-2 text-3xl font-extrabold">$4.99/month</p>
            <p className="mt-1 text-sm text-slate-600">Cancel anytime</p>
            <ul className="mt-6 space-y-2 text-sm">
              {monthlyFeatures.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>
            <a
              href={monthlyCheckoutUrl}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Get Monthly Access
            </a>
          </article>

          <article className="rounded-2xl border-2 border-emerald-400 bg-white p-6 shadow-sm">
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              Best Value
            </span>
            <h2 className="mt-4 text-2xl font-bold">Yearly</h2>
            <p className="mt-2 text-3xl font-extrabold">$39.99/year</p>
            <p className="mt-1 text-sm text-slate-600">Save $20 vs monthly — $3.33/month</p>
            <ul className="mt-6 space-y-2 text-sm">
              {monthlyFeatures.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
              <li>✓ 2 months free vs monthly</li>
              <li>✓ Price locked for life</li>
            </ul>
            <a
              href={yearlyCheckoutUrl}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Get Yearly Access
            </a>
          </article>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500 sm:text-sm">
          Payments secured by Lemon Squeezy. Cancel anytime.
        </p>

        <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">FAQ</h3>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-medium">Q: What happens after my trial?</p>
              <p className="mt-1 text-slate-600">
                A: You get 3 briefings per week on the free plan. Upgrade anytime to restore daily delivery.
              </p>
            </div>
            <div>
              <p className="font-medium">Q: Can I cancel my subscription?</p>
              <p className="mt-1 text-slate-600">
                A: Yes, cancel anytime. You keep access until the end of your paid period.
              </p>
            </div>
            <div>
              <p className="font-medium">Q: Is my payment secure?</p>
              <p className="mt-1 text-slate-600">
                A: Yes. Lemon Squeezy handles all payments and never shares your card data with us.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
