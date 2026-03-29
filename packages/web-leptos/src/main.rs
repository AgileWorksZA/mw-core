#[cfg(feature = "ssr")]
#[tokio::main]
async fn main() {
    use axum::Router;
    use leptos::logging::log;
    use leptos::prelude::*;
    use leptos_axum::{generate_route_list, LeptosRoutes};
    use mw_web_leptos::app::*;
    use mw_web_leptos::server::api_client::ElysiaClient;

    let conf = get_configuration(None).unwrap();
    let addr = conf.leptos_options.site_addr;
    let leptos_options = conf.leptos_options;
    let routes = generate_route_list(App);

    // Create the Elysia API client
    let api_client = ElysiaClient::new("http://localhost:3400/api/v1");

    // Auto-authenticate on startup (like SvelteKit hooks.server.ts)
    let token = api_client
        .auth_token(
            "localhost",
            6710,
            "Acme Widgets Gold.moneyworks",
            "Herman Geldenhuys",
            " ",
        )
        .await
        .map(|r| r.access_token)
        .unwrap_or_default();

    let app_state = AppState {
        leptos_options: leptos_options.clone(),
        api_client,
        token,
    };

    let app = Router::new()
        .route(
            "/api/sse/dashboard",
            axum::routing::get(mw_web_leptos::server::sse::dashboard_sse),
        )
        .leptos_routes(&app_state, routes, {
            let leptos_options = leptos_options.clone();
            move || shell(leptos_options.clone())
        })
        .fallback(leptos_axum::file_and_error_handler::<AppState, _>(shell))
        .with_state(app_state);

    log!("listening on http://{}", &addr);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}

#[cfg(not(feature = "ssr"))]
pub fn main() {}
