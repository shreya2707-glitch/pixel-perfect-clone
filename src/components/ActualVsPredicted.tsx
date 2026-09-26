import { Brush, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART, TOOLTIP_STYLE, currency, shortDate, type BtcAdaptResults } from "@/lib/btc-adapt";

function nextDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

const NEXT_COLOR = "#22d3ee";

function StarDot(props: { cx?: number; cy?: number }) {
  const { cx = 0, cy = 0 } = props;
  const r = 8;
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    return `${cx + rad * Math.cos(angle)},${cy + rad * Math.sin(angle)}`;
  }).join(" ");
  return <polygon points={points} fill={NEXT_COLOR} stroke="#0b0b10" strokeWidth={1.5} />;
}

export function ActualVsPredicted({ data }: { data: BtcAdaptResults }) {
  const n = data.predictions.length;
  const last = data.predictions[n - 1];
  const nextPt = { date: nextDate(last.date), actual: undefined, predicted: undefined, next: data.predicted_next_price };
  // Bridge point so the dashed connector starts at the last actual value.
  const bridge = { ...last, predicted: undefined, next: last.actual };
  const rows = [...data.predictions.slice(0, -1), bridge, nextPt];

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <h2 className="text-base font-semibold">Actual vs Predicted</h2>
      <p className="mt-1 text-xs text-muted-foreground">Walk-forward backtest · drag the handles below the chart to zoom into a window</p>
      <div className="mt-4 h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={CHART.grid} vertical={false} />
            <XAxis dataKey="date" tickFormatter={shortDate} stroke={CHART.axis} tickLine={false} fontSize={12} minTickGap={24} />
            <YAxis stroke={CHART.axis} tickLine={false} axisLine={false} fontSize={12} width={70} domain={["auto", "auto"]} tickFormatter={(v: number) => currency(v)} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: number, name: string) => [currency(v), name]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line isAnimationActive={false} type="monotone" dataKey="actual" name="Actual" stroke={CHART.actual} strokeWidth={2} dot={false} />
            <Line isAnimationActive={false} type="monotone" dataKey="predicted" name="BTC-Adapt" stroke={CHART.amber} strokeWidth={2} strokeDasharray="5 4" dot={false} />
            <Line
              isAnimationActive={false}
              type="monotone"
              dataKey="next"
              name="Tomorrow (forecast)"
              stroke={NEXT_COLOR}
              strokeWidth={2}
              strokeDasharray="3 5"
              dot={<StarDot />}
              connectNulls
            />
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
