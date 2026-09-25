import { FileText, Github } from "lucide-react";

const STACK = ["Python", "XGBoost", "LSTM / TensorFlow", "K-Means", "scikit-learn", "React", "Recharts"];

export function MoreTab() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
        <h2 className="text-lg font-semibold">
          BTC<span className="text-primary">-Adapt</span>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          BTC-Adapt is a regime-aware forecasting system for Bitcoin. It first detects which market regime we are in —
          Bull, Bear, Sideways or High Volatility — then blends a Naive baseline, XGBoost and an LSTM with weights tuned
          for that regime, instead of trusting one model for every market condition.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-background/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">H₀ — Null hypothesis</div>
            <p className="mt-1 text-sm">Adapting model weights to the market regime gives no better forecasts than any single model.</p>
          </div>
          <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary">H₁ — Alternative hypothesis</div>
            <p className="mt-1 text-sm">A regime-adaptive ensemble forecasts Bitcoin more accurately than any single model alone.</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
        <h2 className="text-base font-semibold">Tech stack</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {STACK.map((s) => (
            <span key={s} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium">
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
        <h2 className="text-base font-semibold">Links</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <a href="#" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:scale-[1.03] hover:brightness-110">
            <Github className="h-4 w-4" /> View on GitHub
          </a>
          <a href="#" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-[1.03] hover:border-primary">
            <FileText className="h-4 w-4" /> Read the full report
          </a>
        </div>
      </section>

      <p className="rounded-xl border border-border bg-background/60 p-4 text-xs leading-relaxed text-muted-foreground">
        This dashboard visualizes results from walk-forward backtested models. It is a research demonstration, not
        financial advice, and past performance does not guarantee future predictions.
      </p>
    </div>
  );
}
