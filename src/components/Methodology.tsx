import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function Methodology() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-border bg-card shadow-lg">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
      >
        <span className="text-base font-semibold">Methodology</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="space-y-3 border-t border-border p-5 text-sm leading-relaxed text-muted-foreground sm:p-6">
          <p>
            BTC-Adapt detects the prevailing Bitcoin market regime using K-Means clustering over
            volatility, momentum, and trend features derived from daily price history.
          </p>
          <p>
            Within each regime it dynamically weights Naive, XGBoost, and LSTM forecasts according to
            each model&apos;s recent performance under that regime, so the ensemble leans on whichever
            model is currently most reliable.
          </p>
          <p>
            All results are evaluated with chronological walk-forward backtesting, so no future
            information is ever available to the models — avoiding lookahead bias.
          </p>
        </div>
      )}
    </section>
  );
}
