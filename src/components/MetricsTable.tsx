import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART, MODEL_META, TOOLTIP_STYLE, type BtcAdaptResults, type Metric } from "@/lib/btc-adapt";

const COLS: { key: keyof Metric; label: string; lowerBetter: boolean; fmt: (n: number) => string }[] = [
  { key: "mae", label: "MAE", lowerBetter: true, fmt: (n) => n.toFixed(1) },
  { key: "rmse", label: "RMSE", lowerBetter: true, fmt: (n) => n.toFixed(1) },
  { key: "mape", label: "MAPE", lowerBetter: true, fmt: (n) => `${n.toFixed(2)}%` },
  { key: "directional_accuracy", label: "Dir. Accuracy", lowerBetter: false, fmt: (n) => `${n.toFixed(1)}%` },
];

export function MetricsTable({ data }: { data: BtcAdaptResults }) {
  const [sort, setSort] = useState<{ key: keyof Metric; asc: boolean } | null>(null);
  const [view, setView] = useState<"table" | "chart">("table");

  const rows = useMemo(() => {
    const list = [...MODEL_META];
    if (sort) list.sort((a, b) => (data.metrics[a.key][sort.key] - data.metrics[b.key][sort.key]) * (sort.asc ? 1 : -1));
    return list;
  }, [data, sort]);

  const wins = (key: keyof Metric, lowerBetter: boolean) => {
    const a = data.metrics.btc_adapt[key];
    const others = MODEL_META.filter((m) => m.key !== "btc_adapt").map((m) => data.metrics[m.key][key]);
    return lowerBetter ? a < Math.min(...others) : a > Math.max(...others);
  };

  const onSort = (key: keyof Metric) =>
    setSort((s) => (s?.key === key ? { key, asc: !s.asc } : { key, asc: true }));

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Model Performance</h2>
          <p className="mt-1 text-xs text-muted-foreground">Click a metric header to sort</p>
        </div>
        <div className="inline-flex rounded-lg border border-border p-0.5 text-xs">
          {(["table", "chart"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 capitalize transition-all duration-200 hover:brightness-125 ${
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "table" ? (
        <div key="t" className="mt-4 animate-fade-in overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 text-left font-medium">Model</th>
                {COLS.map((c) => (
                  <th key={c.key} className="pb-3 text-right font-medium">
                    <button onClick={() => onSort(c.key)} className="inline-flex items-center gap-1 uppercase hover:text-foreground">
                      {c.label}
                      {sort?.key === c.key ? (
                        sort.asc ? <ArrowUp className="h-3 w-3 text-primary" /> : <ArrowDown className="h-3 w-3 text-primary" />
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => {
                const isAdapt = m.key === "btc_adapt";
                return (
                  <tr key={m.key} className={`border-t border-border transition-colors ${isAdapt ? "bg-primary/10 font-semibold text-primary" : ""}`}>
                    <td className="py-3">{m.label}</td>
                    {COLS.map((c) => (
                      <td key={c.key} className="py-3 text-right tabular-nums">
                        <span className="inline-flex items-center justify-end gap-1">
                          {c.fmt(data.metrics[m.key][c.key])}
                          {isAdapt && wins(c.key, c.lowerBetter) &&
                            (c.lowerBetter ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />)}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">Arrows mark metrics where BTC-Adapt beats every baseline (↓ lower error, ↑ higher accuracy).</p>
        </div>
      ) : (
        <div key="c" className="mt-4 grid animate-fade-in gap-4 sm:grid-cols-2">
          {COLS.map((c) => (
            <div key={c.key} className="rounded-lg border border-border p-3">
              <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                {c.label} <span className="normal-case">({c.lowerBetter ? "lower is better" : "higher is better"})</span>
              </div>
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MODEL_META.map((m) => ({ name: m.label, value: data.metrics[m.key][c.key], color: m.color }))}>
                    <CartesianGrid stroke={CHART.grid} vertical={false} />
                    <XAxis dataKey="name" stroke={CHART.axis} tickLine={false} fontSize={11} />
                    <YAxis stroke={CHART.axis} tickLine={false} axisLine={false} fontSize={11} width={44} />
                    <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: "#ffffff08" }} formatter={(v: number) => [c.fmt(v), c.label]} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={250}>
                      {MODEL_META.map((m) => (
                        <Cell key={m.key} fill={m.color} fillOpacity={m.key === "btc_adapt" ? 1 : 0.55} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
