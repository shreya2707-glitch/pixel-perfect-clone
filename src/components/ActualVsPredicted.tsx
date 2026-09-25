import { Brush, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART, TOOLTIP_STYLE, currency, shortDate, type BtcAdaptResults } from "@/lib/btc-adapt";

export function ActualVsPredicted({ data }: { data: BtcAdaptResults }) {
  const n = data.predictions.length;
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <h2 className="text-base font-semibold">Actual vs Predicted</h2>
      <p className="mt-1 text-xs text-muted-foreground">Walk-forward backtest · drag the handles below the chart to zoom into a window</p>
      <div className="mt-4 h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.predictions} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={CHART.grid} vertical={false} />
            <XAxis dataKey="date" tickFormatter={shortDate} stroke={CHART.axis} tickLine={false} fontSize={12} minTickGap={24} />
            <YAxis stroke={CHART.axis} tickLine={false} axisLine={false} fontSize={12} width={70} domain={["auto", "auto"]} tickFormatter={(v: number) => currency(v)} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: number, name: string) => [currency(v), name]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line isAnimationActive={false} type="monotone" dataKey="actual" name="Actual" stroke={CHART.actual} strokeWidth={2} dot={false} />
            <Line isAnimationActive={false} type="monotone" dataKey="predicted" name="BTC-Adapt" stroke={CHART.amber} strokeWidth={2} strokeDasharray="5 4" dot={false} />
            <Brush
              dataKey="date"
              height={26}
              stroke={CHART.amber}
              fill={CHART.card}
              travellerWidth={10}
              tickFormatter={shortDate}
              startIndex={Math.max(0, n - 45)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
