Below is a markdown specification you can drop into **`mw-core/docs/MoneyWorks-KB-Spec.md`**.
It formalises everything we discussed—crawler, chunker, index, API wrapper, nightly refresh, security, and roll-out milestones—so the team can start implementation immediately.

---

## MoneyWorks Knowledge-Base Tool — Technical Specification

### 1  Purpose & Vision

Build an internal tool that mirrors the entire MoneyWorks online manual and developer site, indexes it, and exposes a fast retrieval API so AI coding agents (and humans) can answer MoneyWorks-specific questions with canonical, citation-ready snippets. This removes guesswork in API v2 development and enables semantic, type-safe abstractions over MoneyWorks codes. ([cognito.co.nz][1])

### 2  Scope

| In-Scope                                                                  | Out-of-Scope                                 |
| ------------------------------------------------------------------------- | -------------------------------------------- |
| Crawl all pages under `https://cognito.co.nz/manual/**`, `…/developer/**` | Crawling pay-walled “Store” or blog sections |
| Extract HTML → Markdown → token-sized chunks                              | OCR or PDF parsing                           |
| Vector + keyword (BM25) hybrid search                                     | Full-text search UI (separate story)         |
| TypeScript client & function-calling schema                               | Writing LLM prompts for every use case       |
| Nightly incremental refresh                                               | Real-time change streaming                   |

### 3  Architecture Overview

```
            ┌──────────┐           ┌───────────────┐
            │Crawler   │  HTML     │HTML Snapshot  │
            │(Scrapy)  ├──────────►│Bucket (.html) │
            └────┬─────┘           └──────┬────────┘
                 │                        │
                 │                        ▼
         ┌───────▼───────┐       ┌──────────────────┐
         │Extractor      │ MD    │Markdown (.md)    │
         │(readability + │──────►│+ Chunk Metadata  │
         │ markdownify)  │       └────────┬─────────┘
         └───────────────┘                │
                                          ▼
                               ┌────────────────────┐
                               │Vector + BM25 Index │
                               │(pgvector + FTS)    │
                               └─────────┬──────────┘
                                         ▼
                             ┌────────────────────────┐
                             │`@agileworks/mw-kb` API │
                             │→ LLM / CLI / VS Code   │
                             └────────────────────────┘
```

* **Crawler** – headless Playwright fallback when pages need JS. ([playwright.dev][2], [playwright.dev][3])
* **Extractor** – `readability-lxml` to strip nav, `markdownify` to convert. ([pypi.org][4], [pypi.org][5])
* **Index** – pgvector for embeddings; Postgres FTS for exact code look-ups. ([github.com][6])
* **Embeddings** – OpenAI `text-embedding-3-large` (1536-dim). ([platform.openai.com][7])
* **Alt Vector Store** – Weaviate supported via feature flag. ([weaviate.io][8], [weaviate.io][9])
* **API Wrapper** – exposes `kb.query({ question, topK })`, `kb.raw({ url })`.

### 4  Detailed Component Specs

#### 4.1 Crawler

| Item             | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| Framework        | Scrapy 2.13 ([docs.scrapy.org][10])                      |
| Seed URLs        | `/manual/`, `/developer/`, `/manual/**`, `/developer/**` |
| Rate limit       | 1 req/sec; obey `robots.txt`                             |
| Change detection | Compare ETag/Last-Modified; skip unchanged pages         |
| Error retry      | Exponential backoff ×3                                   |

#### 4.2 Extraction & Chunking

* **Heading-aware split:** first split on `<h2>/<h3>`.
* **Token window:** 1 000 tokens with 200-token overlap.
* **Metadata:** `{url, title, hpath, crawl_ts, chunk_id}`.

#### 4.3 Vector & Keyword Index

* **Postgres 16 + pgvector 0.8.0** (HNSW index).
* **FTS column:** `to_tsvector('english', text)`.
* **Hybrid ranking:** `0.6 * cosine_sim + 0.4 * bm25`.

#### 4.4 Retrieval API (`@agileworks/mw-kb`)

```ts
export interface QueryOptions {
  question: string;
  topK?: number;        // default 5
  filter?: { url?: RegExp; hpath?: RegExp };
}

export interface ChunkHit {
  text: string;
  url: string;
  confidence: number;   // 0-1
}

kb.query(opts: QueryOptions): Promise<ChunkHit[]>;
kb.raw(url: string): Promise<string>;    // returns original MD
```

#### 4.5 Refresh Job

Nightly GitHub Action:

1. `npm run crawl:mw`
2. `npm run extract` – emit new/changed chunks
3. `npm run embed` – batch embed via OpenAI, upsert vectors
4. Slack summary on changed pages.

### 5  Performance Targets

| Metric                   | Target                            |
| ------------------------ | --------------------------------- |
| P95 query latency        | ≤ 350 ms for `topK = 5`           |
| Max drift from live site | < 24 h                            |
| Chunk accuracy           | ≥ 97 % relevant\@5 in manual eval |

### 6  Security & Licensing

* Docs are public; still cache raw HTML for offline use.
* Always return source URL for attribution.
* Respect Cognito copyright (no public redistribution).
* Store OpenAI keys in 1Password → GitHub Actions secrets.

### 7  Local Dev & CI

```bash
# bootstrap
brew install postgres
poetry install           # crawler & extractor
npm install              # API & TS client

# run everything locally
npm run crawl:mw
npm run dev              # TS client hot-reload
```

### 8  Milestones

| ID | Deliverable                              | Owner     | ETA    |
| -- | ---------------------------------------- | --------- | ------ |
| M1 | HTML snapshot & diff logic               | @data-eng | +0.5 d |
| M2 | MD extractor + chunker                   | @platform | +1 d   |
| M3 | pgvector index + hybrid query            | @platform | +1 d   |
| M4 | TypeScript client package                | @sdk      | +1 d   |
| M5 | Nightly GitHub Action                    | @dev-ops  | +0.5 d |
| M6 | Pilot integration in `MoneyWorksService` | @app-team | +1 d   |

Total: **≈ 4 dev-days** for POC; add 1 week hardening.

### 9  Open Questions / Risks

1. **Rate limiting** — Cognito may throttle; mitigate with caching proxy.
2. **Large pages** — Some MWScript refs exceed 50 KB; monitor chunk overflow. ([secure.cognito.co.nz][11])
3. **Schema drift** — Manual can change silently; nightly diff aims to catch but may miss renames.
4. **Embedding cost** — \~1 ¢ / 1 K chunks; budget for monthly re-embed.

---

**Next step:** create the directory `mw-core/docs/` (if not present) and commit this file as `MoneyWorks-KB-Spec.md`. From there we can open tickets per milestone and start coding.

[1]: https://www.cognito.co.nz/manual/?utm_source=chatgpt.com "moneyworks_index - Cognito"
[2]: https://playwright.dev/docs/browsers?utm_source=chatgpt.com "Browsers | Playwright"
[3]: https://playwright.dev/python/docs/library?utm_source=chatgpt.com "Getting started - Library | Playwright Python"
[4]: https://pypi.org/project/readability-lxml/?utm_source=chatgpt.com "readability-lxml - PyPI"
[5]: https://pypi.org/project/markdownify/?utm_source=chatgpt.com "markdownify · PyPI"
[6]: https://github.com/pgvector/pgvector?utm_source=chatgpt.com "GitHub - pgvector/pgvector: Open-source vector similarity search for ..."
[7]: https://platform.openai.com/docs/models/text-embedding-3-large?utm_source=chatgpt.com "OpenAI Platform"
[8]: https://weaviate.io/?utm_source=chatgpt.com "The AI-native database developers love - Weaviate"
[9]: https://weaviate.io/developers/weaviate/introduction?utm_source=chatgpt.com "Introduction - Weaviate"
[10]: https://docs.scrapy.org/?utm_source=chatgpt.com "Scrapy 2.13 documentation — Scrapy 2.13.1 documentation"
[11]: https://secure.cognito.co.nz/developer/mwscript/?utm_source=chatgpt.com "MoneyWorks Developer Resources » MWScript - Cognito"
