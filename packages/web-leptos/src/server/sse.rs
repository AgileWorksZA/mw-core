//! Server-Sent Events support (placeholder).
//!
//! This module will provide SSE streaming for real-time dashboard updates.

use axum::response::sse::{Event, Sse};
use futures::stream;
use std::convert::Infallible;

/// Placeholder SSE endpoint for dashboard real-time updates.
pub async fn dashboard_sse() -> Sse<impl futures::Stream<Item = Result<Event, Infallible>>> {
    Sse::new(stream::empty())
}
