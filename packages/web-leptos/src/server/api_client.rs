//! reqwest-based HTTP client for the Elysia API (localhost:3400/api/v1).
//!
//! All methods are async and return Result types. Only compiled under the `ssr` feature.

use std::collections::HashMap;

use crate::models::api::{
    ApiResponse, AuthTokenRequest, AuthTokenResponse, EvalRequest, EvalResponse,
};

/// HTTP client targeting the Elysia REST API.
#[derive(Clone, Debug)]
pub struct ElysiaClient {
    http: reqwest::Client,
    base_url: String,
}

/// Errors that can occur when communicating with the Elysia API.
#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error("HTTP request failed: {0}")]
    Http(#[from] reqwest::Error),
    #[error("API returned {status}: {body}")]
    Status { status: u16, body: String },
    #[error("Deserialization failed: {0}")]
    Deserialize(String),
}

impl ElysiaClient {
    /// Create a new client pointing at the given base URL.
    ///
    /// ```
    /// let client = ElysiaClient::new("http://localhost:3400/api/v1");
    /// ```
    pub fn new(base_url: &str) -> Self {
        Self {
            http: reqwest::Client::new(),
            base_url: base_url.trim_end_matches('/').to_string(),
        }
    }

    /// Create a client from the `API_URL` environment variable,
    /// falling back to `http://localhost:3400/api/v1`.
    pub fn from_env() -> Self {
        let url = std::env::var("API_URL")
            .unwrap_or_else(|_| "http://localhost:3400/api/v1".to_string());
        Self::new(&url)
    }

    // ─── Auth ────────────────────────────────────────────────────────

    /// Exchange MoneyWorks credentials for an access token.
    ///
    /// POST /auth/token
    pub async fn auth_token(
        &self,
        host: &str,
        port: u16,
        data_file: &str,
        username: &str,
        password: &str,
    ) -> Result<AuthTokenResponse, ApiError> {
        let body = AuthTokenRequest {
            host: host.to_string(),
            port,
            data_file: data_file.to_string(),
            username: username.to_string(),
            password: password.to_string(),
            folder_name: None,
            folder_password: None,
            description: None,
        };

        let resp = self
            .http
            .post(format!("{}/auth/token", self.base_url))
            .json(&body)
            .send()
            .await?;

        if !resp.status().is_success() {
            let status = resp.status().as_u16();
            let body = resp.text().await.unwrap_or_default();
            return Err(ApiError::Status { status, body });
        }

        resp.json::<AuthTokenResponse>()
            .await
            .map_err(|e| ApiError::Deserialize(e.to_string()))
    }

    // ─── Generic GET with bearer token ───────────────────────────────

    /// Perform an authenticated GET request and deserialize the response.
    ///
    /// `params` is a list of (key, value) query parameters appended to the URL.
    pub async fn get<T: serde::de::DeserializeOwned>(
        &self,
        path: &str,
        token: &str,
        params: &[(&str, &str)],
    ) -> Result<ApiResponse<T>, ApiError> {
        let url = format!("{}{}", self.base_url, path);

        let mut req = self
            .http
            .get(&url)
            .bearer_auth(token);

        for (key, value) in params {
            req = req.query(&[(key, value)]);
        }

        let resp = req.send().await?;

        if !resp.status().is_success() {
            let status = resp.status().as_u16();
            let body = resp.text().await.unwrap_or_default();
            return Err(ApiError::Status { status, body });
        }

        resp.json::<ApiResponse<T>>()
            .await
            .map_err(|e| ApiError::Deserialize(e.to_string()))
    }

    // ─── Eval (single expression) ────────────────────────────────────

    /// Evaluate a single MWScript expression.
    ///
    /// POST /eval  with body `{ "expression": "..." }`
    ///
    /// Returns the result string, or an empty string on failure.
    pub async fn eval(&self, expression: &str, token: &str) -> Result<String, ApiError> {
        let body = EvalRequest {
            expression: expression.to_string(),
        };

        let resp = self
            .http
            .post(format!("{}/eval", self.base_url))
            .bearer_auth(token)
            .json(&body)
            .send()
            .await?;

        if !resp.status().is_success() {
            let status = resp.status().as_u16();
            let text = resp.text().await.unwrap_or_default();
            return Err(ApiError::Status {
                status,
                body: text,
            });
        }

        let wrapper: ApiResponse<EvalResponse> = resp
            .json()
            .await
            .map_err(|e| ApiError::Deserialize(e.to_string()))?;

        Ok(wrapper
            .data
            .map(|d| d.result)
            .unwrap_or_default())
    }

    // ─── Eval batch (parallel, mirrors SvelteKit apiEvalBatch) ───────

    /// Evaluate multiple MWScript expressions in parallel.
    ///
    /// Each entry in `expressions` maps a label to an MWScript expression string.
    /// Returns a HashMap with the same keys mapped to their result strings.
    ///
    /// This mirrors the SvelteKit `apiEvalBatch` which fires N individual
    /// POST /eval requests in parallel (there is no server-side batch endpoint).
    pub async fn eval_batch(
        &self,
        expressions: &HashMap<String, String>,
        token: &str,
    ) -> Result<HashMap<String, String>, ApiError> {
        let keys: Vec<String> = expressions.keys().cloned().collect();
        let exprs: Vec<String> = keys.iter().map(|k| expressions[k].clone()).collect();

        // Fire all requests concurrently
        let futures: Vec<_> = exprs
            .iter()
            .map(|expr| self.eval(expr, token))
            .collect();

        let results = futures::future::join_all(futures).await;

        let mut out = HashMap::with_capacity(keys.len());
        for i in 0..keys.len() {
            let value = match &results[i] {
                Ok(v) => v.clone(),
                Err(_) => String::new(),
            };
            out.insert(keys[i].clone(), value);
        }

        Ok(out)
    }
}
