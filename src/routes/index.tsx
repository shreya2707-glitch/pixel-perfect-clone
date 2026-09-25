import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, Info, LayoutDashboard, LineChart } from "lucide-react";
import { ActualVsPredicted } from "@/components/ActualVsPredicted";
import { MetricsTable } from "@/components/MetricsTable";
import { Methodology } from "@/components/Methodology";
import { MoreTab } from "@/components/MoreTab";
import { PriceRegimeChart } from "@/components/PriceRegimeChart";
import { WeightsPanel } from "@/components/WeightsPanel";
import { REGIME_COLORS, currency, pct, type BtcAdaptResults } from "@/lib/btc-adapt";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BTC-Adapt — Adaptive Regime-Aware Bitcoin Forecasting" },
      {
        name: "description",
        content: "Research dashboard for BTC-Adapt: K-Means regime detection with an adaptive XGBoost + LSTM ensemble, walk-forward backtested.",
      },
      { property: "og:title", content: "BTC-Adapt — Regime-Aware Bitcoin Forecasting" },
      {
        property: "og:description",
        content: "Regimes, ensemble weights, actual vs predicted prices and model performance for the BTC-Adapt forecasting system.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "predictions", label: "Predictions", icon: LineChart },
  { id: "learn", label: "Learn More", icon: BookOpen },
  { id: "more", label: "More", icon: Info },
] as const;
type TabId = (typeof TABS)[number]["id"];

function StatusItem({ label, children }: { label: string; children: ReactNode }) {
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
  const [tab, setTab] = useState<TabId>("overview");

  useEffect(() => {
    let cancelled = false;
    fetch("/btc_adapt_results.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json() as Promise<BtcAdaptResults>;
      })
      .then((json) => !cancelled && setData(json))
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const go = (t: TabId) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const needsData = tab === "overview" || tab === "predictions";
  const ret = data ? data.predicted_next_price / data.current_price - 1 : 0;

  return (
    <main className="min-h-screen px-4 pb-24 pt-6 sm:px-6 sm:pb-10 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                BTC<span className="text-primary">-Adapt</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Adaptive Regime-Aware Multi-Model Bitcoin Forecasting</p>
            </div>
            <nav className="hidden gap-1 rounded-lg border border-border p-1 sm:flex">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => go(t.id)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:brightness-125 ${
                    tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {data && (
            <div className="mt-6 grid grid-cols-2 gap-5 border-t border-border pt-5 lg:grid-cols-4">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Current regime</div>
                <span
                  className="mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
                  style={{ color: REGIME_COLORS[data.current_regime], backgroundColor: `${REGIME_COLORS[data.current_regime]}1f` }}
                >
                  {data.current_regime}
                </span>
              </div>
              <StatusItem label="Current price">{currency(data.current_price)}</StatusItem>
              <StatusItem label="Predicted next">{currency(data.predicted_next_price)}</StatusItem>
              <StatusItem label="Predicted return">
                <span style={{ color: ret >= 0 ? REGIME_COLORS.Bull : REGIME_COLORS.Bear }}>{pct(ret)}</span>
              </StatusItem>
            </div>
          )}
        </header>

        <div key={tab} className="flex animate-fade-in flex-col gap-6">
          {needsData && error && (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              Could not load the backtest results. {error}
            </div>
          )}
          {needsData && !data && !error && (
            <div className="flex flex-col gap-6">
              {[340, 260].map((h) => (
                <div key={h} className="animate-pulse rounded-xl border border-border bg-card" style={{ height: h }} />
              ))}
              <p className="text-center text-sm text-muted-foreground">Loading backtest results…</p>
            </div>
          )}

          {tab === "overview" && data && (
            <>
              <PriceRegimeChart data={data} />
              <WeightsPanel data={data} />
              <button
                onClick={() => go("predictions")}
                className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:scale-[1.03] hover:brightness-110"
              >
                View full predictions <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
          {tab === "predictions" && data && (
            <>
              <ActualVsPredicted data={data} />
              <MetricsTable data={data} />
            </>
          )}
          {tab === "learn" && <Methodology />}
          {tab === "more" && <MoreTab />}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-card/95 backdrop-blur sm:hidden">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => go(t.id)}
            className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-200 ${
              tab === t.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <t.icon className="h-5 w-5" />
            {t.label}
          </button>
        ))}
      </nav>
    </main>
  );
}
