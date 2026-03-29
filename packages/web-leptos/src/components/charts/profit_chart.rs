use leptos::prelude::*;

pub use crate::models::dashboard::ProfitMonth;

/// Chart dimensions and padding constants.
const CHART_W: f64 = 400.0;
const CHART_H: f64 = 200.0;
const PAD_TOP: f64 = 20.0;
const PAD_RIGHT: f64 = 20.0;
const PAD_BOTTOM: f64 = 30.0;
const PAD_LEFT: f64 = 60.0;

fn plot_w() -> f64 { CHART_W - PAD_LEFT - PAD_RIGHT }
fn plot_h() -> f64 { CHART_H - PAD_TOP - PAD_BOTTOM }

/// Compute Y coordinate for a given value within the profit range.
fn profit_y(v: f64, min: f64, range: f64) -> f64 {
    PAD_TOP + plot_h() - ((v - min) / range) * plot_h()
}

/// Generate 5 evenly-spaced Y-axis ticks between min and max.
fn y_ticks(min: f64, max: f64) -> Vec<f64> {
    let range = if (max - min).abs() < f64::EPSILON { 1.0 } else { max - min };
    let step = range / 4.0;
    let mut ticks = Vec::with_capacity(5);
    for i in 0..=4 {
        ticks.push(min + step * i as f64);
    }
    ticks
}

/// Format a number as compact (e.g. 1200 -> "1k", 500 -> "500").
fn fmt_k(v: f64) -> String {
    if v.abs() >= 1000.0 {
        format!("{}k", (v / 1000.0) as i64)
    } else {
        format!("{}", v as i64)
    }
}

/// Build an SVG line path from a list of (x, y) points.
fn line_path(points: &[(f64, f64)]) -> String {
    if points.is_empty() {
        return String::new();
    }
    let mut d = format!("M {} {}", points[0].0, points[0].1);
    for i in 1..points.len() {
        d.push_str(&format!(" L {} {}", points[i].0, points[i].1));
    }
    d
}

/// SVG profit chart: income bars + expense line + profit line.
///
/// Ported from the SvelteKit dashboard +page.svelte profit chart section.
/// Uses CSS custom properties for colors:
/// - `var(--color-chart-income)` for income bars
/// - `var(--color-chart-expenses)` for expense line
/// - `var(--color-chart-profit)` for profit line
#[component]
pub fn ProfitChart(
    /// Monthly data points to render.
    data: Vec<ProfitMonth>,
) -> impl IntoView {
    view! {
        {move || {
            let months = data.clone();
            if months.is_empty() {
                return view! {
                    <div class="flex h-40 items-center justify-center text-muted-foreground text-sm">
                        "No data"
                    </div>
                }.into_any();
            }

            // Compute scales
            let mut all_values: Vec<f64> = Vec::new();
            for m in &months {
                all_values.push(m.income);
                all_values.push(m.expenses);
                all_values.push(m.profit);
            }
            let profit_max = all_values.iter().cloned().fold(1.0_f64, f64::max);
            let profit_min = all_values.iter().cloned().fold(0.0_f64, f64::min);
            let profit_range = if (profit_max - profit_min).abs() < f64::EPSILON { 1.0 } else { profit_max - profit_min };

            let count = months.len() as f64;
            let bar_gap = plot_w() / count;
            let bar_width = bar_gap * 0.6;

            let zero_y = profit_y(0.0, profit_min, profit_range);

            // Tick marks
            let ticks = y_ticks(profit_min, profit_max);
            let tick_views: Vec<_> = ticks.iter().map(|&tick| {
                let y = profit_y(tick, profit_min, profit_range);
                let label = fmt_k(tick);
                view! {
                    <line x1={PAD_LEFT.to_string()} y1={y.to_string()} x2={(CHART_W - PAD_RIGHT).to_string()} y2={y.to_string()} stroke="currentColor" stroke-opacity="0.1" />
                    <text x={(PAD_LEFT - 6.0).to_string()} y={(y + 3.0).to_string()} text-anchor="end" fill="currentColor" opacity="0.5" font-size="9">{label}</text>
                }
            }).collect();

            // Zero line (if range spans zero)
            let zero_line = if profit_min < 0.0 && profit_max > 0.0 {
                Some(view! {
                    <line x1={PAD_LEFT.to_string()} y1={zero_y.to_string()} x2={(CHART_W - PAD_RIGHT).to_string()} y2={zero_y.to_string()} stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4,3" />
                })
            } else {
                None
            };

            // Income bars
            let bar_views: Vec<_> = months.iter().enumerate().map(|(i, m)| {
                let x = PAD_LEFT + i as f64 * bar_gap + (bar_gap - bar_width) / 2.0;
                let y = profit_y(f64::max(m.income, 0.0), profit_min, profit_range);
                let h = (profit_y(m.income, profit_min, profit_range) - profit_y(0.0, profit_min, profit_range)).abs();
                view! {
                    <rect x={x.to_string()} y={y.to_string()} width={bar_width.to_string()} height={h.to_string()} fill="var(--color-chart-income)" rx="2" opacity="0.7" />
                }
            }).collect();

            // Expense line + dots
            let expense_points: Vec<(f64, f64)> = months.iter().enumerate().map(|(i, m)| {
                (PAD_LEFT + i as f64 * bar_gap + bar_gap / 2.0, profit_y(m.expenses, profit_min, profit_range))
            }).collect();
            let expense_path = line_path(&expense_points);
            let expense_dots: Vec<_> = expense_points.iter().map(|(x, y)| {
                view! {
                    <circle cx={x.to_string()} cy={y.to_string()} r="3" fill="var(--color-chart-expenses)" />
                }
            }).collect();

            // Profit line + dots
            let profit_points: Vec<(f64, f64)> = months.iter().enumerate().map(|(i, m)| {
                (PAD_LEFT + i as f64 * bar_gap + bar_gap / 2.0, profit_y(m.profit, profit_min, profit_range))
            }).collect();
            let profit_path_d = line_path(&profit_points);
            let profit_dots: Vec<_> = profit_points.iter().map(|(x, y)| {
                view! {
                    <circle cx={x.to_string()} cy={y.to_string()} r="3" fill="var(--color-chart-profit)" />
                }
            }).collect();

            // X labels
            let x_labels: Vec<_> = months.iter().enumerate().map(|(i, m)| {
                let x = PAD_LEFT + i as f64 * bar_gap + bar_gap / 2.0;
                let label = m.label.clone();
                view! {
                    <text x={x.to_string()} y={(CHART_H - 6.0).to_string()} text-anchor="middle" fill="currentColor" opacity="0.5" font-size="9">{label}</text>
                }
            }).collect();

            view! {
                <div>
                    <svg viewBox={format!("0 0 {} {}", CHART_W, CHART_H)} class="w-full" preserveAspectRatio="xMidYMid meet">
                        {tick_views}
                        {zero_line}
                        {bar_views}
                        <path d={expense_path} fill="none" stroke="var(--color-chart-expenses)" stroke-width="2" />
                        {expense_dots}
                        <path d={profit_path_d} fill="none" stroke="var(--color-chart-profit)" stroke-width="2" />
                        {profit_dots}
                        {x_labels}
                    </svg>
                    <div class="mt-2 flex gap-4 text-xs text-muted-foreground">
                        <span class="flex items-center gap-1">
                            <span class="inline-block h-2 w-3 rounded" style="background: var(--color-chart-income)"></span>
                            "Income"
                        </span>
                        <span class="flex items-center gap-1">
                            <span class="inline-block h-2 w-3 rounded" style="background: var(--color-chart-expenses)"></span>
                            "Expenses"
                        </span>
                        <span class="flex items-center gap-1">
                            <span class="inline-block h-2 w-3 rounded" style="background: var(--color-chart-profit)"></span>
                            "Profit"
                        </span>
                    </div>
                </div>
            }.into_any()
        }}
    }
}
