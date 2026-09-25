export type Regime = "Bull" | "Bear" | "Sideways" | "High Volatility";

export type ModelKey = "naive" | "xgboost" | "lstm" | "btc_adapt";

export interface Metric {
  mae: number;
  rmse: number;
  mape: number;
  directional_accuracy: number;
}

export interface BtcAdaptResults {
  prices: { date: string; close: number }[];
  regimes: { date: string; regime: Regime }[];
  predictions: { date: string; actual: number; predicted: number }[];
  weights_by_regime: Record<Regime, { naive: number; xgboost: number; lstm: number }>;
  metrics: Record<ModelKey, Metric>;
  current_regime: Regime;
  current_price: number;
  predicted_next_price: number;
  predicted_next_return: number;
}

export const REGIME_COLORS: Record<Regime, string> = {
  Bull: "#22c55e",
  Bear: "#ef4444",
  Sideways: "#64748b",
  "High Volatility": "#f97316",
};

export const REGIMES: Regime[] = ["Bull", "Bear", "Sideways", "High Volatility"];

export const CHART = {
  amber: "#f59e0b",
  grid: "#242430",
  axis: "#8b8b9a",
  card: "#13131a",
  actual: "#e5e7eb",
};

export const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const shortDate = (d: string) => d.slice(5);

export function regimeBands(regimes: { date: string; regime: Regime }[]) {
  const bands: { start: string; end: string; regime: Regime }[] = [];
  for (const r of regimes) {
    const last = bands[bands.length - 1];
    if (last && last.regime === r.regime) last.end = r.date;
    else bands.push({ start: r.date, end: r.date, regime: r.regime });
  }
  return bands;
}

export const MODEL_META = [
  { key: "naive", label: "Naive", color: "#64748b" },
  { key: "xgboost", label: "XGBoost", color: "#38bdf8" },
  { key: "lstm", label: "LSTM", color: "#a78bfa" },
  { key: "btc_adapt", label: "BTC-Adapt", color: "#f59e0b" },
] as const;

export const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#0b0b10",
    border: "1px solid #f59e0b",
    borderRadius: 10,
    fontSize: 12,
    color: "#e5e7eb",
  },
  labelStyle: { color: "#f59e0b", fontWeight: 600 },
  itemStyle: { color: "#e5e7eb" },
};

/** Pipeline exports predicted_next_return as a fraction (0.0142 = +1.42%). */
export const pct = (fraction: number, digits = 2) =>
  `${fraction >= 0 ? "+" : "−"}${Math.abs(fraction * 100).toFixed(digits)}%`;
