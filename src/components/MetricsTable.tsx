import { ArrowDown, ArrowUp } from "lucide-react";
import type { BtcAdaptResults, Metric, ModelKey } from "@/lib/btc-adapt";

const MODELS: { key: ModelKey; label: string }[] = [
  { key: "naive", label: "Naive" },
  { key: "xgboost", label: "XGBoost" },
  { key: "lstm", label: "LSTM" },
  { key: "btc_adapt", label: "BTC-Adapt" },
];

const ROWS: { key: keyof Metric; label: string; lowerBetter: boolean; fmt: (n: number) => string }[] =
  [
    { key: "mae", label: "MAE", lowerBetter: true, fmt: (n) => n.toFixed(1) },
    { key: "rmse", label: "RMSE", lowerBetter: true, fmt: (n) => n.toFixed(1) },
    { key: "mape", label: "MAPE", lowerBetter: true, fmt: (n) => `${n.toFixed(2)}%` },
    {
      key: "directional_accuracy",
      label: "Directional Accuracy",
      lowerBetter: false,
      fmt: (n) => `${n.toFixed(1)}%`,
    },
  ];

export function MetricsTable({ data }: { data: BtcAdaptResults }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <h2 className="text-base font-semibold">Model Performance</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-3 text-left font-medium">Metric</th>
              {MODELS.map((m) => (
                <th
                  key={m.key}
                  className={`pb-3 text-right font-medium ${m.key === "btc_adapt" ? "text-primary" : ""}`}
                >
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const adapt = data.metrics.btc_adapt[row.key];
              const others = MODELS.filter((m) => m.key !== "btc_adapt").map(
                (m) => data.metrics[m.key][row.key],
              );
              const wins = row.lowerBetter
                ? adapt < Math.min(...others)
                : adapt > Math.max(...others);
              return (
                <tr key={row.key} className="border-t border-border">
                  <td className="py-3 text-muted-foreground">{row.label}</td>
                  {MODELS.map((m) => {
                    const value = data.metrics[m.key][row.key];
                    const isAdapt = m.key === "btc_adapt";
                    return (
                      <td
                        key={m.key}
                        className={`py-3 text-right tabular-nums ${
                          isAdapt ? "bg-accent/50 font-semibold text-primary" : ""
                        }`}
                      >
                        <span className="inline-flex items-center justify-end gap-1">
                          {row.fmt(value)}
                          {isAdapt && wins ? (
                            row.lowerBetter ? (
                              <ArrowDown className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowUp className="h-3.5 w-3.5" />
                            )
                          ) : null}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Arrows mark where BTC-Adapt beats every individual model.
      </p>
    </section>
  );
}
