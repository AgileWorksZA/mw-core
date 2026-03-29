//! Server-Sent Events support for real-time dashboard updates.
//!
//! Streams DashboardData JSON every 30 seconds to connected clients.

use axum::{
    extract::State,
    response::sse::{Event, KeepAlive, Sse},
};
use futures::stream::Stream;
use std::convert::Infallible;

use crate::app::AppState;
use crate::pages::dashboard::fetch_dashboard_data;

/// SSE endpoint that streams DashboardData JSON every 30 seconds.
pub async fn dashboard_sse(
    State(state): State<AppState>,
) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let stream = async_stream::stream! {
        loop {
            match fetch_dashboard_data(&state.api_client, &state.token).await {
                Ok(data) => {
                    if let Ok(json) = serde_json::to_string(&data) {
                        yield Ok(Event::default().event("dashboard").data(json));
                    }
                }
                Err(e) => {
                    yield Ok(Event::default().event("error").data(e));
                }
            }
            tokio::time::sleep(std::time::Duration::from_secs(30)).await;
        }
    };

    Sse::new(stream).keep_alive(KeepAlive::default())
}
