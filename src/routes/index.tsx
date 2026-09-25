import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ActualVsPredicted } from "@/components/ActualVsPredicted";
import { MetricsTable } from "@/components/MetricsTable";
import { Methodology } from "@/components/Methodology";
import { PriceRegimeChart } from "@/components/PriceRegimeChart";
import { WeightsPanel } from "@/components/WeightsPanel";
import { REGIME_COLORS, currency, type BtcAdaptResults } from "@/lib/btc-adapt";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BTC-Adapt — Adaptive Regime-Aware Bitcoin Forecasting" },
      {
        name: "description",
        content:
          "Research dashboard for BTC-Adapt: K-Means regime detection with an adaptive XGBoost + LSTM ensemble, walk-forward backtested.",
      },
      { property: "og:title", content: "BTC-Adapt — Regime-Aware Bitcoin Forecasting" },
      {
        property: "og:description",
        content:
          "Regimes, ensemble weights, actual vs predicted prices and model performance for the BTC-Adapt forecasting system.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function StatusItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{children}</div>
    </div>
  );
}

function Index() {
  const [data, setData] = useState<BtcAdaptResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/btc_adapt_results.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json() as Promise<BtcAdaptResults>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm rounded-xl border border-border bg-card p-6 text-center">
          <h1 className="text-base font-semibold">Results unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Could not load the backtest results. {error}
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="text-sm text-muted-foreground">Loading backtest results…</div>
      </main>
    );
  }

  const up = data.predicted_next_return >= 0;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            BTC<span className="text-primary">-Adapt</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Adaptive Regime-Aware Multi-Model Bitcoin Forecasting
          </p>

          <div className="mt-6 grid grid-cols-2 gap-5 border-t border-border pt-5 lg:grid-cols-4">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Current regime
              </div>
              <span
                className="mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
                style={{
                  color: REGIME_COLORS[data.current_regime],
                  backgroundColor: `${REGIME_COLORS[data.current_regime]}1f`,
                }}
              >
                {data.current_regime}
              </span>
            </div>
            <StatusItem label="Current price">{currency(data.current_price)}</StatusItem>
            <StatusItem label="Predicted next">{currency(data.predicted_next_price)}</StatusItem>
            <StatusItem label="Predicted return">
              <span style={{ color: up ? REGIME_COLORS.Bull : REGIME_COLORS.Bear }}>
                {up ? "+" : "−"}
                {Math.abs(data.predicted_next_return).toFixed(2)}%
              </span>
            </StatusItem>
          </div>
        </header>

        <PriceRegimeChart data={data} />
        <WeightsPanel data={data} />
        <ActualVsPredicted data={data} />
        <MetricsTable data={data} />
        <Methodology />
      </div>
    </main>
  );
}
