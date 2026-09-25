import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART, currency, shortDate, type BtcAdaptResults } from "@/lib/btc-adapt";

export function ActualVsPredicted({ data }: { data: BtcAdaptResults }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <h2 className="text-base font-semibold">Actual vs Predicted</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Walk-forward backtest, BTC-Adapt ensemble output
      </p>
      <div className="mt-4 h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.predictions} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={CHART.grid} vertical={false} />
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
              formatter={(v: number, n: string) => [currency(v), n]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              isAnimationActive={false}
              type="monotone"
              name="Actual"
              dataKey="actual"
              stroke={CHART.actual}
              strokeWidth={2}
              dot={false}
            />
            <Line
              isAnimationActive={false}
              type="monotone"
              name="Predicted"
              dataKey="predicted"
              stroke={CHART.amber}
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
