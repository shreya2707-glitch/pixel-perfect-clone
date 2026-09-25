import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART, MODEL_META, REGIMES, REGIME_COLORS, TOOLTIP_STYLE, type BtcAdaptResults, type Regime } from "@/lib/btc-adapt";

const MODELS = MODEL_META.filter((m) => m.key !== "btc_adapt");

export function WeightsPanel({ data }: { data: BtcAdaptResults }) {
  const [regime, setRegime] = useState<Regime>(data.current_regime);
  const w = data.weights_by_regime[regime];
  const pie = MODELS.map((m) => ({ name: m.label, value: w[m.key], color: m.color }));

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <h2 className="text-base font-semibold">Model Contribution by Regime</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Ensemble weights used when the market is{" "}
        <span style={{ color: REGIME_COLORS[regime] }}>{regime}</span>
        {regime === data.current_regime ? " (current)" : ""}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {REGIMES.map((r) => (
          <button
            key={r}
            onClick={() => setRegime(r)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-[1.03] hover:brightness-125 ${
              regime === r ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"
            }`}
          >
            {r}
            {r === data.current_regime && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />}
          </button>
        ))}
      </div>

      <div className="mt-5 grid items-center gap-6 md:grid-cols-2">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pie} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={2} stroke={CHART.card} animationDuration={250}>
                {pie.map((p) => (
                  <Cell key={p.name} fill={p.color} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number, n: string) => [`${(v * 100).toFixed(0)}%`, n]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {pie.map((p) => (
            <div key={p.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
                  {p.name}
                </span>
                <span className="tabular-nums">{(p.value * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${p.value * 100}%`, backgroundColor: p.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
