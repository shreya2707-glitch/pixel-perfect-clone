import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART, REGIMES, REGIME_COLORS, type BtcAdaptResults } from "@/lib/btc-adapt";

const MODELS = [
  { key: "naive", label: "Naive", color: "#64748b" },
  { key: "xgboost", label: "XGBoost", color: "#38bdf8" },
  { key: "lstm", label: "LSTM", color: "#f59e0b" },
] as const;

export function WeightsPanel({ data }: { data: BtcAdaptResults }) {
  const current = data.weights_by_regime[data.current_regime];
  const pie = MODELS.map((m) => ({ name: m.label, value: current[m.key], color: m.color }));

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <h2 className="text-base font-semibold">Model Contribution — Current Regime</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Ensemble weights active in the{" "}
        <span style={{ color: REGIME_COLORS[data.current_regime] }}>{data.current_regime}</span>{" "}
        regime
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pie}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={2}
                stroke={CHART.card}
              >
                {pie.map((p) => (
                  <Cell key={p.name} fill={p.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: CHART.card,
                  border: `1px solid ${CHART.grid}`,
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: number, n: string) => [`${(v * 100).toFixed(0)}%`, n]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
            {pie.map((p) => (
              <span key={p.name} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
                {p.name} <span className="tabular-nums">{(p.value * 100).toFixed(0)}%</span>
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 font-medium">Regime</th>
                {MODELS.map((m) => (
                  <th key={m.key} className="pb-2 text-right font-medium">
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REGIMES.map((r) => (
                <tr
                  key={r}
                  className={`border-t border-border ${r === data.current_regime ? "bg-accent/40" : ""}`}
                >
                  <td className="py-2">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: REGIME_COLORS[r] }}
                      />
                      {r}
                    </span>
                  </td>
                  {MODELS.map((m) => (
                    <td key={m.key} className="py-2 text-right tabular-nums">
                      {(data.weights_by_regime[r][m.key] * 100).toFixed(0)}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
