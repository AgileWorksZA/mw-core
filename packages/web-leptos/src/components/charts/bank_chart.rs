use leptos::prelude::*;

pub use crate::models::dashboard::BankAccount;

/// Chart dimensions for the bank balance chart.
const B_W: f64 = 320.0;
const B_H: f64 = 160.0;
const B_PAD_TOP: f64 = 10.0;
const B_PAD_RIGHT: f64 = 10.0;
const B_PAD_BOTTOM: f64 = 30.0;
const B_PAD_LEFT: f64 = 60.0;

fn b_plot_w() -> f64 { B_W - B_PAD_LEFT - B_PAD_RIGHT }
fn b_plot_h() -> f64 { B_H - B_PAD_TOP - B_PAD_BOTTOM }

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

/// SVG vertical bar chart for bank account balances.
///
/// Ported from the SvelteKit dashboard +page.svelte bank balances section.
/// Positive balances use `var(--color-chart-positive)`, negative use `var(--color-chart-negative)`.
/// Below the chart, a list shows each bank account with its formatted balance.
#[component]
pub fn BankChart(
    /// Bank account data to render.
    data: Vec<BankAccount>,
) -> impl IntoView {
    view! {
        {move || {
            let accounts = data.clone();
            if accounts.is_empty() {
                return view! {
                    <div class="flex h-40 items-center justify-center text-muted-foreground text-sm">
                        "No bank accounts"
                    </div>
                }.into_any();
            }

            let bank_max = accounts.iter().map(|b| b.balance.abs()).fold(1.0_f64, f64::max);
            let count = accounts.len() as f64;
            let b_bar_gap = b_plot_w() / count;
            let b_bar_w = f64::min(40.0, b_bar_gap * 0.7);

            // Y-axis ticks
            let ticks = y_ticks(0.0, bank_max);
            let tick_views: Vec<_> = ticks.iter().map(|&tick| {
                let y = B_PAD_TOP + b_plot_h() - (tick / bank_max) * b_plot_h();
                let label = fmt_k(tick);
                view! {
                    <line x1={B_PAD_LEFT.to_string()} y1={y.to_string()} x2={(B_W - B_PAD_RIGHT).to_string()} y2={y.to_string()} stroke="currentColor" stroke-opacity="0.1" />
                    <text x={(B_PAD_LEFT - 6.0).to_string()} y={(y + 3.0).to_string()} text-anchor="end" fill="currentColor" opacity="0.5" font-size="9">{label}</text>
                }
            }).collect();

            // Bars
            let bar_views: Vec<_> = accounts.iter().enumerate().map(|(i, bank)| {
                let x = B_PAD_LEFT + i as f64 * b_bar_gap + (b_bar_gap - b_bar_w) / 2.0;
                let h = (bank.balance.abs() / bank_max) * b_plot_h();
                let y = if bank.balance >= 0.0 {
                    B_PAD_TOP + b_plot_h() - h
                } else {
                    B_PAD_TOP + b_plot_h()
                };
                let fill = if bank.balance >= 0.0 {
                    "var(--color-chart-positive)"
                } else {
                    "var(--color-chart-negative)"
                };
                let code = bank.code.clone();
                view! {
                    <rect x={x.to_string()} y={y.to_string()} width={b_bar_w.to_string()} height={h.to_string()} fill=fill rx="2" opacity="0.8" />
                    <text x={(x + b_bar_w / 2.0).to_string()} y={(B_H - 6.0).to_string()} text-anchor="middle" fill="currentColor" opacity="0.5" font-size="8">{code}</text>
                }
            }).collect();

            // Detail list below chart
            let detail_views: Vec<_> = accounts.iter().map(|bank| {
                let desc = format!("{} ({})", bank.description, bank.code);
                let formatted = super::super::currency_display::format_currency_value(bank.balance);
                let text_class = if bank.balance < 0.0 { "font-medium text-destructive" } else { "font-medium" };
                view! {
                    <div class="flex justify-between text-xs hover:bg-surface-container-low transition-colors">
                        <span class="text-muted-foreground">{desc}</span>
                        <span class=text_class>{formatted}</span>
                    </div>
                }
            }).collect();

            view! {
                <div>
                    <svg viewBox={format!("0 0 {} {}", B_W, B_H)} class="w-full" preserveAspectRatio="xMidYMid meet">
                        {tick_views}
                        {bar_views}
                    </svg>
                    <div class="mt-1 space-y-1 tabular-nums">
                        {detail_views}
                    </div>
                </div>
            }.into_any()
        }}
    }
}
