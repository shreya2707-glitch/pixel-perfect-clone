import { useState } from "react";
import { ChevronDown } from "lucide-react";

const STEPS = [
  {
    title: "Data Collection",
    body: "Daily BTC-USD OHLCV history is downloaded and cleaned. Each row becomes one trading day, and the target is the next day's closing price.",
  },
  {
    title: "Feature Engineering",
    body: "From raw prices we compute returns, rolling volatility, moving-average gaps, RSI and MACD — signals that describe both trend and turbulence.",
  },
  {
    title: "Regime Detection",
    body: "K-Means clusters days by return and volatility features. Each cluster is labelled Bull, Bear, Sideways or High Volatility based on its average behaviour.",
  },
  {
    title: "Multi-Model Forecasting",
    body: "Three forecasters predict the next close: a Naive momentum baseline, an XGBoost gradient-boosted model, and an LSTM neural network — all trained walk-forward so they never see the future.",
  },
  {
    title: "Adaptive Weighting",
    body: "For each regime we measure how accurate each model was and assign higher weights to the better performers. The final BTC-Adapt forecast blends the three using the weights for today's regime.",
  },
];

const GLOSSARY = [
  ["Regime", "A market 'mood' — a stretch of days with similar trend and volatility, like a bull run or a choppy sideways market."],
  ["MAE", "Mean Absolute Error: the average dollar gap between predicted and actual price."],
  ["RMSE", "Root Mean Squared Error: like MAE, but punishes big misses more heavily."],
  ["MAPE", "Mean Absolute Percentage Error: the average miss expressed as a percentage of the price."],
  ["Directional Accuracy", "How often the model correctly predicts whether the price goes up or down."],
  ["Walk-forward backtesting", "Testing by repeatedly training on the past and predicting the next day, just as you would in real time."],
];

export function Methodology() {
  const [open, setOpen] = useState<number | null>(0);
  const [term, setTerm] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
        <h2 className="text-base font-semibold">How BTC-Adapt Works</h2>
        <p className="mt-1 text-xs text-muted-foreground">Click a step to see what happens</p>

        <ol className="mt-5 grid gap-2 sm:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className={`flex h-full w-full items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm transition-all duration-200 hover:scale-[1.02] hover:brightness-125 sm:flex-col sm:items-start ${
                  open === i ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground"
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    open === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="font-medium">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="grid transition-all duration-200" style={{ gridTemplateRows: open === null ? "0fr" : "1fr" }}>
          <div className="overflow-hidden">
            {open !== null && (
              <div key={open} className="mt-4 animate-fade-in rounded-lg border border-border bg-background/60 p-4 text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Step {open + 1}: {STEPS[open].title}.
                </span>{" "}
                {STEPS[open].body}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
        <h2 className="text-base font-semibold">Glossary</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {GLOSSARY.map(([t, d]) => (
            <button
              key={t}
              onClick={() => setTerm(term === t ? null : t)}
              className="rounded-lg border border-border px-4 py-3 text-left transition-all duration-200 hover:border-primary/60"
            >
              <div className="flex items-center justify-between text-sm font-medium">
                {t}
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${term === t ? "rotate-180 text-primary" : ""}`} />
              </div>
              {term === t && <p className="mt-2 animate-fade-in text-sm text-muted-foreground">{d}</p>}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
