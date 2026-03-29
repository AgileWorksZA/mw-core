use leptos::prelude::*;

/// Column alignment options.
#[derive(Clone, Debug, Default, PartialEq)]
pub enum Align {
    #[default]
    Left,
    Right,
    Center,
}

/// Column definition for the data table.
#[derive(Clone, Debug)]
pub struct Column {
    /// Key used to look up the value in each row.
    pub key: &'static str,
    /// Header label.
    pub label: &'static str,
    /// Text alignment.
    pub align: Align,
    /// Whether to use monospace font for cell values.
    pub mono: bool,
    /// Extra CSS classes for the cell.
    pub class: &'static str,
}

impl Column {
    /// Create a new left-aligned column with defaults.
    pub fn new(key: &'static str, label: &'static str) -> Self {
        Self {
            key,
            label,
            align: Align::Left,
            mono: false,
            class: "",
        }
    }

    /// Set right alignment.
    pub fn right(mut self) -> Self {
        self.align = Align::Right;
        self
    }

    /// Set center alignment.
    pub fn center(mut self) -> Self {
        self.align = Align::Center;
        self
    }

    /// Set monospace font.
    pub fn mono(mut self) -> Self {
        self.mono = true;
        self
    }

    /// Set extra CSS class.
    pub fn class(mut self, class: &'static str) -> Self {
        self.class = class;
        self
    }
}

/// A generic row trait. Each page implements this for its own row type.
pub trait TableRow: Clone + 'static {
    /// Get a cell value as a string by column key.
    fn get(&self, key: &str) -> String;
}

/// Reusable data table component.
///
/// Uses Precision Ledger styling: bg-surface-container-lowest, hover states,
/// tabular-nums for numbers, no borders/shadows.
///
/// The `cell_renderer` prop allows pages to customise individual cell rendering.
/// When None, the default text renderer is used.
#[component]
pub fn DataTable<R, F>(
    /// Column definitions.
    columns: Vec<Column>,
    /// Data rows.
    rows: Vec<R>,
    /// Message shown when rows is empty.
    #[prop(default = "No records found".to_string(), into)]
    empty_message: String,
    /// Optional custom cell renderer: (column_key, row) -> View.
    /// Return None to fall back to default text rendering.
    #[prop(optional)]
    cell_renderer: Option<F>,
) -> impl IntoView
where
    R: TableRow,
    F: Fn(&str, &R) -> Option<AnyView> + Clone + 'static,
{
    let col_count = columns.len();
    let is_empty = rows.is_empty();

    view! {
        <div class="overflow-auto rounded-xl bg-surface-container-lowest">
            <table class="w-full text-sm">
                <thead class="sticky top-0">
                    <tr class="bg-surface-container-low">
                        {columns.iter().map(|col| {
                            let align_class = match col.align {
                                Align::Right => "text-right",
                                Align::Center => "text-center",
                                Align::Left => "text-left",
                            };
                            let label = col.label;
                            view! {
                                <th class=format!("px-3 py-2.5 font-medium text-muted-foreground {align_class}")>
                                    {label}
                                </th>
                            }
                        }).collect::<Vec<_>>()}
                    </tr>
                </thead>
                <tbody>
                    {if is_empty {
                        let msg = empty_message.clone();
                        view! {
                            <tr>
                                <td colspan=col_count class="px-3 py-8 text-center text-muted-foreground">
                                    {msg}
                                </td>
                            </tr>
                        }.into_any()
                    } else {
                        view! {
                            {rows.into_iter().map(|row| {
                                let renderer = cell_renderer.clone();
                                let cols = columns.clone();
                                view! {
                                    <tr class="transition-colors hover:bg-surface-container-low">
                                        {cols.into_iter().map(|col| {
                                            let align_class = match col.align {
                                                Align::Right => " text-right",
                                                Align::Center => " text-center",
                                                Align::Left => "",
                                            };
                                            let mono_class = if col.mono { " font-mono text-xs" } else { "" };
                                            let extra = if col.class.is_empty() { "" } else { col.class };
                                            let cell_class = format!("px-3 py-2{align_class}{mono_class} {extra}");

                                            // Try custom renderer first
                                            let custom = renderer.as_ref().and_then(|r| r(col.key, &row));
                                            if let Some(custom_view) = custom {
                                                view! {
                                                    <td class=cell_class>
                                                        {custom_view}
                                                    </td>
                                                }.into_any()
                                            } else {
                                                let value = row.get(col.key);
                                                view! {
                                                    <td class=cell_class>
                                                        {value}
                                                    </td>
                                                }.into_any()
                                            }
                                        }).collect::<Vec<_>>()}
                                    </tr>
                                }
                            }).collect::<Vec<_>>()}
                        }.into_any()
                    }}
                </tbody>
            </table>
        </div>
    }
}
