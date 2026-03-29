use leptos::prelude::*;

/// Format a number as currency with 2 decimal places and thousands separators.
///
/// Renders inside a `<span class="tabular-nums">` for aligned numeric display.
/// Negative values additionally receive the `text-destructive` class.
#[component]
pub fn CurrencyDisplay(
    /// The numeric amount to display.
    #[prop(into)]
    amount: Signal<f64>,
    /// Optional currency prefix (e.g. "NZD", "$").
    #[prop(optional, into)]
    currency: String,
) -> impl IntoView {
    let currency = currency.clone();

    let formatted = move || {
        let val = amount.get();
        format_currency_value(val)
    };

    let class = move || {
        let val = amount.get();
        if val < 0.0 {
            "tabular-nums text-destructive"
        } else {
            "tabular-nums"
        }
    };

    view! {
        <span class=class>
            {if !currency.is_empty() {
                let c = currency.clone();
                Some(view! { <span>{c}" "</span> })
            } else {
                None
            }}
            {formatted}
        </span>
    }
}

/// Format a float with 2 decimal places and thousands separators.
///
/// Public so chart components can reuse the same formatting logic.
///
/// Examples:
///   1234567.89  -> "1,234,567.89"
///   -42.5       -> "-42.50"
///   0.0         -> "0.00"
pub fn format_currency_value(value: f64) -> String {
    let is_negative = value < 0.0;
    let abs_val = value.abs();

    // Split into integer and fractional parts with 2-decimal rounding.
    let cents = (abs_val * 100.0).round() as u64;
    let integer_part = cents / 100;
    let fractional_part = cents % 100;

    // Build integer string with thousands separators.
    let int_str = integer_part.to_string();
    let mut with_commas = String::new();
    let digits: Vec<char> = int_str.chars().collect();
    let len = digits.len();
    for i in 0..len {
        if i > 0 && (len - i) % 3 == 0 {
            with_commas.push(',');
        }
        with_commas.push(digits[i]);
    }

    let sign = if is_negative { "-" } else { "" };
    format!("{}{}.{:02}", sign, with_commas, fractional_part)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_format_currency_positive() {
        assert_eq!(format_currency_value(1234567.89), "1,234,567.89");
    }

    #[test]
    fn test_format_currency_negative() {
        assert_eq!(format_currency_value(-42.5), "-42.50");
    }

    #[test]
    fn test_format_currency_zero() {
        assert_eq!(format_currency_value(0.0), "0.00");
    }

    #[test]
    fn test_format_currency_small() {
        assert_eq!(format_currency_value(0.01), "0.01");
    }

    #[test]
    fn test_format_currency_thousands() {
        assert_eq!(format_currency_value(999999.99), "999,999.99");
    }
}
