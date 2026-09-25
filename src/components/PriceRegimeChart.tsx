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
  currency,
  regimeBands,
  shortDate,
  type BtcAdaptResults,
} from "@/lib/btc-adapt";

export function PriceRegimeChart({ data }: { data: BtcAdaptResults }) {
  const bands = regimeBands(data.regimes);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Price &amp; Detected Regimes</h2>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {REGIMES.map((r) => (
            <span key={r} className="inline-flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: REGIME_COLORS[r] }}
              />
              {r}
            </span>
          ))}
        </div>
      </div>
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.prices} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={CHART.grid} vertical={false} />
            {bands.map((b) => (
              <ReferenceArea
                key={b.start}
                x1={b.start}
                x2={b.end}
                fill={REGIME_COLORS[b.regime]}
                fillOpacity={0.12}
                strokeOpacity={0}
              />
            ))}
            <XAxis
              dataKey="date"
              tickFormatter={shortDate}
              stroke={CHART.axis}
              tickLine={false}
              fontSize={12}
              minTickGap={24}
            />
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
              contentStyle={{
                background: CHART.card,
                border: `1px solid ${CHART.grid}`,
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(v: number) => [currency(v), "Close"]}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke={CHART.amber}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
