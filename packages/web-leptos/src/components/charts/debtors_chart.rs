use leptos::prelude::*;

/// Debtors aging bucket data.
#[derive(Clone, Debug)]
pub struct DebtorsBucket {
    pub label: String,
    pub value: f64,
    pub color: String,
}

pub use crate::models::dashboard::DebtorAging;

/// Chart dimensions for the debtors aging chart.
const D_W: f64 = 320.0;
const D_H: f64 = 160.0;
const D_PAD_TOP: f64 = 10.0;
const D_PAD_RIGHT: f64 = 10.0;
const D_PAD_BOTTOM: f64 = 30.0;
const D_PAD_LEFT: f64 = 60.0;

fn d_plot_w() -> f64 { D_W - D_PAD_LEFT - D_PAD_RIGHT }
fn d_plot_h() -> f64 { D_H - D_PAD_TOP - D_PAD_BOTTOM }

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

/// Format a number as compact (e.g. 1200 -> "1k").
fn fmt_k(v: f64) -> String {
    if v.abs() >= 1000.0 {
        format!("{}k", (v / 1000.0) as i64)
    } else {
        format!("{}", v as i64)
    }
}

/// Create the default four debtors aging buckets from raw values.
///
/// Returns buckets in display order: 3 months+, 2 months, 1 month, Current.
/// Uses CSS custom properties for colors matching the SvelteKit design system.
pub fn default_buckets(current: f64, one_cycle: f64, two_cycles: f64, three_or_more: f64) -> Vec<DebtorsBucket> {
    vec![
        DebtorsBucket { label: "3 months+".to_string(), value: three_or_more, color: "var(--color-chart-1)".to_string() },
        DebtorsBucket { label: "2 months".to_string(), value: two_cycles, color: "var(--color-chart-6)".to_string() },
        DebtorsBucket { label: "1 month".to_string(), value: one_cycle, color: "var(--color-chart-3)".to_string() },
        DebtorsBucket { label: "Current".to_string(), value: current, color: "var(--color-chart-4)".to_string() },
    ]
}

/// SVG bar chart for debtors aging buckets.
///
/// Ported from the SvelteKit dashboard +page.svelte debtors chart section.
/// Displays vertical bars for each aging bucket with Y-axis ticks and labels.
/// Below the chart shows total debtors amount.
#[component]
pub fn DebtorsChart(
    /// Debtor aging data from the dashboard model.
    debtors: DebtorAging,
) -> impl IntoView {
    view! {
        {move || {
            let buckets = default_buckets(debtors.current, debtors.one_cycle, debtors.two_cycles, debtors.three_or_more);
            let total_val = debtors.current + debtors.one_cycle + debtors.two_cycles + debtors.three_or_more;

            if total_val <= 0.0 || buckets.is_empty() {
                return view! {
                    <div class="flex h-40 items-center justify-center text-muted-foreground text-sm">
                        "No debtors"
                    </div>
                }.into_any();
            }

            let debtor_max = buckets.iter().map(|b| b.value.abs()).fold(1.0_f64, f64::max);
            let count = buckets.len() as f64;
            let d_bar_gap = d_plot_w() / count;
            let d_bar_w = f64::min(50.0, d_bar_gap * 0.7);

            // Y-axis ticks
            let ticks = y_ticks(0.0, debtor_max);
            let tick_views: Vec<_> = ticks.iter().map(|&tick| {
                let y = D_PAD_TOP + d_plot_h() - (tick / debtor_max) * d_plot_h();
                let label = fmt_k(tick);
                view! {
                    <line x1={D_PAD_LEFT.to_string()} y1={y.to_string()} x2={(D_W - D_PAD_RIGHT).to_string()} y2={y.to_string()} stroke="currentColor" stroke-opacity="0.1" />
                    <text x={(D_PAD_LEFT - 6.0).to_string()} y={(y + 3.0).to_string()} text-anchor="end" fill="currentColor" opacity="0.5" font-size="9">{label}</text>
                }
            }).collect();

            // Bars
            let bar_views: Vec<_> = buckets.iter().enumerate().map(|(i, bucket)| {
                let x = D_PAD_LEFT + i as f64 * d_bar_gap + (d_bar_gap - d_bar_w) / 2.0;
                let h = (bucket.value.abs() / debtor_max) * d_plot_h();
                let y = D_PAD_TOP + d_plot_h() - h;
                let fill = bucket.color.clone();
                let label = bucket.label.clone();
                view! {
                    <rect x={x.to_string()} y={y.to_string()} width={d_bar_w.to_string()} height={h.to_string()} fill=fill rx="2" opacity="0.8" />
                    <text x={(x + d_bar_w / 2.0).to_string()} y={(D_H - 6.0).to_string()} text-anchor="middle" fill="currentColor" opacity="0.5" font-size="8">{label}</text>
                }
            }).collect();

            // Total line below
            let total_formatted = super::super::currency_display::format_currency_value(total_val);

            view! {
                <div>
                    <svg viewBox={format!("0 0 {} {}", D_W, D_H)} class="w-full" preserveAspectRatio="xMidYMid meet">
                        {tick_views}
                        {bar_views}
                    </svg>
                    <div class="mt-2 flex justify-between text-xs tabular-nums">
                        <span class="text-muted-foreground">"Total Debtors"</span>
                        <span class="font-semibold">{total_formatted}</span>
                    </div>
                </div>
            }.into_any()
        }}
    }
}
