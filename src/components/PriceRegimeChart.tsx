import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART,
  REGIMES,
  REGIME_COLORS,
  TOOLTIP_STYLE,
  currency,
  pct,
  regimeBands,
  shortDate,
  type BtcAdaptResults,
  type Regime,
} from "@/lib/btc-adapt";

export function PriceRegimeChart({ data }: { data: BtcAdaptResults }) {
  const [selected, setSelected] = useState<Regime | null>(null);
  const bands = regimeBands(data.regimes);

  const rows = useMemo(() => {
    const byDate = new Map(data.regimes.map((r) => [r.date, r.regime]));
    return data.prices.map((p) => ({ ...p, regime: byDate.get(p.date) }));
  }, [data]);

  const summary = useMemo(() => {
    if (!selected) return null;
    const rets: number[] = [];
    rows.forEach((r, i) => {
      if (i > 0 && r.regime === selected) rets.push(r.close / rows[i - 1].close - 1);
    });
    const days = rows.filter((r) => r.regime === selected).length;
    const avg = rets.length ? rets.reduce((a, b) => a + b, 0) / rets.length : 0;
    const periods = bands.filter((b) => b.regime === selected).length;
    return { days, avg, periods };
  }, [selected, rows, bands]);

  const toggle = (r: Regime) => setSelected((s) => (s === r ? null : r));

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Price &amp; Detected Regimes</h2>
          <p className="mt-1 text-xs text-muted-foreground">Click a shaded band or legend item to inspect a regime</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {REGIMES.map((r) => (
            <button
              key={r}
              onClick={() => toggle(r)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-all duration-200 hover:brightness-125 ${
                selected === r ? "border-primary text-foreground" : "border-border text-muted-foreground"
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: REGIME_COLORS[r] }} />
              {r}
            </button>
          ))}
        </div>
      </div>

      {selected && summary && (
        <div className="mb-4 flex animate-fade-in flex-wrap items-center gap-x-6 gap-y-1 rounded-lg border border-border bg-background/60 px-4 py-3 text-sm">
          <span className="font-semibold" style={{ color: REGIME_COLORS[selected] }}>{selected}</span>
          <span className="tabular-nums">{summary.days} days</span>
          <span className="tabular-nums">{summary.periods} period{summary.periods === 1 ? "" : "s"}</span>
          <span className="tabular-nums">
            avg daily return{" "}
            <span style={{ color: summary.avg >= 0 ? REGIME_COLORS.Bull : REGIME_COLORS.Bear }}>{pct(summary.avg)}</span>
          </span>
          <button onClick={() => setSelected(null)} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
            Clear
          </button>
        </div>
      )}

      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={CHART.grid} vertical={false} />
            {bands.map((b) => (
              <ReferenceArea
                key={b.start}
                x1={b.start}
                x2={b.end}
                fill={REGIME_COLORS[b.regime]}
                fillOpacity={selected ? (selected === b.regime ? 0.32 : 0.04) : 0.12}
                strokeOpacity={0}
                onClick={() => toggle(b.regime)}
                style={{ cursor: "pointer" }}
              />
            ))}
            <XAxis dataKey="date" tickFormatter={shortDate} stroke={CHART.axis} tickLine={false} fontSize={12} minTickGap={24} />
            <YAxis
              stroke={CHART.axis}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              width={70}
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => currency(v)}
            />
            <Tooltip
              {...TOOLTIP_STYLE}
              formatter={(v: number, _n, item) => {
                const regime = (item.payload as { regime?: Regime }).regime;
                return [`${currency(v)}${regime ? ` · ${regime}` : ""}`, "Close"];
              }}
            />
            <Line isAnimationActive={false} type="monotone" dataKey="close" stroke={CHART.amber} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
